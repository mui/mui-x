import type { ElementSize } from '../../../models/elementSize';

export interface GridDimensions {
  window: ElementSize;
  viewport: ElementSize;
  rowsInViewportCount: number;
  currentPageRowCount: number;
  hasScrollX: boolean;
  hasScrollY: boolean;
}

export interface ScrollBarSize extends ElementSize {
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
   * @returns {GridDimensions} The dimension information of the grid
   */
  getDimensions: () => GridDimensions;
}
