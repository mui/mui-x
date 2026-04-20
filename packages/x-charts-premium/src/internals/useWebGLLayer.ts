'use client';
import * as React from 'react';
import { useChartsContext } from '@mui/x-charts/internals';
import {
  selectorWebGLIsContextReadyOptional,
  type UseChartWebGLSignature,
} from './plugins/useChartWebGL';
import { WebGLOrderContext } from './WebGLOrderContext';

/**
 * Returns the WebGL layer context from the premium plugin, or null if the GL context is not ready.
 * The returned `webGLRegisterDraw` auto-binds the z-order from the nearest `WebGLOrderContext`,
 * which `ChartsWebGLLayer` sets based on each child's position.
 */
export function useWebGLLayer() {
  const { store, instance } = useChartsContext<[], [UseChartWebGLSignature]>();
  const isContextReady = store.use(selectorWebGLIsContextReadyOptional);
  const order = React.useContext(WebGLOrderContext);

  return React.useMemo(() => {
    if (!isContextReady || !instance.webGLContextRef) {
      return null;
    }
    return {
      gl: instance.webGLContextRef.current!,
      webGLRegisterDraw: (drawRef: React.RefObject<(() => void) | null>) =>
        instance.webGLRegisterDraw!(drawRef, order),
      webGLRequestRender: instance.webGLRequestRender!,
    };
  }, [isContextReady, instance, order]);
}
