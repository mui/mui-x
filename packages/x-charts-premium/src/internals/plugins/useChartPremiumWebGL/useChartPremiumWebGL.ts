'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartPremiumWebGLSignature } from './useChartPremiumWebGL.types';

export const useChartPremiumWebGL: ChartPlugin<UseChartPremiumWebGLSignature> = ({ store }) => {
  const webGLContextRef = React.useRef<WebGL2RenderingContext | null>(null);
  const drawRefsRef = React.useRef<Array<React.RefObject<(() => void) | null>>>([]);

  const setWebGLContext = React.useCallback(
    (gl: WebGL2RenderingContext | null) => {
      webGLContextRef.current = gl;
      store.set('webGL', { ...store.state.webGL, isContextReady: gl !== null });
    },
    [store],
  );

  const registerWebGLDraw = React.useCallback((drawRef: React.RefObject<(() => void) | null>) => {
    drawRefsRef.current.push(drawRef);
    return () => {
      const idx = drawRefsRef.current.indexOf(drawRef);
      if (idx >= 0) {
        drawRefsRef.current.splice(idx, 1);
      }
    };
  }, []);

  const requestWebGLRender = React.useCallback(() => {
    store.set('webGL', { ...store.state.webGL, renderTick: store.state.webGL.renderTick + 1 });
  }, [store]);

  const flushWebGLRender = React.useCallback(() => {
    const gl = webGLContextRef.current;
    if (!gl) {
      return;
    }
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const drawRef of drawRefsRef.current) {
      drawRef.current?.();
    }
  }, []);

  return {
    instance: {
      webGLContextRef,
      setWebGLContext,
      registerWebGLDraw,
      requestWebGLRender,
      flushWebGLRender,
    },
  };
};

useChartPremiumWebGL.params = {};

useChartPremiumWebGL.getInitialState = () => ({
  webGL: {
    renderTick: 0,
    isContextReady: false,
  },
});
