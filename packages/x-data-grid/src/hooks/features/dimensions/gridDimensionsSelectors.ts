import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridDimensionsSelector = (state: GridStateCommunity) => state.dimensions;

/**
 * @ignore internal use
 */
export const gridRowHeightSelector = (state: GridStateCommunity) => state.dimensions.rowHeight;

export const gridDimensionsColumnsTotalWidthSelector = (state: GridStateCommunity) =>
  state.dimensions.columnsTotalWidth;

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
