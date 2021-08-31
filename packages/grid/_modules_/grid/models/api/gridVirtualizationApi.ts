import { GridCellIndexCoordinates } from '../gridCell';
import { GridContainerProps } from '../gridContainerProps';
import { GridScrollParams } from '../params/gridScrollParams';
import { GridRenderContextProps } from '../gridRenderContextProps';

/**
 * The virtualization API interface that is available in the grid [[apiRef]].
 */
export interface GridVirtualizationApi {
  /**
   * Triggers the viewport to scroll to the given positions (in pixels).
   * @param {GridScrollParams} params An object contaning the `left` or `top` position to scroll.
   */
  scroll: (params: Partial<GridScrollParams>) => void;
  /**
   * Triggers the viewport to scroll to the cell at indexes given by `params`.
   * Returns `true` if the grid had to scroll to reach the target.
   * @param {GridCellIndexCoordinates} params The indexes where the cell is.
   * @returns {boolean} Returns `true` if the index was outside of the viewport and the grid had to scroll to reach the target.
   */
  scrollToIndexes: (params: Partial<GridCellIndexCoordinates>) => boolean;
  /**
   * Get the current containerProps.
   * @returns {GridContainerProps | null} The container properties.
   * @ignore - do not document.
   */
  getContainerPropsState: () => GridContainerProps | null;
  /**
   * Get the current renderContext.
   * @returns {Partial<GridRenderContextProps> | undefined} The render context.
   * @ignore - do not document.
   */
  getRenderContextState: () => Partial<GridRenderContextProps> | undefined;
  /**
   * Returns the current scroll position.
   * @returns {GridScrollParams} The scroll positions.
   */
  getScrollPosition: () => GridScrollParams;
  /**
   * Refreshes the viewport cells according to the scroll positions
   * @param {boolean} forceRender If `true`, forces a rerender. By default, it is `false`.
   * @ignore - do not document.
   */
  updateViewport: (forceRender?: boolean) => void;
}
