import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createSelector } from '../../../utils/createSelector';

export const gridDimensionsSelector = (state: GridStateCommunity) => state.dimensions;

/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export const gridColumnsTotalWidthSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.columnsTotalWidth,
);

export const gridRowHeightSelector = (state: GridStateCommunity) => state.dimensions.rowHeight;

export const gridContentHeightSelector = (state: GridStateCommunity) =>
  state.dimensions.contentSize.height;

export const gridHasScrollXSelector = (state: GridStateCommunity) => state.dimensions.hasScrollX;

export const gridHasScrollYSelector = (state: GridStateCommunity) => state.dimensions.hasScrollY;

export const gridHasFillerSelector = (state: GridStateCommunity) =>
  state.dimensions.columnsTotalWidth < state.dimensions.viewportOuterSize.width;

export const gridHeaderHeightSelector = (state: GridStateCommunity) =>
  state.dimensions.headerHeight;

export const gridGroupHeaderHeightSelector = (state: GridStateCommunity) =>
  state.dimensions.groupHeaderHeight;

export const gridHeaderFilterHeightSelector = (state: GridStateCommunity) =>
  state.dimensions.headerFilterHeight;

export const gridVerticalScrollbarWidthSelector = (state: GridStateCommunity) =>
  state.dimensions.hasScrollY ? state.dimensions.scrollbarSize : 0;

export const gridHorizontalScrollbarHeightSelector = (state: GridStateCommunity) =>
  state.dimensions.hasScrollX ? state.dimensions.scrollbarSize : 0;

export const gridHasBottomFillerSelector = (state: GridStateCommunity) => {
  const height = state.dimensions.hasScrollX ? state.dimensions.scrollbarSize : 0;
  const needsLastRowBorder =
    state.dimensions.viewportOuterSize.height - state.dimensions.minimumSize.height > 0;

  if (height === 0 && !needsLastRowBorder) {
    return false;
  }

  return true;
};
