import { Size } from './core';

export interface DimensionsState {
  /**
   * Indicates that the dimensions have been initialized.
   */
  isReady: boolean;
  /**
   * The root container size.
   */
  root: Size;
  /**
   * The viewport size including scrollbars.
   */
  viewportOuterSize: Size;
  /**
   * The viewport size not including scrollbars.
   */
  viewportInnerSize: Size;
  /**
   * The size of the main content (unpinned rows & columns).
   */
  contentSize: Size;
  /**
   * The minimum size to display the grid, including all pinned sections and headers.
   */
  minimumSize: Size;
  /**
   * Indicates if a scroll is currently needed to go from the beginning of the first column to the end of the last column.
   */
  hasScrollX: boolean;
  /**
   * Indicates if a scroll is currently needed to go from the beginning of the first row to the end of the last row.
   */
  hasScrollY: boolean;
  /**
   * Size of the scrollbar used to scroll the rows in pixel.
   * It is defined even when the scrollbar is currently not needed.
   */
  scrollbarSize: number;
  /**
   * Width of a row. At least as wide as `viewportOuterSize.width`.
   */
  rowWidth: number;
  /**
   * Height of a row.
   */
  rowHeight: number;
  /**
   * Size of all the columns.
   */
  columnsTotalWidth: number;
  /**
   * Size of left pinned columns.
   */
  leftPinnedWidth: number;
  /**
   * Size of right pinned columns.
   */
  rightPinnedWidth: number;
  /**
   * Size of the top container.
   */
  topContainerHeight: number;
  /**
   * Size of the bottom container.
   */
  bottomContainerHeight: number;
  /**
   * Height of one column header.
   * XXX: remove?
   */
  headerHeight: number;
  /**
   * Height of one column group header.
   * XXX: remove?
   */
  groupHeaderHeight: number;
  /**
   * Height of header filters.
   * XXX: remove?
   */
  headerFilterHeight: number;
  /**
   * Height of all the column headers.
   * XXX: remove?
   */
  headersTotalHeight: number;
}

/**
 * The rows total height and positions.
 */
export interface RowsMetaState {
  /**
   * The grid rows positions.
   */
  positions: number[];
  /**
   * The sum of all visible grid rows in the current rows.
   */
  currentPageTotalHeight: number;
  /**
   * The total height of the pinned top rows.
   */
  pinnedTopRowsTotalHeight: number;
  /**
   * The total height of the pinned bottom rows.
   */
  pinnedBottomRowsTotalHeight: number;
}

export interface RowVisibilityParams {
  /**
   * Whether this row is the first visible or not.
   */
  isFirstVisible: boolean;
  /**
   * Whether this row is the last visible or not.
   */
  isLastVisible: boolean;
  /**
   * Index of the row in the current page.
   * If the pagination is disabled, it will be the index relative to all filtered rows.
   */
  indexRelativeToCurrentPage: number;
}

export interface RowSpacing {
  top?: number;
  bottom?: number;
}

export type HeightEntry = {
  content: number;
  spacingTop: number;
  spacingBottom: number;
  detail: number;

  autoHeight: boolean;
  needsFirstMeasurement: boolean;
};
