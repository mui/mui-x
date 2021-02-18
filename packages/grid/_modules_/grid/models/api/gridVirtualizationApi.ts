import { GridCellIndexCoordinates } from '../gridCell';
import { GridContainerProps } from '../gridContainerProps';
import { GridScrollParams } from '../params/gridScrollParams';
import { GridRenderContextProps } from '../gridRenderContextProps';

/**
 * The virtualization API interface that is available in the grid [[apiRef]].
 */
export interface GridVirtualizationApi {
  /**
   * Trigger the grid viewport to scroll to the position in pixel.
   * @param params
   */
  scroll: (params: Partial<GridScrollParams>) => void;
  /**
   * Trigger the grid viewport to scroll to a row of x y indexes.
   * @param params
   * @returns boolean Return if the index was outside of the viewport and the grid has to scroll to reach the target.
   */
  scrollToIndexes: (params: GridCellIndexCoordinates) => boolean;
  /**
   * Check if a column at index is currently visible in the viewport.
   * @param colIndex
   */
  isColumnVisibleInWindow: (colIndex: number) => boolean;
  /**
   * Get the current containerProps.
   */
  getContainerPropsState: () => GridContainerProps | null;
  /**
   * Get the current renderContext.
   */
  getRenderContextState: () => Partial<GridRenderContextProps> | undefined;
  /**
   * Refresh the viewport cells according to the scroll positions
   * @param forceRender
   */
  updateViewport: (forceRender?: boolean) => void;
}
