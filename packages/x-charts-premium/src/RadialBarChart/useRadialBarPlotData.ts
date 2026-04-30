import * as React from 'react';
import { useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import {
  findMinMax,
  getBandSize,
  type AxisId,
  type ChartSeriesDefaultized,
  type ComputedAxis,
  type ScaleName,
  type SeriesProcessorResult,
  type StackingGroupsType,
  useAllSeriesOfType,
} from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';

interface ProcessedRadialBarData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: number | null;
  hidden: boolean;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

interface ProcessedRadialBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRadialBarData[];
  layout: 'vertical' | 'horizontal';
  rotationOrigin: number;
  radiusOrigin: number;
}

export function useRadialBarPlotData(): {
  completedData: ProcessedRadialBarSeriesData[];
} {
  const seriesData =
    useAllSeriesOfType('radialBar') ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'radialBar'>);

  const { rotationAxis: rotationAxes, rotationAxisIds } = useRotationAxes();
  const { radiusAxis: radiusAxes, radiusAxisIds } = useRadiusAxes();

  const defaultRotationAxisId = rotationAxisIds[0];
  const defaultRadiusAxisId = radiusAxisIds[0];

  return React.useMemo(
    () =>
      processRadialBarDataForPlot(
        seriesData.stackingGroups,
        seriesData.series,
        rotationAxes,
        radiusAxes,
        defaultRotationAxisId,
        defaultRadiusAxisId,
      ),
    [
      seriesData.stackingGroups,
      seriesData.series,
      rotationAxes,
      radiusAxes,
      defaultRotationAxisId,
      defaultRadiusAxisId,
    ],
  );
}

function processRadialBarDataForPlot(
  stackingGroups: StackingGroupsType,
  series: SeriesProcessorResult<'radialBar'>['series'],
  rotationAxes: Record<AxisId, ComputedAxis<ScaleName, any>>,
  radiusAxes: Record<AxisId, ComputedAxis<ScaleName, any>>,
  defaultRotationAxisId: AxisId,
  defaultRadiusAxisId: AxisId,
) {
  const data: ProcessedRadialBarSeriesData[] = stackingGroups.flatMap(
    ({ ids: seriesIds }, groupIndex) => {
      return seriesIds.map((seriesId) => {
        const seriesItem = series[seriesId] as ChartSeriesDefaultized<'radialBar'>;
        const rotationAxisId = seriesItem.rotationAxisId ?? defaultRotationAxisId;
        const radiusAxisId = seriesItem.radiusAxisId ?? defaultRadiusAxisId;
        const layout = seriesItem.layout;
        const verticalLayout = layout === 'vertical';

        const rotationAxisConfig = rotationAxes[rotationAxisId];
        const radiusAxisConfig = radiusAxes[radiusAxisId];

        const baseAxisConfig = (
          verticalLayout ? rotationAxisConfig : radiusAxisConfig
        ) as ComputedAxis<'band'>;
        const valueAxisConfig = verticalLayout ? radiusAxisConfig : rotationAxisConfig;

        const reverse = valueAxisConfig.reverse ?? false;
        const baseScale = baseAxisConfig.scale;
        const valueScale = valueAxisConfig.scale;

        const rotationOrigin = rotationAxisConfig.scale(0) ?? 0;
        const radiusOrigin = radiusAxisConfig.scale(0) ?? 0;

        const { barWidth: bandSlice, offset } = getBandSize(
          baseScale.bandwidth(),
          stackingGroups.length,
          baseAxisConfig.barGapRatio,
        );

        const seriesDataPoints: ProcessedRadialBarData[] = [];

        for (let dataIndex = 0; dataIndex < baseAxisConfig.data!.length; dataIndex += 1) {
          const seriesValue = seriesItem.data[dataIndex];

          if (seriesValue == null) {
            continue;
          }

          const stackValues = seriesItem.visibleStackedData[dataIndex];
          const stackCoords = stackValues.map((v) => valueScale(v)!);
          const [minValueCoord, maxValueCoord] = findMinMax(stackCoords);

          let barSize = 0;
          if (seriesValue !== 0 && !seriesItem.hidden) {
            barSize = Math.max(seriesItem.minBarSize ?? 0, maxValueCoord - minValueCoord);
          }

          const isPositive = reverse ? seriesValue < 0 : seriesValue > 0;
          const valueStart = isPositive ? maxValueCoord - barSize : minValueCoord;
          const valueEnd = isPositive ? maxValueCoord : minValueCoord + barSize;

          const baseStart =
            baseScale(baseAxisConfig.data![dataIndex])! + groupIndex * (bandSlice + offset);
          const baseEnd = baseStart + bandSlice;

          seriesDataPoints.push({
            seriesId,
            dataIndex,
            hidden: seriesItem.hidden,
            color: seriesItem.color,
            value: seriesValue,
            startAngle: verticalLayout ? baseStart : valueStart,
            endAngle: verticalLayout ? baseEnd : valueEnd,
            innerRadius: verticalLayout ? valueStart : baseStart,
            outerRadius: verticalLayout ? valueEnd : baseEnd,
          });
        }

        return {
          seriesId,
          data: seriesDataPoints,
          layout,
          rotationOrigin,
          radiusOrigin,
        };
      });
    },
  );

  return {
    completedData: data,
  };
}
