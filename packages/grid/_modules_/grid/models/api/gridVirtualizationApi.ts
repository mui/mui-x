import { GridContainerProps } from '../gridContainerProps';
import { GridRenderContextProps } from '../gridRenderContextProps';

/**
 * The virtualization API interface that is available in the grid [[apiRef]].
 */
export interface GridVirtualizationApi {
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
   * Refreshes the viewport cells according to the scroll positions
   * @param {boolean} forceRender If `true`, forces a rerender. By default, it is `false`.
   * @ignore - do not document.
   */
  updateViewport: (forceRender?: boolean) => void;
}
