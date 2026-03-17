import { createSelector } from '@mui/x-internals/store';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { type UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import {
  type ProcessedSeries,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import {
  type AxisId,
  type AxisItemIdentifier,
  type ChartsAxisProps,
} from '../../../../models/axis';

const selectKeyboardNavigation: ChartOptionalRootSelector<UseChartKeyboardNavigationSignature> = (
  state,
) => state.keyboardNavigation;

export const selectorChartsItemIsFocused = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState, item: FocusedItemIdentifier<ChartSeriesType>) =>
    keyboardNavigationState?.item != null &&
    fastObjectShallowCompare(keyboardNavigationState.item, item),
);

export const selectorChartsHasFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item != null,
);

export const selectorChartsFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item ?? null,
);

export const selectorChartsIsKeyboardNavigationEnabled = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => !!keyboardNavigationState?.enableKeyboardNavigation,
);

/**
 * Selectors to override highlight behavior.
 */

const createSelectAxisHighlight =
  (direction: 'x' | 'y') =>
  <T extends ChartSeriesType>(
    item: FocusedItemIdentifier<T> | null,
    axis: ComputeResult<ChartsAxisProps>,
    series: ProcessedSeries<T>,
  ): AxisItemIdentifier | undefined => {
    if (item == null || !('dataIndex' in item) || item.dataIndex === undefined) {
      return undefined;
    }

    const seriesConfig = series[item.type as T]?.series[item.seriesId];
    if (!seriesConfig) {
      return undefined;
    }

    let axisId: AxisId | false | undefined =
      direction === 'x'
        ? 'xAxisId' in seriesConfig && seriesConfig.xAxisId
        : 'yAxisId' in seriesConfig && seriesConfig.yAxisId;

    if (axisId === undefined || axisId === false) {
      axisId = axis.axisIds[0];
    }

    return { axisId, dataIndex: item.dataIndex };
  };

export const selectorChartsKeyboardXAxisIndex = createSelector(
  selectorChartsFocusedItem,
  selectorChartXAxis,
  selectorChartSeriesProcessed,
  createSelectAxisHighlight('x'),
);

export const selectorChartsKeyboardYAxisIndex = createSelector(
  selectorChartsFocusedItem,
  selectorChartYAxis,
  selectorChartSeriesProcessed,
  createSelectAxisHighlight('y'),
);

export const selectorChartsKeyboardItem = createSelector(
  selectKeyboardNavigation,
  function selectorChartsKeyboardItem(keyboardState) {
    if (keyboardState?.item == null) {
      return null;
    }
    const { type, seriesId } = keyboardState.item;

    if (type === undefined || seriesId === undefined) {
      return null;
    }
    return keyboardState.item;
  },
);
