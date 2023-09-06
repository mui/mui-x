import { GridRenderContext } from '../params/gridScrollParams';

export interface GridVirtualScrollerApi {
  /**
   * Get the current grid rendering context.
   * @returns {GridRenderContext} The `GridRenderContext`.
   */
  getRenderContext: () => GridRenderContext;
  /**
   * Set the current grid rendering context.
   */
  setRenderContext: (renderContext: GridRenderContext) => Promise<unknown>;
}
