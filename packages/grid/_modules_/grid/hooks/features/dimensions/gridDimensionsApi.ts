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
  getRootDimensions: () => GridDimensions | null;

  /**
   * Returns the amount of rows that are currently visible in the viewport
   * @returns {number} The amount of rows visible in the viewport
   * @ignore - do not document.
   */
  unstable_getViewportPageSize: () => number;
}
