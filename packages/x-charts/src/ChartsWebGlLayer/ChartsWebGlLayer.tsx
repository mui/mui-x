'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useChartRootRef, useDrawingArea } from '../hooks';
import {
  selectorChartSvgHeight,
  selectorChartSvgWidth,
} from '../internals/plugins/corePlugins/useChartDimensions';
import { useStore } from '../internals/store/useStore';

const ChartsWebGLContext = React.createContext<WebGL2RenderingContext | null>(null);

export function useWebGLContext(): WebGL2RenderingContext | null {
  return React.useContext(ChartsWebGLContext);
}

export const ChartsWebGlLayer = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function WebGLProvider({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<WebGL2RenderingContext | null>(null);
  const handleRef = useForkRef(canvasRef, ref);
  const chartRoot = useChartRootRef().current;
  const drawingArea = useDrawingArea();
  const [, rerender] = React.useReducer((s) => s + 1, 0);

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
      setContext(null);
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

      setContext(ctx);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);

    canvas.addEventListener('webglcontextrestored', initializeContext);

    initializeContext();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', initializeContext);
    };
  }, [chartRoot]);

  if (!chartRoot) {
    return null;
  }

  return (
    <ChartsWebGLContext.Provider value={context}>
      <CanvasPositioner>
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
    </ChartsWebGLContext.Provider>
  );
});

function CanvasPositioner({ children }: React.PropsWithChildren) {
  const store = useStore();
  const svgWidth = store.use(selectorChartSvgWidth);
  const svgHeight = store.use(selectorChartSvgHeight);

  return (
    <div
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
    >
      {children}
    </div>
  );
}
