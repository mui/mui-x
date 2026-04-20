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
  type UseChartWebGLSignature,
} from '../internals/plugins/useChartWebGL';
import { WebGLOrderContext } from '../internals/WebGLOrderContext';

export const ChartsWebGLLayer = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function ChartsWebGLLayer({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const handleRef = useForkRef(canvasRef, ref);
  const chartRoot = useChartRootRef().current;
  const drawingArea = useDrawingArea();
  const [, rerender] = React.useReducer((s) => s + 1, 0);
  const { store, instance } = useChartsContext<[], [UseChartWebGLSignature]>();

  const renderTick = store.use(selectorWebGLRenderTickOptional);

  const glContext = instance.webGLContextRef?.current ?? null;
  const drawEntriesRef = instance.webGLDrawEntriesRef;

  const flushRender = React.useCallback(() => {
    const gl = glContext;
    const entries = drawEntriesRef?.current;
    if (!gl || !entries) {
      return;
    }
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Sort by order so z-order matches children's position in ChartsWebGLLayer,
    // stable across remount.
    const sorted = [...entries].sort((a, b) => a.order - b.order);
    for (const { drawRef } of sorted) {
      drawRef.current?.();
    }
  }, [glContext, drawEntriesRef]);

  // Centralized resize handling — render all plots on canvas resize
  useWebGLResizeObserver(glContext, flushRender);

  // Flush scheduled renders when renderTick changes
  React.useEffect(() => {
    flushRender();
  }, [renderTick, flushRender]);

  React.useEffect(() => {
    /* The chart root isn't available on first render because the ref is only set after mounting the root component. */
    if (!chartRoot) {
      rerender();
    }
  }, [chartRoot]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !instance.webGLSetContext) {
      return undefined;
    }

    const handleContextLost = (event: Event) => {
      // Must prevent default otherwise the context won't be marked as restorable
      // https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/
      event.preventDefault();
      instance.webGLSetContext!(null);
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

      instance.webGLSetContext!(ctx);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);

    canvas.addEventListener('webglcontextrestored', initializeContext);

    initializeContext();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', initializeContext);
      instance.webGLSetContext!(null);
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
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        return (
          <WebGLOrderContext.Provider value={index}>{child}</WebGLOrderContext.Provider>
        );
      })}
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
