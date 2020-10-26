import { ScrollParams } from '../../hooks/utils';
import { CellIndexCoordinates } from '../rows';
import { ContainerProps } from '../containerProps';
import { RenderContextProps } from '../renderContextProps';

/**
 * The virtualization API interface that is available in the grid [[apiRef]].
 */
export interface VirtualizationApi {
  /**
   * Trigger the grid viewport to scroll to the position in pixel.
   * @param params
   */
  scroll: (params: Partial<ScrollParams>) => void;
  /**
   * Trigger the grid viewport to scroll to a row of x y indexes.
   * @param params
   * @returns boolean that indicates if the viewport has scrolled to reach the indexes
   */
  scrollToIndexes: (params: CellIndexCoordinates) => boolean;
  /**
   * Check if a column at index is currently visible in the viewport.
   * @param colIndex
   */
  isColumnVisibleInWindow: (colIndex: number) => boolean;
  /**
   * Get the current containerProps.
   */
  getContainerPropsState: () => ContainerProps | null;
  /**
   * Get the current renderContext.
   */
  getRenderContextState: () => Partial<RenderContextProps> | undefined;
}
