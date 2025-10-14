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
import { createSelector } from '../../utils/selectors';
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
import { ChartsXAxisProps, ChartsYAxisProps } from '../../../../models/axis';
import { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';

export const selectorChartsTooltipItem = createSelector(
  [selectorChartsLastInteraction, selectorChartsInteractionItem, selectorChartsKeyboardItem],
  (lastInteraction, interactionItem, keyboardItem) =>
    lastInteraction === 'keyboard' ? keyboardItem : (interactionItem ?? null),
);

export const selectorChartsTooltipItemIsDefined = createSelector(
  [
    selectorChartsLastInteraction,
    selectorChartsInteractionItemIsDefined,
    selectorChartsKeyboardItemIsDefined,
  ],
  (lastInteraction, interactionItemIsDefined, keyboardItemIsDefined) =>
    lastInteraction === 'keyboard' ? keyboardItemIsDefined : interactionItemIsDefined,
);

export const selectorChartsTooltipItemPosition = createSelector(
  [
    selectorChartsTooltipItem,
    selectorChartSeriesConfig,
    selectorChartXAxis,
    selectorChartYAxis,
    selectorChartSeriesProcessed,
    (_, placement?: 'top' | 'bottom' | 'left' | 'right') => placement,
  ],
  function selectorChartsTooltipItemPosition<T extends ChartSeriesType>(
    identifier: ChartItemIdentifierWithData<T> | null,
    seriesConfig: ChartSeriesConfig<T>,
    { axis: xAxis, axisIds: xAxisIds }: ComputeResult<ChartsXAxisProps>,
    { axis: yAxis, axisIds: yAxisIds }: ComputeResult<ChartsYAxisProps>,
    series: ProcessedSeries<T>,
    placement: 'top' | 'bottom' | 'left' | 'right' = 'top',
  ) {
    if (!identifier) {
      return null;
    }


    const xAxisId = (series as any).xAxisId ?? xAxisIds[0];
    const yAxisId = (series as any).yAxisId ?? yAxisIds[0];

    if (identifier) {
      const itemSeries = series[identifier.type as T]?.series[identifier.seriesId] as
        | ChartSeriesDefaultized<T>
        | undefined;

      if (itemSeries) {
        const axesConfig: TooltipPositionGetterAxesConfig = {};

        if (xAxisId !== undefined) {
          axesConfig.x = xAxis[xAxisId];
        }
        if (yAxisId !== undefined) {
          axesConfig.y = yAxis[yAxisId];
        }

        return seriesConfig[itemSeries.type as T].tooltipItemPositionGetter?.({
          series,
          axesConfig,
          identifier,
          placement,
        }) ?? null;
      }
    }
    return null;
  },
);
