import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartOptionalRootSelector } from '../../utils/selectors';
import type { ChartState } from '../../models/chart';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import type { ProcessedSeries } from '../../corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { AxisId, AxisItemIdentifier, ChartsAxisProps } from '../../../../models/axis';

const selectKeyboardNavigation: ChartOptionalRootSelector<UseChartKeyboardNavigationSignature> = (
  state,
) => state.keyboardNavigation;

/**
 * The chart owns the DOM focus AND the focus should be rendered.
 * A pointer-driven focus is `isFocused` without being visible.
 */
const isFocusVisible = (
  keyboardNavigationState:
    UseChartKeyboardNavigationSignature['state']['keyboardNavigation'] | undefined,
) => keyboardNavigationState?.isFocused === true && keyboardNavigationState.isFocusVisible === true;

export const selectorChartsIsFocusVisible = createSelector(
  selectKeyboardNavigation,
  isFocusVisible,
);

export const selectorChartsItemIsFocused = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState, item: FocusedItemIdentifier<ChartSeriesType>) =>
    isFocusVisible(keyboardNavigationState) &&
    keyboardNavigationState?.item != null &&
    fastObjectShallowCompare(keyboardNavigationState.item, item),
);

export const selectorChartsHasFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) =>
    isFocusVisible(keyboardNavigationState) && keyboardNavigationState?.item != null,
);

export const selectorChartsFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) =>
    isFocusVisible(keyboardNavigationState) ? (keyboardNavigationState?.item ?? null) : null,
);

/**
 * The item that is either
 * - currently focused
 * - will be focused when user focuses the chart
 */
export const selectorChartsFocusedOrToFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item ?? null,
);

export const selectorChartsIsZoomAnnounced = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.announceZoom === true,
);

export const selectorChartsIsKeyboardNavigationEnabled = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => !!keyboardNavigationState?.enabled,
);

const selectKeyboardActivationFeature = (
  state: ChartState<[], [UseChartKeyboardNavigationSignature]>,
) => state.experimentalFeatures?.keyboardActivation;

export const selectorChartsIsKeyboardActivationEnabled = createSelector(
  selectKeyboardNavigation,
  selectKeyboardActivationFeature,
  (keyboardNavigationState, keyboardActivation) =>
    keyboardActivation === true && !!keyboardNavigationState?.enabled,
);

/**
 * Selectors to override highlight behavior.
 */

const createSelectAxisHighlight =
  (direction: 'x' | 'y') =>
  <SeriesType extends ChartSeriesType>(
    item: FocusedItemIdentifier<SeriesType> | null,
    axis: ComputeResult<ChartsAxisProps>,
    series: ProcessedSeries<SeriesType>,
  ): AxisItemIdentifier | undefined => {
    if (item == null || !('dataIndex' in item) || item.dataIndex === undefined) {
      return undefined;
    }

    const seriesConfig = series[item.type as SeriesType]?.series[item.seriesId];
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

export const selectorChartsKeyboardItem = createSelectorMemoized(
  selectKeyboardNavigation,
  function selectorChartsKeyboardItem(keyboardState) {
    if (!isFocusVisible(keyboardState) || keyboardState?.item == null) {
      return null;
    }
    const { type, seriesId } = keyboardState.item;

    if (type === undefined || seriesId === undefined) {
      return null;
    }
    return keyboardState.item;
  },
);
