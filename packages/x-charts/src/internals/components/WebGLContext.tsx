'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useForkRef from '@mui/utils/useForkRef';
import { useChartRootRef, useDrawingArea } from '../../hooks';
import {
  selectorChartSvgHeight,
  selectorChartSvgWidth,
} from '../plugins/corePlugins/useChartDimensions';
import { useStore } from '../store/useStore';

const WebGLContext = React.createContext<WebGL2RenderingContext | null>(null);

export function useWebGLContext(): WebGL2RenderingContext | null {
  return React.useContext(WebGLContext);
}

export const WebGLProvider = React.forwardRef<
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
      return;
    }

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
  }, [chartRoot]);

  if (!chartRoot) {
    return null;
  }

  return (
    <WebGLContext.Provider value={context}>
      {ReactDOM.createPortal(
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
        </CanvasPositioner>,
        chartRoot,
      )}
      {children}
    </WebGLContext.Provider>
  );
});

function CanvasPositioner({ children }: React.PropsWithChildren) {
  const store = useStore();
  const svgWidth = store.use(selectorChartSvgWidth);
  const svgHeight = store.use(selectorChartSvgHeight);

  return (
    <div
      style={{
        position: 'relative',
        pointerEvents: 'none',
        /* Ensures the canvas occupies the same space as the SVG */
        gridArea: 'chart',
        /* This property ensures the canvas renders below the SVG */
        order: -1,
        maxWidth: svgWidth,
        maxHeight: svgHeight,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}
