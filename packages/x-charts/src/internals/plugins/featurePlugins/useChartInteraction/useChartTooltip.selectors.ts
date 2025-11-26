import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  ChartItemIdentifierWithData,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import {
  ProcessedSeries,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { TooltipPositionGetterAxesConfig } from '../../models/seriesConfig/tooltipItemPositionGetter.types';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import {
  selectorChartsKeyboardItem,
  selectorChartsKeyboardItemIsDefined,
} from '../useChartKeyboardNavigation';
import {
  selectorChartsInteractionItem,
  selectorChartsInteractionItemIsDefined,
  selectorChartsLastInteraction,
} from './useChartInteraction.selectors';
import { ChartSeriesConfig } from '../../models/seriesConfig/seriesConfig.types';
import { AxisId, ChartsXAxisProps, ChartsYAxisProps } from '../../../../models/axis';
import { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { isCartesianSeries } from '../../../isCartesian';

export const selectorChartsTooltipItem = createSelector(
  selectorChartsLastInteraction,
  selectorChartsInteractionItem,
  selectorChartsKeyboardItem,
  (lastInteraction, interactionItem, keyboardItem) =>
    lastInteraction === 'keyboard' ? keyboardItem : (interactionItem ?? null),
);

export const selectorChartsTooltipItemIsDefined = createSelector(
  selectorChartsLastInteraction,
  selectorChartsInteractionItemIsDefined,
  selectorChartsKeyboardItemIsDefined,

  (lastInteraction, interactionItemIsDefined, keyboardItemIsDefined) =>
    lastInteraction === 'keyboard' ? keyboardItemIsDefined : interactionItemIsDefined,
);

export const selectorChartsTooltipItemPosition = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorChartDrawingArea,
  selectorChartSeriesConfig,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartSeriesProcessed,

  function selectorChartsTooltipItemPosition<T extends ChartSeriesType>(
    identifier: ChartItemIdentifierWithData<T> | null,
    drawingArea: ChartDrawingArea,
    seriesConfig: ChartSeriesConfig<T>,
    { axis: xAxis, axisIds: xAxisIds }: ComputeResult<ChartsXAxisProps>,
    { axis: yAxis, axisIds: yAxisIds }: ComputeResult<ChartsYAxisProps>,
    series: ProcessedSeries<T>,
    placement: 'top' | 'bottom' | 'left' | 'right' = 'top',
  ) {
    if (!identifier) {
      return null;
    }

    const itemSeries = series[identifier.type as T]?.series[identifier.seriesId] as
      | ChartSeriesDefaultized<T>
      | undefined;

    if (itemSeries) {
      const axesConfig: TooltipPositionGetterAxesConfig = {};

      const xAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
        ? (itemSeries.xAxisId ?? xAxisIds[0])
        : undefined;
      const yAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
        ? (itemSeries.yAxisId ?? yAxisIds[0])
        : undefined;

      if (xAxisId !== undefined) {
        axesConfig.x = xAxis[xAxisId];
      }
      if (yAxisId !== undefined) {
        axesConfig.y = yAxis[yAxisId];
      }

      return (
        seriesConfig[itemSeries.type as T].tooltipItemPositionGetter?.({
          series,
          drawingArea,
          axesConfig,
          identifier,
          placement,
        }) ?? null
      );
    }

    return null;
  },
);
