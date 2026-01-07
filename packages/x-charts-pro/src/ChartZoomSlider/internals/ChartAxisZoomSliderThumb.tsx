'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import clsx from 'clsx';
import {
  chartAxisZoomSliderThumbClasses,
  useUtilityClasses,
} from './chartAxisZoomSliderThumbClasses';

const Rect = styled('rect', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  [`&.${chartAxisZoomSliderThumbClasses.root}`]: {
    fill: (theme.vars || theme).palette.common.white,
    stroke: (theme.vars || theme).palette.grey[500],
    ...theme.applyStyles('dark', {
      fill: (theme.vars || theme).palette.grey[300],
      stroke: (theme.vars || theme).palette.grey[600],
    }),
  },
  [`&.${chartAxisZoomSliderThumbClasses.horizontal}`]: {
    cursor: 'ew-resize',
  },
  [`&.${chartAxisZoomSliderThumbClasses.vertical}`]: {
    cursor: 'ns-resize',
  },
}));

export interface ChartZoomSliderThumbOwnerState {
  onMove: (event: PointerEvent) => void;
  orientation: 'horizontal' | 'vertical';
  placement: 'start' | 'end';
}

export interface ChartZoomSliderThumbProps
  extends Omit<React.ComponentProps<'rect'>, 'orientation'>, ChartZoomSliderThumbOwnerState {}

function preventDefault(event: Event) {
  event.preventDefault();
}

/**
 * Renders the zoom slider thumb, which is responsible for resizing the zoom range.
 * @internal
 */
export const ChartAxisZoomSliderThumb = React.forwardRef<SVGRectElement, ChartZoomSliderThumbProps>(
  function ChartAxisZoomSliderThumb(
    { className, onMove, orientation, placement, rx = 4, ry = 4, ...other },
    forwardedRef,
  ) {
    const classes = useUtilityClasses({ onMove, orientation, placement });

    const thumbRef = React.useRef<SVGRectElement>(null);
    const ref = useForkRef(thumbRef, forwardedRef);

    const onMoveEvent = useEventCallback(onMove);

    React.useEffect(() => {
      const thumb = thumbRef.current;

      if (!thumb) {
        return () => {};
      }

      // Prevent scrolling on touch devices when dragging the thumb
      thumb.addEventListener('touchmove', preventDefault, { passive: false });

      const onPointerMove = rafThrottle((event: PointerEvent) => {
        onMoveEvent(event);
      });

      const onPointerEnd = (event: PointerEvent) => {
        thumb.removeEventListener('pointermove', onPointerMove);
        thumb.removeEventListener('pointerup', onPointerEnd);
        thumb.removeEventListener('pointercancel', onPointerEnd);
        thumb.releasePointerCapture(event.pointerId);
      };

      const onPointerDown = (event: PointerEvent) => {
        // Prevent text selection when dragging the thumb
        event.preventDefault();
        event.stopPropagation();
        thumb.setPointerCapture(event.pointerId);

        thumb.addEventListener('pointermove', onPointerMove);
        thumb.addEventListener('pointercancel', onPointerEnd);
        thumb.addEventListener('pointerup', onPointerEnd);
      };

      thumb.addEventListener('pointerdown', onPointerDown);

      return () => {
        thumb.removeEventListener('pointerdown', onPointerDown);
        thumb.removeEventListener('pointermove', onPointerMove);
        thumb.removeEventListener('pointercancel', onPointerEnd);
        thumb.removeEventListener('pointerup', onPointerEnd);
        thumb.removeEventListener('touchmove', preventDefault);
        onPointerMove.clear();
      };
    }, [onMoveEvent, orientation]);

    return <Rect className={clsx(classes.root, className)} ref={ref} rx={rx} ry={ry} {...other} />;
  },
);
