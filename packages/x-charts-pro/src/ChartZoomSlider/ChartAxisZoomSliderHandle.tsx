'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import {
  chartAxisZoomSliderHandleClasses,
  useUtilityClasses,
} from './chartAxisZoomSliderHandleClasses';

const Rect = styled('rect')(({ theme }) => ({
  [`&.${chartAxisZoomSliderHandleClasses.root}`]: {
    fill:
      theme.palette.mode === 'dark'
        ? (theme.vars || theme).palette.grey[700]
        : (theme.vars || theme).palette.grey[500],
  },
  [`&.${chartAxisZoomSliderHandleClasses.horizontal}`]: {
    cursor: 'ew-resize',
  },
  [`&.${chartAxisZoomSliderHandleClasses.vertical}`]: {
    cursor: 'ns-resize',
  },
}));

export interface ChartZoomSliderHandleOwnerState {
  onResize: (event: PointerEvent) => void;
  orientation: 'horizontal' | 'vertical';
  placement: 'start' | 'end';
}

export interface ChartZoomSliderHandleProps
  extends Pick<React.ComponentProps<'rect'>, 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry'>,
    ChartZoomSliderHandleOwnerState {}

/**
 * Renders the zoom slider handle, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartAxisZoomSliderHandle = React.forwardRef<
  SVGRectElement,
  ChartZoomSliderHandleProps
>(function ChartPreviewHandle(
  { x, y, width, height, onResize, orientation, placement, rx = 2, ry = 2 },
  forwardedRef,
) {
  const classes = useUtilityClasses({ onResize, orientation, placement });

  const handleRef = React.useRef<SVGRectElement>(null);
  const ref = useForkRef(handleRef, forwardedRef);

  const onResizeEvent = useEventCallback(onResize);

  React.useEffect(() => {
    const handle = handleRef.current;

    if (!handle) {
      return;
    }

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      onResizeEvent(event);
    });

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging the handle
      event.preventDefault();
      event.stopPropagation();
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
});
