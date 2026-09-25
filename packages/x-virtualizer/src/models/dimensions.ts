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
   * The size of the main content: the width of all the columns, the pinned columns included,
   * and the height of the current page rows, the pinned rows excluded.
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
   * Size of the top container.
   */
  topContainerHeight: number;
  /**
   * Size of the bottom container.
   */
  bottomContainerHeight: number;
  /**
   * Indicates that the container takes the height of its content.
   */
  autoHeight: boolean;
  /**
   * Minimal height to display the content area.
   */
  minimalContentHeight: string | number | undefined;
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

/**
 * The columns total width and positions.
 */
export interface ColumnsMetaState {
  /**
   * The columns positions.
   */
  positions: number[];
  /**
   * The sum of all column widths, the pinned columns included, rounded to one decimal place.
   */
  totalWidth: number;
  /**
   * The total width of the pinned left columns.
   */
  pinnedLeftColumnsTotalWidth: number;
  /**
   * The total width of the pinned right columns.
   */
  pinnedRightColumnsTotalWidth: number;
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
