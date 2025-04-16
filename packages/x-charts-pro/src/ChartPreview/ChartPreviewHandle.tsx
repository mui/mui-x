'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';

const Rect = styled('rect')(({ theme }) => ({
  '&': {
    fill: (theme.vars || theme).palette.grey[500],
    cursor: 'ew-resize',
  },
}));

interface ChartPreviewHandleProps
  extends Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry'> {
  onResize: (delta: number) => void;
}

export const ChartPreviewHandle = React.forwardRef<SVGRectElement, ChartPreviewHandleProps>(
  function ChartPreviewHandle({ x, y, width, height, onResize, rx = 2, ry = 2 }, forwardedRef) {
    const handleRef = React.useRef<SVGRectElement>(null);
    const ref = useForkRef(handleRef, forwardedRef);

    const onResizeEvent = useEventCallback(onResize);

    React.useEffect(() => {
      const handle = handleRef.current;

      if (!handle) {
        return;
      }

      let prevX = 0;

      const onPointerMove = (event: PointerEvent) => {
        const deltaX = event.clientX - prevX;
        prevX = event.clientX;

        onResizeEvent(deltaX);
      };

      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        prevX = 0;
      };

      const onPointerDown = (event: PointerEvent) => {
        // Prevent text selection when dragging the handle
        event.preventDefault();
        event.stopPropagation();
        prevX = event.clientX;
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointermove', onPointerMove);
      };

      handle.addEventListener('pointerdown', onPointerDown);

      // eslint-disable-next-line consistent-return
      return () => {
        handle.removeEventListener('pointerdown', onPointerDown);
      };
    }, [onResizeEvent]);

    return <Rect ref={ref} x={x} y={y} width={width} height={height} rx={rx} ry={ry} />;
  },
);
