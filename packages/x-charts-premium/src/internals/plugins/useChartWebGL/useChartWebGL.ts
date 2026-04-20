'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartWebGLSignature } from './useChartWebGL.types';

type DrawEntry = {
  drawRef: React.RefObject<(() => void) | null>;
  order: number;
};

export const useChartWebGL: ChartPlugin<UseChartWebGLSignature> = ({ store }) => {
  const webGLContextRef = React.useRef<WebGL2RenderingContext | null>(null);
  const drawEntriesRef = React.useRef<Array<DrawEntry>>([]);

  const webGLSetContext = React.useCallback(
    (gl: WebGL2RenderingContext | null) => {
      webGLContextRef.current = gl;
      store.set('webGL', { ...store.state.webGL, isContextReady: gl !== null });
    },
    [store],
  );

  const webGLRegisterDraw = React.useCallback(
    (drawRef: React.RefObject<(() => void) | null>, order: number) => {
      const entry: DrawEntry = { drawRef, order };
      drawEntriesRef.current.push(entry);
      return () => {
        const idx = drawEntriesRef.current.indexOf(entry);
        if (idx >= 0) {
          drawEntriesRef.current.splice(idx, 1);
        }
      };
    },
    [],
  );

  const webGLRequestRender = React.useCallback(() => {
    store.set('webGL', { ...store.state.webGL, renderTick: store.state.webGL.renderTick + 1 });
  }, [store]);

  const webGLFlushRender = React.useCallback(() => {
    const gl = webGLContextRef.current;
    if (!gl) {
      return;
    }
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Sort by order so z-order matches the children's position in ChartsWebGLLayer,
    // stable across remount.
    const sorted = [...drawEntriesRef.current].sort((a, b) => a.order - b.order);
    for (const { drawRef } of sorted) {
      drawRef.current?.();
    }
  }, []);

  return {
    instance: {
      webGLContextRef,
      webGLSetContext,
      webGLRegisterDraw,
      webGLRequestRender,
      webGLFlushRender,
    },
  };
};

useChartWebGL.params = {};

useChartWebGL.getInitialState = () => ({
  webGL: {
    renderTick: 0,
    isContextReady: false,
  },
});
