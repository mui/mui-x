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

interface ChartZoomBrushHandleProps
  extends Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry'> {
  onResize: (delta: number) => void;
  orientation: 'horizontal' | 'vertical';
}

export const ChartZoomBrushHandle = React.forwardRef<SVGRectElement, ChartZoomBrushHandleProps>(
  function ChartPreviewHandle(
    { x, y, width, height, onResize, orientation, rx = 2, ry = 2 },
    forwardedRef,
  ) {
    const handleRef = React.useRef<SVGRectElement>(null);
    const ref = useForkRef(handleRef, forwardedRef);

    const onResizeEvent = useEventCallback(onResize);

    React.useEffect(() => {
      const handle = handleRef.current;

      if (!handle) {
        return;
      }

      let prev = 0;

      const onPointerMove = (event: PointerEvent) => {
        const current = orientation === 'horizontal' ? event.clientX : event.clientY;
        const delta = current - prev;
        prev = current;

        onResizeEvent(delta);
      };

      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        prev = 0;
      };

      const onPointerDown = (event: PointerEvent) => {
        // Prevent text selection when dragging the handle
        event.preventDefault();
        event.stopPropagation();
        prev = orientation === 'horizontal' ? event.clientX : event.clientY;
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointermove', onPointerMove);
      };

      handle.addEventListener('pointerdown', onPointerDown);

      // eslint-disable-next-line consistent-return
      return () => {
        handle.removeEventListener('pointerdown', onPointerDown);
      };
    }, [onResizeEvent, orientation]);

    return <Rect ref={ref} x={x} y={y} width={width} height={height} rx={rx} ry={ry} />;
  },
);
