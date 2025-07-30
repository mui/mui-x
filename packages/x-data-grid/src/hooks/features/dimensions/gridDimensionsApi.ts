import type { DimensionsState } from '@mui/x-virtualizer/models/dimensions';

export interface GridDimensions extends DimensionsState {
  /**
   * Height of one column header.
   */
  headerHeight: number;
  /**
   * Height of one column group header.
   */
  groupHeaderHeight: number;
  /**
   * Height of header filters.
   */
  headerFilterHeight: number;
  /**
   * Height of all the column headers.
   */
  headersTotalHeight: number;
}

export interface GridDimensionsApi {
  /**
   * Returns the dimensions of the grid
   * @returns {GridDimensions} The dimension information of the grid. If `null`, the grid is not ready yet.
   */
  getRootDimensions: () => GridDimensions;
}

export interface GridDimensionsPrivateApi {
  /**
   * Recalculates the grid layout. This should be called when an operation has changed the size
   * of the content of the grid.
   */
  updateDimensions: () => void;
  /**
   * Returns the amount of rows that are currently visible in the viewport
   * @returns {number} The amount of rows visible in the viewport
   */
  getViewportPageSize: () => number;
}
