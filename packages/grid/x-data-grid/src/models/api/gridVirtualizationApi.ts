import { GridRenderContext } from '../params';

export interface GridVirtualizationApi {
  /**
   * Get the current grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   */
  getRenderContext: () => GridRenderContext;
  /**
   * Enable/disable column virtualization.
   */
  unstable_setVirtualization: (enabled: boolean) => void;
  /**
   * Enable/disable column virtualization.
   */
  unstable_setColumnVirtualization: (enabled: boolean) => void;
}
