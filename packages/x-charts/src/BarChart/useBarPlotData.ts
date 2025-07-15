import { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis } from '../models/axis';
import getColor from './seriesConfig/getColor';
import { ChartDrawingArea, useChartId, useXAxes, useYAxes } from '../hooks';
import { MaskData, ProcessedBarSeriesData } from './types';
import { checkScaleErrors } from './checkScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';

export function useBarPlotData(
  drawingArea: ChartDrawingArea,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
): {
  completedData: ProcessedBarSeriesData[];
  masksData: MaskData[];
} {
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];

  const chartId = useChartId();

  const { series, stackingGroups } = seriesData;

  const masks: Record<string, MaskData> = {};

  const data = stackingGroups.flatMap(({ ids: seriesIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;

    return seriesIds.map((seriesId) => {
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

      const { stackedData, data: currentSeriesData, layout, minBarSize } = series[seriesId];

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

          const { barSize, startCoordinate } = getValueCoordinate(
            verticalLayout,
            minValueCoord,
            maxValueCoord,
            currentSeriesData[dataIndex],
            minBarSize,
          );

          const result = {
            seriesId,
            dataIndex,
            layout,
            x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
            y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
            xOrigin: xScale(0) ?? 0,
            yOrigin: yScale(0) ?? 0,
            height: verticalLayout ? barSize : barWidth,
            width: verticalLayout ? barWidth : barSize,
            color: colorGetter(dataIndex),
            value: currentSeriesData[dataIndex],
            maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
          };

          if (
            result.x > xMax ||
            result.x + result.width < xMin ||
            result.y > yMax ||
            result.y + result.height < yMin
          ) {
            return null;
          }

          if (!masks[result.maskId]) {
            masks[result.maskId] = {
              id: result.maskId,
              width: 0,
              height: 0,
              hasNegative: false,
              hasPositive: false,
              layout: result.layout,
              xOrigin: xScale(0)!,
              yOrigin: yScale(0)!,
              x: 0,
              y: 0,
            };
          }

          const mask = masks[result.maskId];
          mask.width = result.layout === 'vertical' ? result.width : mask.width + result.width;
          mask.height = result.layout === 'vertical' ? mask.height + result.height : result.height;
          mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
          mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);
          mask.hasNegative = mask.hasNegative || (result.value ?? 0) < 0;
          mask.hasPositive = mask.hasPositive || (result.value ?? 0) > 0;

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
    masksData: Object.values(masks),
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

function getValueCoordinate(
  isVertical: boolean,
  minValueCoord: number,
  maxValueCoord: number,
  baseValue: number,
  minBarSize: number,
): { barSize: number; startCoordinate: number } {
  const isSizeLessThanMin = maxValueCoord - minValueCoord < minBarSize;
  const barSize = isSizeLessThanMin ? minBarSize : maxValueCoord - minValueCoord;

  const isVerticalAndPositive = isVertical && baseValue >= 0;
  const isHorizontalAndNegative = !isVertical && baseValue < 0;

  if (isSizeLessThanMin && (isVerticalAndPositive || isHorizontalAndNegative)) {
    return {
      barSize,
      startCoordinate: maxValueCoord - barSize,
    };
  }

  return { barSize, startCoordinate: minValueCoord };
}
