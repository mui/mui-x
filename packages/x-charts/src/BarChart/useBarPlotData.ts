import { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis } from '../models/axis';
import getColor from './seriesConfig/getColor';
import { ChartDrawingArea, useChartId, useXAxes, useYAxes } from '../hooks';
import { ProcessedBarSeriesData } from './types';
import { checkScaleErrors } from './checkScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { SeriesId } from '../models/seriesType/common';

export type BarStackMap = Map<string | number, { seriesId: SeriesId; dataIndex: number }>;

export function useBarPlotData(
  drawingArea: ChartDrawingArea,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
  withoutBorderRadius: boolean,
): {
  completedData: ProcessedBarSeriesData[];
  positiveStacks: BarStackMap;
  negativeStacks: BarStackMap;
} {
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];

  const chartId = useChartId();

  const { series, stackingGroups } = seriesData;

  const positiveStacks: BarStackMap = new Map();
  const negativeStacks: BarStackMap = new Map();

  const data = stackingGroups.flatMap(({ ids: seriesIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;

    return seriesIds.map((seriesId, seriesIndex) => {
      const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
      const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

      const xAxisConfig = xAxes[xAxisId];
      const yAxisConfig = yAxes[yAxisId];

      const verticalLayout = series[seriesId].layout === 'vertical';

      checkScaleErrors(verticalLayout, seriesId, series[seriesId], xAxisId, xAxes, yAxisId, yAxes);

      const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;

      const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
      const bandWidth = baseScaleConfig.scale.bandwidth();

      const { barWidth, offset } = getBandSize({
        bandWidth,
        numberOfGroups: stackingGroups.length,
        gapRatio: baseScaleConfig.barGapRatio,
      });
      const barOffset = groupIndex * (barWidth + offset);

      const { stackedData, data: currentSeriesData, layout } = series[seriesId];

      const seriesDataPoints = baseScaleConfig
        .data!.map((baseValue, dataIndex: number) => {
          if (currentSeriesData[dataIndex] == null) {
            return null;
          }
          const values = stackedData[dataIndex];
          const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

          const minValueCoord = Math.round(Math.min(...valueCoordinates));
          const maxValueCoord = Math.round(Math.max(...valueCoordinates));

          const stackId = series[seriesId].stack;

          const result = {
            seriesId,
            dataIndex,
            layout,
            x: verticalLayout ? xScale(baseValue)! + barOffset : minValueCoord,
            y: verticalLayout ? minValueCoord : yScale(baseValue)! + barOffset,
            xOrigin: xScale(0) ?? 0,
            yOrigin: yScale(0) ?? 0,
            height: verticalLayout ? maxValueCoord - minValueCoord : barWidth,
            width: verticalLayout ? barWidth : maxValueCoord - minValueCoord,
            color: colorGetter(dataIndex),
            value: currentSeriesData[dataIndex],
            maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
            stackId,
          };

          if (
            result.x > xMax ||
            result.x + result.width < xMin ||
            result.y > yMax ||
            result.y + result.height < yMin
          ) {
            return null;
          }

          if (!withoutBorderRadius) {
            const previousStack = stackId ?? seriesIds[seriesIndex - 1];
            if ((result.value ?? 0) > 0) {
              if (previousStack != null) {
                positiveStacks.delete(previousStack);
              }

              positiveStacks.set(`${stackId || seriesId}-${dataIndex}`, { seriesId, dataIndex });
            } else if ((result.value ?? 0) < 0) {
              if (previousStack != null) {
                negativeStacks.delete(previousStack);
              }

              negativeStacks.set(`${stackId || seriesId}-${dataIndex}`, { seriesId, dataIndex });
            }
          }

          return result;
        })
        .filter((rectangle) => rectangle !== null);

      return {
        seriesId,
        data: seriesDataPoints,
      };
    });
  });

  return {
    completedData: data,
    positiveStacks,
    negativeStacks,
  };
}

/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function getBandSize({
  bandWidth: W,
  numberOfGroups: N,
  gapRatio: r,
}: {
  bandWidth: number;
  numberOfGroups: number;
  gapRatio: number;
}) {
  if (r === 0) {
    return {
      barWidth: W / N,
      offset: 0,
    };
  }
  const barWidth = W / (N + (N - 1) * r);
  const offset = r * barWidth;
  return {
    barWidth,
    offset,
  };
}
