import { ChartOptionalRootSelector, createSelector } from '../../utils/selectors';
import { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import { ProcessedSeries, selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { ComputeResult } from '../useChartCartesianAxis/computeAxisValue';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';
import { AxisId, AxisItemIdentifier, ChartsAxisProps } from '../../../../models/axis';

const selectKeyboardNavigation: ChartOptionalRootSelector<UseChartKeyboardNavigationSignature> = (
  state,
) => state.keyboardNavigation;

export const selectorChartsHasFocusedItem = createSelector(
  [selectKeyboardNavigation],
  (keyboardNavigationState) => keyboardNavigationState?.item != null,
);

export const selectorChartsFocusedSeriesType = createSelector(
  [selectKeyboardNavigation],
  (keyboardNavigationState) => keyboardNavigationState?.item?.type,
);

export const selectorChartsFocusedSeriesId = createSelector(
  [selectKeyboardNavigation],
  (keyboardNavigationState) => keyboardNavigationState?.item?.seriesId,
);

export const selectorChartsFocusedDataIndex = createSelector(
  [selectKeyboardNavigation],
  (keyboardNavigationState) => keyboardNavigationState?.item?.dataIndex,
);

export const selectorChartsIsKeyboardNavigationEnabled = createSelector(
  [selectKeyboardNavigation],
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
  [
    selectorChartsFocusedSeriesType,
    selectorChartsFocusedSeriesId,
    selectorChartsFocusedDataIndex,
    selectorChartXAxis,
    selectorChartSeriesProcessed,
  ],
  createSelectAxisHighlight('x'),
);

export const selectorChartsKeyboardYAxisIndex = createSelector(
  [
    selectorChartsFocusedSeriesType,
    selectorChartsFocusedSeriesId,
    selectorChartsFocusedDataIndex,
    selectorChartYAxis,
    selectorChartSeriesProcessed,
  ],
  createSelectAxisHighlight('y'),
);

export const selectorChartsKeyboardItem = createSelector(
  [selectorChartsFocusedSeriesType, selectorChartsFocusedSeriesId, selectorChartsFocusedDataIndex],
  function selectorChartsKeyboardItem(seriesType, seriesId, dataIndex) {
    if (seriesId === undefined) {
      return null;
    }
    return { seriesId, dataIndex: seriesType === 'line' ? undefined : dataIndex };
  },
);
