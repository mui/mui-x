import { createSelector, createRootSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridDimensionsSelector = createRootSelector(
  (state: GridStateCommunity) => state.dimensions,
);

/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export const gridColumnsTotalWidthSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.columnsTotalWidth,
);

export const gridRowHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.rowHeight,
);

export const gridContentHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.contentSize.height,
);

export const gridHasScrollXSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.hasScrollX,
);

export const gridHasScrollYSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.hasScrollY,
);

export const gridHasFillerSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width,
);

export const gridHeaderHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.headerHeight,
);

export const gridGroupHeaderHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.groupHeaderHeight,
);

export const gridHeaderFilterHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.headerFilterHeight,
);

export const gridHorizontalScrollbarHeightSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => (dimensions.hasScrollX ? dimensions.scrollbarSize : 0),
);

export const gridVerticalScrollbarWidthSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => (dimensions.hasScrollY ? dimensions.scrollbarSize : 0),
);

export const gridHasBottomFillerSelector = createSelector(
  gridDimensionsSelector,
  gridHorizontalScrollbarHeightSelector,
  (dimensions, height) => {
    const needsLastRowBorder =
      dimensions.viewportOuterSize.height - dimensions.minimumSize.height > 0;

    if (height === 0 && !needsLastRowBorder) {
      return false;
    }

    return true;
  },
);
