'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';

const WebGLContext = React.createContext<WebGL2RenderingContext | null>(null);

export function useWebGLContext(): WebGL2RenderingContext | null {
  return React.useContext(WebGLContext);
}

export const WebGLProvider = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function CanvasProvider({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<WebGL2RenderingContext | null>(null);
  const handleRef = useForkRef(canvasRef, ref);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('webgl2');

      if (!ctx) {
        return;
      }

      setContext(ctx);
    }
  }, []);

  return (
    <WebGLContext.Provider value={context}>
      <canvas ref={handleRef} {...props} style={{ width: '100%', height: '100%' }} />
      {children}
    </WebGLContext.Provider>
  );
});
