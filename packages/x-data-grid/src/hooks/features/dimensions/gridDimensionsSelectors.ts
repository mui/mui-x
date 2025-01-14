import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { createSelector } from '../../../utils/createSelector';

export const gridDimensionsSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions;

/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export const gridColumnsTotalWidthSelector = createSelector(
  gridDimensionsSelector,
  (dimensions) => dimensions.columnsTotalWidth,
);

export const gridRowHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.rowHeight;

export const gridContentHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.contentSize.height;

export const gridHasScrollXSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.hasScrollX;

export const gridHasScrollYSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.hasScrollY;

export const gridHasFillerSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.columnsTotalWidth <
  apiRef.current.state.dimensions.viewportOuterSize.width;

export const gridHeaderHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.headerHeight;

export const gridGroupHeaderHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.groupHeaderHeight;

export const gridHeaderFilterHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.headerFilterHeight;

export const gridVerticalScrollbarWidthSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.hasScrollY ? apiRef.current.state.dimensions.scrollbarSize : 0;

export const gridHorizontalScrollbarHeightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.hasScrollX ? apiRef.current.state.dimensions.scrollbarSize : 0;

export const gridHasBottomFillerSelector = (apiRef: RefObject<GridApiCommunity>) => {
  const height = apiRef.current.state.dimensions.hasScrollX
    ? apiRef.current.state.dimensions.scrollbarSize
    : 0;
  const needsLastRowBorder =
    apiRef.current.state.dimensions.viewportOuterSize.height -
      apiRef.current.state.dimensions.minimumSize.height >
    0;

  if (height === 0 && !needsLastRowBorder) {
    return false;
  }

  return true;
};
