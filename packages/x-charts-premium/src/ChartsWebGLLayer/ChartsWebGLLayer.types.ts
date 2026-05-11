import type * as React from 'react';

export type DrawEntry = {
  drawRef: React.RefObject<(() => void) | null>;
  order: number;
};

export interface ChartsWebGLContextValue {
  gl: WebGL2RenderingContext;
  /**
   * Register a draw callback ref. Returns an unregister function.
   * Callbacks are sorted by the provided `order` number so z-order follows the children's position
   * in `ChartsWebGLLayer`, stable across unmount/remount (e.g. toggled via series visibility).
   * @param {React.RefObject} drawRef A ref object whose current property is a draw callback function. The callback will be called with the WebGL context already set to this layer's canvas. Set to null to temporarily disable drawing without unregistering.
   * @param {number} order Z-order index. Lower values draw first (behind higher values).
   * @returns {Function} Unregister function to remove the draw callback from the layer.
   */
  registerDraw: (drawRef: React.RefObject<(() => void) | null>, order: number) => () => void;
  /**
   * Request a render frame. The layer will clear once, then call all registered draw callbacks in order.
   */
  requestRender: () => void;
}

export interface UseWebGLLayerValue {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
}
