'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import {
  chartAxisZoomOverviewHandleClasses,
  useUtilityClasses,
} from './chartAxisZoomOverviewHandleClasses';

const Rect = styled('rect')(({ theme }) => ({
  [`&.${chartAxisZoomOverviewHandleClasses.root}`]: {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[700]
        : (theme.vars || theme).palette.grey[500],
  },
  [`&.${chartAxisZoomOverviewHandleClasses.horizontal}`]: {
    cursor: 'ew-resize',
  },
  [`&.${chartAxisZoomOverviewHandleClasses.vertical}`]: {
    cursor: 'ns-resize',
  },
}));

export interface ChartZoomOverviewHandleOwnerState {
  onResize: (delta: number) => void;
  orientation: 'horizontal' | 'vertical';
}

export interface ChartZoomOverviewHandleProps
  extends Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry'>,
    ChartZoomOverviewHandleOwnerState {}

/**
 * Renders the zoom voerview handle, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartAxisZoomOverviewHandle = React.forwardRef<
  SVGRectElement,
  ChartZoomOverviewHandleProps
>(function ChartPreviewHandle(
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

    const rafThrottledPointerMove = rafThrottle((current: number, previous: number) => {
      const delta = current - previous;
      prev = current;

      onResizeEvent(delta);
    });
    const onPointerMove = (event: PointerEvent) => {
      const current = orientation === 'horizontal' ? event.clientX : event.clientY;
      rafThrottledPointerMove(current, prev);
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
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
      rafThrottledPointerMove.clear();
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
});
