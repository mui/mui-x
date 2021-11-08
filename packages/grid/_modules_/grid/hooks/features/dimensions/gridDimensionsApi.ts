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
   * The maximum amount of rows that could fit into the viewport without needing a scrollBar.
   */
  maximumPageSizeWithoutScrollBar: number;
  /**
   * Amount of rows passed to the virtual scroller.
   */
  virtualScrollerRowCount: number;
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
}
