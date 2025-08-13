import { ChartOptionalRootSelector, createSelector } from '../../utils/selectors';
import { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';

const selectKeyboardNavigation: ChartOptionalRootSelector<UseChartKeyboardNavigationSignature> = (
  state,
) => state.keyboardNavigation;

export const selectorChartsFocusedSeriesType = createSelector(
  [selectKeyboardNavigation],
  (item) => item?.type,
);

export const selectorChartsFocusedSeriesId = createSelector(
  [selectKeyboardNavigation],
  (item) => item?.seriesId,
);

export const selectorChartsFocusedDataIndex = createSelector(
  [selectKeyboardNavigation],
  (item) => item?.dataIndex,
);
