'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';

const CanvasContext = React.createContext<CanvasRenderingContext2D | null>(null);

export function useCanvasContext(): CanvasRenderingContext2D | null {
  return React.useContext(CanvasContext);
}

export const CanvasProvider = React.forwardRef<
  HTMLCanvasElement,
  React.PropsWithChildren<React.ComponentProps<'canvas'>>
>(function CanvasProvider({ children, ...props }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
  const handleRef = useForkRef(canvasRef, ref);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);
    }
  }, []);

  React.useLayoutEffect(() => {
    console.log('layout parent');
    if (!context) {
      return;
    }

    // eslint-disable-next-line react-compiler/react-compiler
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    console.log('clear');
  });

  console.log('render canvas');

  return (
    <CanvasContext.Provider value={context}>
      <canvas ref={handleRef} {...props} />
      {children}
    </CanvasContext.Provider>
  );
});
