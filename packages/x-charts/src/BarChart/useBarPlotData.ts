import { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import getColor from './seriesConfig/bar/getColor';
import { ChartDrawingArea, useChartId, useXAxes, useYAxes } from '../hooks';
import { MaskData, ProcessedBarData, ProcessedBarSeriesData } from './types';
import { checkBarChartScaleErrors } from './checkBarChartScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { findMinMax } from '../internals/findMinMax';
import {
  selectorIsIdentifierVisibleGetter,
  type IsIdentifierVisibleFunction,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import { getBandSize } from '../internals/getBandSize';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

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
  const store = useStore<[UseChartVisibilityManagerSignature]>();
  const isItemVisible = useSelector(store, selectorIsIdentifierVisibleGetter).get;

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
      const layout = series[seriesId].layout;

      const xAxisConfig = xAxes[xAxisId];
      const yAxisConfig = yAxes[yAxisId];

      const verticalLayout = series[seriesId].layout === 'vertical';
      const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

      checkBarChartScaleErrors(
        verticalLayout,
        seriesId,
        series[seriesId].fullStackedData.length,
        xAxisId,
        xAxes,
        yAxisId,
        yAxes,
      );

      const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;
      const xOrigin = Math.round(xScale(0) ?? 0);
      const yOrigin = Math.round(yScale(0) ?? 0);

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
          hidden: series[seriesId].hidden,
          ...barDimensions,
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
            layout,
            xOrigin,
            yOrigin,
            x: 0,
            y: 0,
          };
        }

        const mask = masks[result.maskId];
        mask.width = layout === 'vertical' ? result.width : mask.width + result.width;
        mask.height = layout === 'vertical' ? mask.height + result.height : result.height;
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
        layout,
        xOrigin,
        yOrigin,
      };
    });
  });

  return {
    completedData: data,
    masksData: Object.values(masks),
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
  isItemVisible: IsIdentifierVisibleFunction;
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

  const { barWidth, offset } = getBandSize(
    baseScaleConfig.scale.bandwidth(),
    numberOfGroups,
    baseScaleConfig.barGapRatio,
  );
  const barOffset = groupIndex * (barWidth + offset);

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;

  const baseValue = baseScaleConfig.data![dataIndex];
  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const visibleValues = series.visibleStackedData[dataIndex];
  const visibleValueCoordinates = visibleValues.map((v) =>
    verticalLayout ? yScale(v)! : xScale(v)!,
  );

  const [visibleMinValueCoord, visibleMaxValueCoord] = findMinMax(visibleValueCoordinates);

  const isVisible = isItemVisible(`${series.id}`);

  let barSize = 0;
  if (seriesValue !== 0) {
    if (isVisible) {
      barSize = Math.max(series.minBarSize, visibleMaxValueCoord - visibleMinValueCoord);
    }
  }

  const shouldInvert = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse);

  let startCoordinate = 0;

  if (shouldInvert) {
    startCoordinate = visibleMaxValueCoord - barSize;
  } else {
    startCoordinate = visibleMinValueCoord;
  }

  return {
    x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
    y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
    height: verticalLayout ? barSize : barWidth,
    width: verticalLayout ? barWidth : barSize,
  };
}
