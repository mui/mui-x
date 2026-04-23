'use client';
import * as React from 'react';
import { ChartsWebGLOrderContext } from './ChartsWebGLOrderContext';
import type { ChartsWebGLContextValue, UseWebGLLayerValue } from './ChartsWebGLLayer.types';

export const ChartsWebGLContext = React.createContext<ChartsWebGLContextValue | null>(null);

export function useWebGLContext(): WebGL2RenderingContext | null {
  return React.useContext(ChartsWebGLContext)?.gl ?? null;
}

export function useWebGLLayer(): UseWebGLLayerValue | null {
  const layer = React.useContext(ChartsWebGLContext);
  const order = React.useContext(ChartsWebGLOrderContext);

  return React.useMemo(() => {
    if (!layer) {
      return null;
    }
    return {
      gl: layer.gl,
      registerDraw: (drawRef: React.RefObject<(() => void) | null>) =>
        layer.registerDraw(drawRef, order),
      requestRender: layer.requestRender,
    };
  }, [layer, order]);
}
