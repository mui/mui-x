'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import {
  selectorChartSvgHeight,
  selectorChartSvgWidth,
  useStore,
  useChartsContext,
} from '@mui/x-charts/internals';
import { useDrawingArea, useChartRootRef } from '@mui/x-charts/hooks';
import { useWebGLResizeObserver } from '../utils/webgl/useWebGLResizeObserver';
import {
  selectorWebGLRenderTickOptional,
  type UseChartPremiumWebGLSignature,
} from '../internals/plugins/useChartPremiumWebGL';

export const ChartsWebGLLayer = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function ChartsWebGLLayer({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const handleRef = useForkRef(canvasRef, ref);
  const chartRoot = useChartRootRef().current;
  const drawingArea = useDrawingArea();
  const [, rerender] = React.useReducer((s) => s + 1, 0);
  const { store, instance } = useChartsContext<[], [UseChartPremiumWebGLSignature]>();

  const renderTick = store.use(selectorWebGLRenderTickOptional);

  const glContext = instance.webGLContextRef?.current ?? null;
  const flushRender = instance.flushWebGLRender;

  // Centralized resize handling — render all plots on canvas resize
  useWebGLResizeObserver(glContext, flushRender ?? (() => {}));

  // Flush scheduled renders when renderTick changes
  React.useEffect(() => {
    flushRender?.();
  }, [renderTick, flushRender]);

  React.useEffect(() => {
    /* The chart root isn't available on first render because the ref is only set after mounting the root component. */
    if (!chartRoot) {
      rerender();
    }
  }, [chartRoot]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !instance.setWebGLContext) {
      return undefined;
    }

    const handleContextLost = (event: Event) => {
      // Must prevent default otherwise the context won't be marked as restorable
      // https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/
      event.preventDefault();
      instance.setWebGLContext!(null);
    };
    const initializeContext = () => {
      const ctx = canvas.getContext('webgl2', {
        /* Fixes blurry lines when drawing sharp edges */
        antialias: false,
        /* Required so we can export the WebGL plot */
        preserveDrawingBuffer: true,
      });

      if (!ctx) {
        return;
      }

      instance.setWebGLContext!(ctx);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);

    canvas.addEventListener('webglcontextrestored', initializeContext);

    initializeContext();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', initializeContext);
      instance.setWebGLContext!(null);
    };
  }, [chartRoot, instance]);

  if (!chartRoot) {
    return null;
  }

  return (
    <React.Fragment>
      <CanvasPositioner aria-hidden="true">
        <canvas
          ref={handleRef}
          {...props}
          style={{
            position: 'relative',
            left: drawingArea.left,
            top: drawingArea.top,
            width: drawingArea.width,
            height: drawingArea.height,
          }}
        />
      </CanvasPositioner>
      {children}
    </React.Fragment>
  );
});

function CanvasPositioner({
  children,
  ...other
}: React.PropsWithChildren<React.ComponentProps<'div'>>) {
  const store = useStore();
  const svgWidth = store.use(selectorChartSvgWidth);
  const svgHeight = store.use(selectorChartSvgHeight);

  return (
    <div
      {...other}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        /* Ensures the canvas occupies the same space as the SVG */
        maxWidth: svgWidth,
        maxHeight: svgHeight,
        width: '100%',
        height: '100%',
        margin: 'auto',
      }}
      aria-hidden
    >
      {children}
    </div>
  );
}
