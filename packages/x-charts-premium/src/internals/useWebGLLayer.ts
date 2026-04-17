'use client';
import * as React from 'react';
import { useChartsContext } from '@mui/x-charts/internals';
import {
  selectorWebGLIsContextReadyOptional,
  type UseChartWebGLSignature,
} from './plugins/useChartWebGL';

/**
 * Returns the WebGL layer context from the premium plugin, or null if the GL context is not ready.
 * Exposes the plugin instance methods with their original names so consumers can grep for them.
 */
export function useWebGLLayer() {
  const { store, instance } = useChartsContext<[], [UseChartWebGLSignature]>();
  const isContextReady = store.use(selectorWebGLIsContextReadyOptional);

  return React.useMemo(() => {
    if (!isContextReady || !instance.webGLContextRef) {
      return null;
    }
    return {
      gl: instance.webGLContextRef.current!,
      webGLRegisterDraw: instance.webGLRegisterDraw!,
      webGLRequestRender: instance.webGLRequestRender!,
    };
  }, [isContextReady, instance]);
}
