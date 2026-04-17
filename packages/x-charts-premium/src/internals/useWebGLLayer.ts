'use client';
import { useChartsContext } from '@mui/x-charts/internals';
import {
  selectorWebGLIsContextReadyOptional,
  type UseChartWebGLSignature,
} from './plugins/useChartWebGL';

/**
 * Returns the WebGL layer context from the premium plugin, or null if the GL context is not ready.
 */
export function useWebGLLayer() {
  const { store, instance } = useChartsContext<[], [UseChartWebGLSignature]>();
  const isContextReady = store.use(selectorWebGLIsContextReadyOptional);

  if (!isContextReady || !instance.webGLContextRef) {
    return null;
  }

  return {
    gl: instance.webGLContextRef.current!,
    registerDraw: instance.registerWebGLDraw!,
    requestRender: instance.requestWebGLRender!,
  };
}
