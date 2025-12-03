import { createSelector } from '@mui/x-internals/store';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { type UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import { type ProcessedSeries, selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { type ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type AxisId, type AxisItemIdentifier, type ChartsAxisProps } from '../../../../models/axis';
import { type FocusedItemData } from '../../../../hooks/useFocusedItem';

const selectKeyboardNavigation: ChartOptionalRootSelector<UseChartKeyboardNavigationSignature> = (
  state,
) => state.keyboardNavigation;

export const selectorChartsItemIsFocused = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState, item: FocusedItemData) => {
    return (
      keyboardNavigationState?.item != null &&
      keyboardNavigationState.item.type === item.seriesType &&
      keyboardNavigationState.item.seriesId === item.seriesId &&
      keyboardNavigationState.item.dataIndex === item.dataIndex
    );
  },
);

export const selectorChartsHasFocusedItem = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item != null,
);

export const selectorChartsFocusedSeriesType = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item?.type,
);

export const selectorChartsFocusedSeriesId = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item?.seriesId,
);

export const selectorChartsFocusedDataIndex = createSelector(
  selectKeyboardNavigation,
  (keyboardNavigationState) => keyboardNavigationState?.item?.dataIndex,
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
    type: T | undefined,
    seriesId: SeriesId | undefined,
    dataIndex: number | undefined,
    axis: ComputeResult<ChartsAxisProps>,
    series: ProcessedSeries<T>,
  ): AxisItemIdentifier | undefined => {
    if (type === undefined || seriesId === undefined || dataIndex === undefined) {
      return undefined;
    }

    const seriesConfig = series[type]?.series[seriesId];
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

    return { axisId, dataIndex };
  };

export const selectorChartsKeyboardXAxisIndex = createSelector(
  selectorChartsFocusedSeriesType,
  selectorChartsFocusedSeriesId,
  selectorChartsFocusedDataIndex,
  selectorChartXAxis,
  selectorChartSeriesProcessed,
  createSelectAxisHighlight('x'),
);

export const selectorChartsKeyboardYAxisIndex = createSelector(
  selectorChartsFocusedSeriesType,
  selectorChartsFocusedSeriesId,
  selectorChartsFocusedDataIndex,
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

export const selectorChartsKeyboardItemIsDefined = createSelector(
  selectorChartsFocusedSeriesType,
  selectorChartsFocusedSeriesId,
  selectorChartsFocusedDataIndex,
  function selectorChartsKeyboardItemIsDefined(seriesType, seriesId, dataIndex) {
    return seriesId !== undefined && dataIndex !== undefined;
  },
);
