'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import {
  type UseChartWebGLSignature,
  type WebGLDrawEntry,
} from './useChartWebGL.types';

export const useChartWebGL: ChartPlugin<UseChartWebGLSignature> = ({ store }) => {
  const webGLContextRef = React.useRef<WebGL2RenderingContext | null>(null);
  const webGLDrawEntriesRef = React.useRef<Array<WebGLDrawEntry>>([]);

  const webGLSetContext = React.useCallback(
    (gl: WebGL2RenderingContext | null) => {
      webGLContextRef.current = gl;
      store.set('webGL', { ...store.state.webGL, isContextReady: gl !== null });
    },
    [store],
  );

  const webGLRegisterDraw = React.useCallback(
    (drawRef: React.RefObject<(() => void) | null>, order: number) => {
      const entry: WebGLDrawEntry = { drawRef, order };
      webGLDrawEntriesRef.current.push(entry);
      return () => {
        const idx = webGLDrawEntriesRef.current.indexOf(entry);
        if (idx >= 0) {
          webGLDrawEntriesRef.current.splice(idx, 1);
        }
      };
    },
    [],
  );

  const webGLRequestRender = React.useCallback(() => {
    store.set('webGL', { ...store.state.webGL, renderTick: store.state.webGL.renderTick + 1 });
  }, [store]);

  return {
    instance: {
      webGLContextRef,
      webGLDrawEntriesRef,
      webGLSetContext,
      webGLRegisterDraw,
      webGLRequestRender,
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
