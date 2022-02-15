import { GridRenderContext } from '../params/gridScrollParams';

export interface GridVirtualScrollerApi {
  /**
   * Get the current grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   * @ignore - do not document.
   */
  unstable_getRenderContext: () => GridRenderContext;
}
