import type { ElementSize } from '../../../models/elementSize';

export interface GridDimensions {
  /**
   * Dimensions of the element containing all the rows
   * If their are scrollbars, this size includes the dimensions of those scrollbars
   */
  rowsContainer: ElementSize;
  /**
   * Dimensions of the element containing all the rows
   * If their are scrollbars, this size does not includes the dimensions of those scrollbars
   */
  rowsContent: ElementSize;
  /**
   * Amount of rows that are fully visible
   */
  rowsInViewportCount: number;
  /**
   * Amount of rows in the current page
   */
  currentPageRowCount: number;
  hasScrollX: boolean;
  hasScrollY: boolean;
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
  getDimensions: () => GridDimensions | null;
}
