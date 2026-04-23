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
import { ZOOM_SLIDER_TOUCH_TARGET } from './constants';

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

/**
 * Invisible touch target that is only active on coarse pointer devices (touch).
 * On fine pointer devices (mouse), it disables pointer events so it doesn't
 * interfere with precise interactions on small zoom ranges.
 */
const TouchTarget = styled('rect')({
  '@media (pointer: fine)': {
    pointerEvents: 'none',
  },
});

export interface ChartsZoomSliderThumbOwnerState {
  onMove: (event: PointerEvent) => void;
  orientation: 'horizontal' | 'vertical';
  placement: 'start' | 'end';
}

export interface ChartsZoomSliderThumbProps
  extends Omit<React.ComponentProps<'rect'>, 'orientation'>, ChartsZoomSliderThumbOwnerState {
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

/**
 * Renders the zoom slider thumb, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartsAxisZoomSliderThumb = React.forwardRef<
  SVGRectElement,
  ChartsZoomSliderThumbProps
>(function ChartsAxisZoomSliderThumb(
  {
    className,
    onMove,
    orientation,
    placement,
    rx = 4,
    ry = 4,
    x,
    y,
    width,
    height,
    onInteractionStart,
    onInteractionEnd,
    onPointerEnter,
    onPointerLeave,
    ...other
  },
  forwardedRef,
) {
  const classes = useUtilityClasses({ onMove, orientation, placement });

  const groupRef = React.useRef<SVGGElement>(null);
  const thumbRef = React.useRef<SVGRectElement>(null);
  const ref = useForkRef(thumbRef, forwardedRef);
  const isDraggingRef = React.useRef(false);

  const onMoveEvent = useEventCallback(onMove);

  const throttledMove = React.useMemo(
    () => rafThrottle((event: PointerEvent) => onMoveEvent(event)),
    [onMoveEvent],
  );

  React.useEffect(() => () => throttledMove.clear(), [throttledMove]);

  const handlePointerDown = useEventCallback((event: React.PointerEvent<SVGGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // setPointerCapture can fail if the pointer is no longer active,
      // e.g., during touch→mouse compatibility events.
      return;
    }
    isDraggingRef.current = true;
    onInteractionStart?.();
  });

  const handlePointerMove = useEventCallback((event: React.PointerEvent<SVGGElement>) => {
    if (!isDraggingRef.current) {
      return;
    }
    throttledMove(event.nativeEvent);
  });

  const handlePointerEnd = useEventCallback((event: React.PointerEvent<SVGGElement>) => {
    if (!isDraggingRef.current) {
      return;
    }
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore if pointer is no longer active
    }
    isDraggingRef.current = false;
    onInteractionEnd?.();
  });

  const numX = Number(x) || 0;
  const numY = Number(y) || 0;
  const numWidth = Number(width) || 0;
  const numHeight = Number(height) || 0;

  // Compute a larger invisible touch target centered on the visible thumb
  const touchWidth = Math.max(numWidth, ZOOM_SLIDER_TOUCH_TARGET);
  const touchHeight = Math.max(numHeight, ZOOM_SLIDER_TOUCH_TARGET);
  const touchX = numX - (touchWidth - numWidth) / 2;
  const touchY = numY - (touchHeight - numHeight) / 2;

  return (
    <g
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <Rect
        ref={ref}
        className={clsx(classes.root, className)}
        rx={rx}
        ry={ry}
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        {...other}
      />
      {/* Invisible touch target rendered on top for easier interaction on touch devices */}
      <TouchTarget
        x={touchX}
        y={touchY}
        width={touchWidth}
        height={touchHeight}
        fill="transparent"
        stroke="none"
        cursor={orientation === 'horizontal' ? 'ew-resize' : 'ns-resize'}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      />
    </g>
  );
});
