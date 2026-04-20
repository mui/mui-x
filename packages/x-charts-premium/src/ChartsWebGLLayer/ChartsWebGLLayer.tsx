'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { selectorChartSvgHeight, selectorChartSvgWidth, useStore } from '@mui/x-charts/internals';
import { useDrawingArea, useChartRootRef } from '@mui/x-charts/hooks';
import { useWebGLResizeObserver } from '../utils/webgl/useWebGLResizeObserver';

type DrawEntry = {
  drawRef: React.RefObject<(() => void) | null>;
  order: number;
};

export interface ChartsWebGLContextValue {
  gl: WebGL2RenderingContext;
  /**
   * Register a draw callback ref. Returns an unregister function.
   * Callbacks are sorted by the provided `order` number so z-order follows the children's position
   * in `ChartsWebGLLayer`, stable across unmount/remount (e.g. toggled via series visibility).
   * @param {React.RefObject} drawRef A ref object whose current property is a draw callback function. The callback will be called with the WebGL context already set to this layer's canvas. Set to null to temporarily disable drawing without unregistering.
   * @param {number} order Z-order index. Lower values draw first (behind higher values).
   * @returns {Function} Unregister function to remove the draw callback from the layer.
   */
  registerDraw: (drawRef: React.RefObject<(() => void) | null>, order: number) => () => void;
  /**
   * Request a render frame. The layer will clear once, then call all registered draw callbacks in order.
   */
  requestRender: () => void;
}

const ChartsWebGLContext = React.createContext<ChartsWebGLContextValue | null>(null);

/**
 * Provides the z-order index for a plot based on its position in `ChartsWebGLLayer`'s children.
 * `useWebGLLayer` reads this and auto-binds it to `registerDraw` so consumers don't pass it manually.
 */
const WebGLOrderContext = React.createContext<number>(0);

export function useWebGLContext(): WebGL2RenderingContext | null {
  return React.useContext(ChartsWebGLContext)?.gl ?? null;
}

export function useWebGLLayer(): {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
} | null {
  const layer = React.useContext(ChartsWebGLContext);
  const order = React.useContext(WebGLOrderContext);

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

export const ChartsWebGLLayer = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function WebGLProvider({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [glContext, setGlContext] = React.useState<WebGL2RenderingContext | null>(null);
  const handleRef = useForkRef(canvasRef, ref);
  const chartRoot = useChartRootRef().current;
  const drawingArea = useDrawingArea();
  const [, rerender] = React.useReducer((s) => s + 1, 0);

  const drawEntriesRef = React.useRef<Array<DrawEntry>>([]);
  const renderScheduledRef = React.useRef(false);

  const renderAll = React.useCallback(() => {
    if (!glContext) {
      return;
    }
    renderScheduledRef.current = false;
    glContext.clearColor(0, 0, 0, 0.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT);
    // Sort by order so z-order matches children's position in ChartsWebGLLayer,
    // stable across remount.
    const sorted = [...drawEntriesRef.current].sort((a, b) => a.order - b.order);
    for (const { drawRef } of sorted) {
      drawRef.current?.();
    }
  }, [glContext]);

  const registerDraw = React.useCallback(
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

  const requestRender = React.useCallback(() => {
    renderScheduledRef.current = true;
    // Trigger a re-render so the flush effect runs, even if only a child's state changed
    rerender();
  }, []);

  // Centralized resize handling — render all plots on canvas resize
  useWebGLResizeObserver(glContext, renderAll);

  // Flush scheduled renders after all children's effects have run
  React.useEffect(() => {
    if (renderScheduledRef.current) {
      renderAll();
    }
  });

  React.useEffect(() => {
    /* The chart root isn't available on first render because the ref is only set after mounting the root component. */
    if (!chartRoot) {
      rerender();
    }
  }, [chartRoot]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const handleContextLost = (event: Event) => {
      // Must prevent default otherwise the context won't be marked as restorable
      // https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/
      event.preventDefault();
      setGlContext(null);
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

      setGlContext(ctx);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);

    canvas.addEventListener('webglcontextrestored', initializeContext);

    initializeContext();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', initializeContext);
    };
  }, [chartRoot]);

  const contextValue = React.useMemo<ChartsWebGLContextValue | null>(
    () => (glContext ? { gl: glContext, registerDraw, requestRender } : null),
    [glContext, registerDraw, requestRender],
  );

  if (!chartRoot) {
    return null;
  }

  return (
    <ChartsWebGLContext.Provider value={contextValue}>
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
        return <WebGLOrderContext.Provider value={index}>{child}</WebGLOrderContext.Provider>;
      })}
    </ChartsWebGLContext.Provider>
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
