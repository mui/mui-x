import type { ElementSize } from '../../../models/elementSize';

export interface GridDimensions {
  /**
   * The viewport size including scrollbars.
   */
  viewportOuterSize: ElementSize;
  /**
   * The viewport size not including scrollbars.
   */
  viewportInnerSize: ElementSize;
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
  scrollBarSize: number;
}

export interface GridDimensionsApi {
  /**
   * Triggers a resize of the component and recalculation of width and height.
   */
  resize: () => void;
  /**
   * Returns the dimensions of the grid
   * @returns {GridDimensions | null} The dimension information of the grid. If `null`, the grid is not ready yet.
   */
  getRootDimensions: () => GridDimensions | null;
}

export interface GridDimensionsPrivateApi {
  /**
   * Returns the amount of rows that are currently visible in the viewport
   * @returns {number} The amount of rows visible in the viewport
   */
  getViewportPageSize: () => number;
  /**
   * Forces a recalculation of all dimensions.
   */
  updateGridDimensionsRef: () => void;
  /**
   * Computes the size and publishes a `resize` event with the new value.
   */
  computeSizeAndPublishResizeEvent: () => void;
}
