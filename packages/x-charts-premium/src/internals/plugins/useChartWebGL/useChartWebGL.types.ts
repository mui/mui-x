import type * as React from 'react';
import { type ChartPluginSignature } from '@mui/x-charts/internals';

export interface UseChartWebGLInstance {
  /**
   * Ref holding the current WebGL2 rendering context. Null until a ChartsWebGLLayer mounts.
   */
  webGLContextRef: React.RefObject<WebGL2RenderingContext | null>;
  /**
   * Called by ChartsWebGLLayer to set or clear the WebGL context.
   * @param {WebGL2RenderingContext | null} gl The WebGL context from the layer, or null if the context was lost.
   */
  webGLSetContext: (gl: WebGL2RenderingContext | null) => void;
  /**
   * Register a draw callback ref. Returns an unregister function.
   * Callbacks are called in registration order, which matches DOM order on initial mount.
   * A component that unmounts and remounts (e.g. toggled via series visibility) will re-register
   * at the end of the list, potentially changing the z-order relative to its DOM siblings.
   * @param {React.RefObject} drawRef A ref object whose current property is a callback function to call on each render, or null if the callback should be unregistered.
   * @returns {() => void} Unregister function to remove the callback from the render cycle.
   */
  webGLRegisterDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  /**
   * Request a render frame. The layer will clear once, then call all registered draw callbacks in order.
   */
  webGLRequestRender: () => void;
  /**
   * Clear the canvas and call all registered draw callbacks.
   * Called internally by ChartsWebGLLayer's flush effect and resize observer.
   */
  webGLFlushRender: () => void;
}

export interface UseChartWebGLState {
  webGL: {
    /**
     * Incremented each time a render is requested, causing subscribers to re-render
     * so the flush effect in ChartsWebGLLayer can run.
     */
    renderTick: number;
    /**
     * Whether a WebGL context is currently available.
     * Components subscribe to this to know when GL is ready.
     */
    isContextReady: boolean;
  };
}

export type UseChartWebGLSignature = ChartPluginSignature<{
  instance: UseChartWebGLInstance;
  state: UseChartWebGLState;
}>;
