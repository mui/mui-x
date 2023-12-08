import { GridRenderContext } from '../params';

export interface GridVirtualizationApi {
  /**
   * Enable/disable virtualization.
   * @param {boolean} enabled The enabled value for virtualization
   */
  unstable_setVirtualization: (enabled: boolean) => void;
  /**
   * Enable/disable column virtualization.
   * @param {boolean} enabled The enabled value for column virtualization
   */
  unstable_setColumnVirtualization: (enabled: boolean) => void;
}

export interface GridVirtualizationPrivateApi {
  /**
   * Get the current grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   */
  getRenderContext: () => GridRenderContext;
  /**
   * Update grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   */
  updateRenderContext?: () => void;
}
