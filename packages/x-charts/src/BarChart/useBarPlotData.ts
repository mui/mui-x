import { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import getColor from './seriesConfig/bar/getColor';
import { ChartDrawingArea, useChartId, useGetIsItemVisible, useXAxes, useYAxes } from '../hooks';
import { MaskData, ProcessedBarData, ProcessedBarSeriesData } from './types';
import { checkScaleErrors } from './checkScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { findMinMax } from '../internals/findMinMax';
import type { VisibilityItemIdentifier } from '../internals/plugins/featurePlugins/useChartVisibilityManager';

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
  const isItemVisible = useGetIsItemVisible();

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
      const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

      checkScaleErrors(verticalLayout, seriesId, series[seriesId], xAxisId, xAxes, yAxisId, yAxes);

      const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;

      const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);

      const seriesDataPoints: ProcessedBarData[] = [];
      for (let dataIndex = 0; dataIndex < baseScaleConfig.data!.length; dataIndex += 1) {
        const barDimensions = getBarDimensions({
          verticalLayout,
          xAxisConfig,
          yAxisConfig,
          series: series[seriesId],
          dataIndex,
          numberOfGroups: stackingGroups.length,
          groupIndex,
          isItemVisible,
        });

        if (barDimensions == null) {
          continue;
        }

        const stackId = series[seriesId].stack;

        const result = {
          seriesId,
          dataIndex,
          layout: series[seriesId].layout,
          ...barDimensions,
          xOrigin: Math.round(xScale(0) ?? 0),
          yOrigin: Math.round(yScale(0) ?? 0),
          color: colorGetter(dataIndex),
          value: series[seriesId].data[dataIndex],
          maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
        };

        if (
          result.x > xMax ||
          result.x + result.width < xMin ||
          result.y > yMax ||
          result.y + result.height < yMin
        ) {
          continue;
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

        const value = result.value ?? 0;
        mask.hasNegative = mask.hasNegative || (reverse ? value > 0 : value < 0);
        mask.hasPositive = mask.hasPositive || (reverse ? value < 0 : value > 0);

        seriesDataPoints.push(result);
      }

      return {
        seriesId,
        barLabel: series[seriesId].barLabel,
        barLabelPlacement: series[seriesId].barLabelPlacement,
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

function shouldInvertStartCoordinate(verticalLayout: boolean, baseValue: number, reverse: boolean) {
  const isVerticalAndPositive = verticalLayout && baseValue > 0;
  const isHorizontalAndNegative = !verticalLayout && baseValue < 0;
  const invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;

  return reverse ? !invertStartCoordinate : invertStartCoordinate;
}

export function getBarDimensions(params: {
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  series: ChartSeriesDefaultized<'bar'>;
  dataIndex: number;
  numberOfGroups: number;
  groupIndex: number;
  isItemVisible: (identifier: VisibilityItemIdentifier) => boolean;
}) {
  const {
    verticalLayout,
    xAxisConfig,
    yAxisConfig,
    series,
    dataIndex,
    numberOfGroups,
    groupIndex,
    isItemVisible,
  } = params;

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;
  const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

  const { barWidth, offset } = getBandSize({
    bandWidth: baseScaleConfig.scale.bandwidth(),
    numberOfGroups,
    gapRatio: baseScaleConfig.barGapRatio,
  });
  const barOffset = groupIndex * (barWidth + offset);

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;

  const baseValue = baseScaleConfig.data![dataIndex];
  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const visibleValues = series.visibleStackedData[dataIndex];
  const fullValues = series.fullStackedData[dataIndex];
  const visibleValueCoordinates = visibleValues.map((v) =>
    verticalLayout ? yScale(v)! : xScale(v)!,
  );
  const fullValueCoordinates = fullValues.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

  const [visibleMinValueCoord, visibleMaxValueCoord] = findMinMax(visibleValueCoordinates);
  const [fullMinValueCoord, fullMaxValueCoord] = findMinMax(fullValueCoordinates);

  const isVisible = isItemVisible({ seriesId: series.id });

  const minValue = isVisible ? visibleMinValueCoord : fullMinValueCoord;

  const barSize =
    seriesValue === 0 ? 0 : Math.max(series.minBarSize, visibleMaxValueCoord - minValue);
  const maxValue = isVisible ? visibleMaxValueCoord - barSize : visibleMinValueCoord;
  const startCoordinate = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse)
    ? maxValue
    : minValue;

  return {
    x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
    y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
    height: verticalLayout ? barSize : barWidth,
    width: verticalLayout ? barWidth : barSize,
  };
}
