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

const Rect = styled('rect')(({ theme }) => ({
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
  extends Omit<React.ComponentProps<'rect'>, 'orientation'>,
    ChartZoomSliderThumbOwnerState {}

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
        return;
      }

      let prevTouchAction = 'auto';

      const onPointerMove = rafThrottle((event: PointerEvent) => {
        onMoveEvent(event);
      });

      const onPointerUp = () => {
        thumb.removeEventListener('pointermove', onPointerMove);
        thumb.removeEventListener('pointerup', onPointerUp);
        document.body.style.touchAction = prevTouchAction;
      };

      const onPointerDown = (event: PointerEvent) => {
        // Prevent text selection when dragging the thumb
        event.preventDefault();
        event.stopPropagation();
        thumb.setPointerCapture(event.pointerId);

        /* Disable touch scrolling while dragging to improve slider thumb usage on mobile */
        prevTouchAction = document.body.style.touchAction;
        document.body.style.touchAction = 'none';

        thumb.addEventListener('pointerup', onPointerUp);
        thumb.addEventListener('pointermove', onPointerMove);
      };

      thumb.addEventListener('pointerdown', onPointerDown);

      // eslint-disable-next-line consistent-return
      return () => {
        thumb.removeEventListener('pointerdown', onPointerDown);
        onPointerMove.clear();
      };
    }, [onMoveEvent, orientation]);

    return <Rect className={clsx(classes.root, className)} ref={ref} rx={rx} ry={ry} {...other} />;
  },
);
