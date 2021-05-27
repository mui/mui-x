import { GridCellIndexCoordinates } from '../gridCell';
import { GridContainerProps } from '../gridContainerProps';
import { GridScrollParams } from '../params/gridScrollParams';
import { GridRenderContextProps } from '../gridRenderContextProps';
import { Optional } from '../../utils/utils';

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
  scrollToIndexes: (params: Optional<GridCellIndexCoordinates, 'rowIndex'>) => boolean;
  /**
   * Checks if a column at the index given by `colIndex` is currently visible in the viewport.
   * @param {number} colIndex To column index to check.
   * @returns {boolean} Returns `true` when the column is visible and `false` when it is not.
   */
  isColumnVisibleInWindow: (colIndex: number) => boolean;
  /**
   * Get the current containerProps.
   * @ignore - do not document.
   */
  getContainerPropsState: () => GridContainerProps | null;
  /**
   * Get the current renderContext.
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
   */
  updateViewport: (forceRender?: boolean) => void;
}
