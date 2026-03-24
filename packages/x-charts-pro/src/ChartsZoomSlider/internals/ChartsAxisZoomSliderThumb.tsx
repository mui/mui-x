'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import clsx from 'clsx';
import {
  chartsAxisZoomSliderThumbClasses,
  useUtilityClasses,
} from './chartsAxisZoomSliderThumbClasses';
import { ZOOM_SLIDER_THUMB_TOUCH_TARGET } from './constants';

const Rect = styled('rect', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  [`&.${chartsAxisZoomSliderThumbClasses.root}`]: {
    fill: (theme.vars || theme).palette.common.white,
    stroke: (theme.vars || theme).palette.grey[500],
    ...theme.applyStyles('dark', {
      fill: (theme.vars || theme).palette.grey[300],
      stroke: (theme.vars || theme).palette.grey[600],
    }),
  },
  [`&.${chartsAxisZoomSliderThumbClasses.horizontal}`]: {
    cursor: 'ew-resize',
  },
  [`&.${chartsAxisZoomSliderThumbClasses.vertical}`]: {
    cursor: 'ns-resize',
  },
}));

export interface ChartsZoomSliderThumbOwnerState {
  onMove: (event: PointerEvent) => void;
  orientation: 'horizontal' | 'vertical';
  placement: 'start' | 'end';
}

export interface ChartsZoomSliderThumbProps
  extends Omit<React.ComponentProps<'rect'>, 'orientation'>, ChartsZoomSliderThumbOwnerState {}

function preventDefault(event: Event) {
  event.preventDefault();
}

/**
 * Renders the zoom slider thumb, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartsAxisZoomSliderThumb = React.forwardRef<
  SVGRectElement,
  ChartsZoomSliderThumbProps
>(function ChartsAxisZoomSliderThumb(
  { className, onMove, orientation, placement, rx = 4, ry = 4, x, y, width, height, ...other },
  forwardedRef,
) {
  const classes = useUtilityClasses({ onMove, orientation, placement });

  const groupRef = React.useRef<SVGGElement>(null);
  const thumbRef = React.useRef<SVGRectElement>(null);
  const ref = useForkRef(thumbRef, forwardedRef);

  const onMoveEvent = useEventCallback(onMove);

  React.useEffect(() => {
    const group = groupRef.current;

    if (!group) {
      return () => {};
    }

    // Prevent scrolling on touch devices when dragging the thumb
    group.addEventListener('touchmove', preventDefault, { passive: false });

    const onPointerMove = rafThrottle((event: PointerEvent) => {
      onMoveEvent(event);
    });

    const onPointerEnd = (event: PointerEvent) => {
      group.removeEventListener('pointermove', onPointerMove);
      group.removeEventListener('pointerup', onPointerEnd);
      group.removeEventListener('pointercancel', onPointerEnd);
      group.releasePointerCapture(event.pointerId);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Prevent text selection when dragging the thumb
      event.preventDefault();
      event.stopPropagation();
      group.setPointerCapture(event.pointerId);

      group.addEventListener('pointermove', onPointerMove);
      group.addEventListener('pointercancel', onPointerEnd);
      group.addEventListener('pointerup', onPointerEnd);
    };

    group.addEventListener('pointerdown', onPointerDown);

    return () => {
      group.removeEventListener('pointerdown', onPointerDown);
      group.removeEventListener('pointermove', onPointerMove);
      group.removeEventListener('pointercancel', onPointerEnd);
      group.removeEventListener('pointerup', onPointerEnd);
      group.removeEventListener('touchmove', preventDefault);
      onPointerMove.clear();
    };
  }, [onMoveEvent, orientation]);

  const numX = Number(x) || 0;
  const numY = Number(y) || 0;
  const numWidth = Number(width) || 0;
  const numHeight = Number(height) || 0;

  // Compute a larger invisible touch target centered on the visible thumb
  const touchWidth = Math.max(numWidth, ZOOM_SLIDER_THUMB_TOUCH_TARGET);
  const touchHeight = Math.max(numHeight, ZOOM_SLIDER_THUMB_TOUCH_TARGET);
  const touchX = numX - (touchWidth - numWidth) / 2;
  const touchY = numY - (touchHeight - numHeight) / 2;

  return (
    <g ref={groupRef}>
      {/* Invisible touch target for easier interaction on touch devices */}
      <rect
        x={touchX}
        y={touchY}
        width={touchWidth}
        height={touchHeight}
        fill="transparent"
        stroke="none"
      />
      <Rect
        ref={ref}
        className={clsx(classes.root, className)}
        rx={rx}
        ry={ry}
        x={x}
        y={y}
        width={width}
        height={height}
        {...other}
      />
    </g>
  );
});
