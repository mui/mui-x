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

        const rotationAxisConfig = rotationAxes[rotationAxisId] as ComputedAxis<'band'>;
        const radiusAxisConfig = radiusAxes[radiusAxisId];

        const reverse = radiusAxisConfig.reverse ?? false;
        const radiusScale = radiusAxisConfig.scale;
        const rotationScale = rotationAxisConfig.scale;
        const bandwidth = rotationScale.bandwidth();

        const { barWidth: bandSlice, offset } = getBandSize(
          bandwidth,
          stackingGroups.length,
          rotationAxisConfig.barGapRatio,
        );

        const seriesDataPoints: ProcessedRadialBarData[] = [];

        for (let dataIndex = 0; dataIndex < rotationAxisConfig.data!.length; dataIndex += 1) {
          const seriesValue = seriesItem.data[dataIndex];

          if (seriesValue == null) {
            continue;
          }

          const stackValues = seriesItem.visibleStackedData[dataIndex];
          const stackRadii = stackValues.map((v) => radiusScale(v)!);
          const [minRadius, maxRadius] = findMinMax(stackRadii);

          let barSize = 0;
          if (seriesValue !== 0 && !seriesItem.hidden) {
            barSize = Math.max(seriesItem.minBarSize ?? 0, maxRadius - minRadius);
          }

          const isPositive = reverse ? seriesValue < 0 : seriesValue > 0;
          const innerRadius = isPositive ? maxRadius - barSize : minRadius;
          const outerRadius = isPositive ? maxRadius : minRadius + barSize;

          const baseAngle = rotationScale(rotationAxisConfig.data![dataIndex])!;
          const startAngle = baseAngle + groupIndex * (bandSlice + offset);
          const endAngle = startAngle + bandSlice;

          seriesDataPoints.push({
            seriesId,
            dataIndex,
            hidden: seriesItem.hidden,
            color: seriesItem.color,
            value: seriesValue,
            startAngle,
            endAngle,
            innerRadius,
            outerRadius,
          });
        }

        return {
          seriesId,
          data: seriesDataPoints,
        };
      });
    },
  );

  return {
    completedData: data,
  };
}
