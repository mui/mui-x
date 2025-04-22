'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { chartZoomBrushHandleClasses, useUtilityClasses } from './chartZoomBrushHandleClasses';

const Rect = styled('rect')(({ theme }) => ({
  [`&.${chartZoomBrushHandleClasses.root}`]: {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[700]
        : (theme.vars || theme).palette.grey[500],
  },
  [`&.${chartZoomBrushHandleClasses.horizontal}`]: {
    cursor: 'ew-resize',
  },
  [`&.${chartZoomBrushHandleClasses.vertical}`]: {
    cursor: 'ns-resize',
  },
}));

export interface ChartZoomBrushHandleOwnerState {
  onResize: (delta: number) => void;
  orientation: 'horizontal' | 'vertical';
}

export interface ChartZoomBrushHandleProps
  extends Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry'>,
    ChartZoomBrushHandleOwnerState {}

/**
 * Renders the zoom brush handle, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartZoomBrushHandle = React.forwardRef<SVGRectElement, ChartZoomBrushHandleProps>(
  function ChartPreviewHandle(
    { x, y, width, height, onResize, orientation, rx = 2, ry = 2 },
    forwardedRef,
  ) {
    const classes = useUtilityClasses({ onResize, orientation });

    const handleRef = React.useRef<SVGRectElement>(null);
    const ref = useForkRef(handleRef, forwardedRef);

    const onResizeEvent = useEventCallback(onResize);

    React.useEffect(() => {
      const handle = handleRef.current;

      if (!handle) {
        return;
      }

      let prev = 0;

      const onPointerMove = rafThrottle((event: PointerEvent) => {
        const current = orientation === 'horizontal' ? event.clientX : event.clientY;
        const delta = current - prev;
        prev = current;

        onResizeEvent(delta);
      });

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
        onPointerMove.clear();
      };
    }, [onResizeEvent, orientation]);

    return (
      <Rect
        className={classes.root}
        ref={ref}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={ry}
      />
    );
  },
);
