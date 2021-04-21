import { GridScrollBarState, GridViewportSizeState } from '../gridContainerProps';

/**
 * Object passed as parameter onto the resize event handler.
 */
export interface GridResizeParams {
  /**
   * The viewport sizes state.
   */
  viewportSizes: GridViewportSizeState;
  /**
   * The scrollbar state.
   */
  scrollBar: GridScrollBarState;
}
