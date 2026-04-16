import type * as React from 'react';
import { type ChartPluginSignature } from '@mui/x-charts/internals';

export interface UseChartPremiumWebGLInstance {
  /**
   * Ref holding the current WebGL2 rendering context. Null until a ChartsWebGLLayer mounts.
   */
  webGLContextRef: React.RefObject<WebGL2RenderingContext | null>;
  /**
   * Called by ChartsWebGLLayer to set or clear the WebGL context.
   */
  setWebGLContext: (gl: WebGL2RenderingContext | null) => void;
  /**
   * Register a draw callback ref. Returns an unregister function.
   * Callbacks are called in registration order (DOM order).
   */
  registerWebGLDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  /**
   * Request a render frame. The layer will clear once, then call all registered draw callbacks in order.
   */
  requestWebGLRender: () => void;
  /**
   * Clear the canvas and call all registered draw callbacks.
   * Called internally by ChartsWebGLLayer's flush effect and resize observer.
   */
  flushWebGLRender: () => void;
}

export interface UseChartPremiumWebGLState {
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

export type UseChartPremiumWebGLSignature = ChartPluginSignature<{
  instance: UseChartPremiumWebGLInstance;
  state: UseChartPremiumWebGLState;
}>;
