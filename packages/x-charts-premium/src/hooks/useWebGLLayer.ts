'use client';
import { useChartsContext } from '@mui/x-charts/internals';
import {
  selectorWebGLIsContextReadyOptional,
  type UseChartPremiumWebGLSignature,
} from '../internals/plugins/useChartPremiumWebGL';

/**
 * Returns the WebGL layer context from the premium plugin, or null if the GL context is not ready.
 */
export function useWebGLLayer() {
  const { store, instance } = useChartsContext<[], [UseChartPremiumWebGLSignature]>();
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
