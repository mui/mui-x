import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';
import { DefaultizedZoomOptions, ZoomData } from './Zoom.types';

/**
 * Helper to get the range (in percents of a reference range) corresponding to a given scale.
 * @param centerRatio {number} The ratio of the point that should not move between the previous and next range.
 * @param scaleRatio {number} The target scale ratio.
 * @returns The range to display.
 */
const zoomAtPoint = (
  centerRatio: number,
  scaleRatio: number,
  currentZoomData: ZoomData,
  options: DefaultizedZoomOptions,
) => {
  const MIN_RANGE = options.minStart;
  const MAX_RANGE = options.maxEnd;

  const MIN_ALLOWED_SPAN = options.minSpan;

  const minRange = currentZoomData.start;
  const maxRange = currentZoomData.end;

  const point = minRange + centerRatio * (maxRange - minRange);

  let newMinRange = (minRange + point * (scaleRatio - 1)) / scaleRatio;
  let newMaxRange = (maxRange + point * (scaleRatio - 1)) / scaleRatio;

  let minSpillover = 0;
  let maxSpillover = 0;

  if (newMinRange < MIN_RANGE) {
    minSpillover = Math.abs(newMinRange);
    newMinRange = MIN_RANGE;
  }
  if (newMaxRange > MAX_RANGE) {
    maxSpillover = Math.abs(newMaxRange - MAX_RANGE);
    newMaxRange = MAX_RANGE;
  }

  if (minSpillover > 0 && maxSpillover > 0) {
    return [MIN_RANGE, MAX_RANGE];
  }

  newMaxRange += minSpillover;
  newMinRange -= maxSpillover;

  newMinRange = Math.min(MAX_RANGE - MIN_ALLOWED_SPAN, Math.max(MIN_RANGE, newMinRange));
  newMaxRange = Math.max(MIN_ALLOWED_SPAN, Math.min(MAX_RANGE, newMaxRange));

  return [newMinRange, newMaxRange];
};

export const useSetupZoom = () => {
  const { setZoomData, isZoomEnabled, options, setIsInteracting } = useZoom();
  const drawingArea = useDrawingArea();

  const svgRef = useSvgRef();
  const eventCacheRef = React.useRef<PointerEvent[]>([]);
  const eventPrevDiff = React.useRef<number>(0);
  const interactionTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled) {
      return () => {};
    }

    const wheelHandler = (event: WheelEvent) => {
      if (element === null) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (!drawingArea.isPointInside(point)) {
        return;
      }

      event.preventDefault();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      setIsInteracting(true);
      // Debounce transition to `isInteractive=false`.
      // Useful because wheel events don't have an "end" event.
      interactionTimeoutRef.current = window.setTimeout(() => {
        setIsInteracting(false);
      }, 166);

      setZoomData((prevZoomData) => {
        return prevZoomData.map((zoom) => {
          const option = options[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const { scaleRatio, isZoomIn } = getWheelScaleRatio(event, option.step);
          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }

          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
      });
    };

    function pointerDownHandler(event: PointerEvent) {
      eventCacheRef.current.push(event);
      setIsInteracting(true);
    }

    function pointerMoveHandler(event: PointerEvent) {
      if (element === null) {
        return;
      }

      const index = eventCacheRef.current.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
      );
      eventCacheRef.current[index] = event;

      // Not a pinch gesture
      if (eventCacheRef.current.length !== 2) {
        return;
      }

      const firstEvent = eventCacheRef.current[0];
      const curDiff = getDiff(eventCacheRef.current);

      setZoomData((prevZoomData) => {
        const newZoomData = prevZoomData.map((zoom) => {
          const option = options[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const { scaleRatio, isZoomIn } = getPinchScaleRatio(
            curDiff,
            eventPrevDiff.current,
            option.step,
          );

          // If the scale ratio is 0, it means the pinch gesture is not valid.
          if (scaleRatio === 0) {
            return zoom;
          }

          const point = getSVGPoint(element, firstEvent);

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }
          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
        eventPrevDiff.current = curDiff;
        return newZoomData;
      });
    }

    function pointerUpHandler(event: PointerEvent) {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((e) => e.pointerId === event.pointerId),
        1,
      );

      if (eventCacheRef.current.length < 2) {
        eventPrevDiff.current = 0;
      }

      if (event.type === 'pointerup' || event.type === 'pointercancel') {
        setIsInteracting(false);
      }
    }

    element.addEventListener('wheel', wheelHandler);
    element.addEventListener('pointerdown', pointerDownHandler);
    element.addEventListener('pointermove', pointerMoveHandler);
    element.addEventListener('pointerup', pointerUpHandler);
    element.addEventListener('pointercancel', pointerUpHandler);
    element.addEventListener('pointerout', pointerUpHandler);
    element.addEventListener('pointerleave', pointerUpHandler);

    // Prevent zooming the entire page on touch devices
    element.addEventListener('touchstart', preventDefault);
    element.addEventListener('touchmove', preventDefault);

    return () => {
      element.removeEventListener('wheel', wheelHandler);
      element.removeEventListener('pointerdown', pointerDownHandler);
      element.removeEventListener('pointermove', pointerMoveHandler);
      element.removeEventListener('pointerup', pointerUpHandler);
      element.removeEventListener('pointercancel', pointerUpHandler);
      element.removeEventListener('pointerout', pointerUpHandler);
      element.removeEventListener('pointerleave', pointerUpHandler);
      element.removeEventListener('touchstart', preventDefault);
      element.removeEventListener('touchmove', preventDefault);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [svgRef, setZoomData, drawingArea, isZoomEnabled, options, setIsInteracting]);
};

/**
 * Checks if the new span is valid.
 */
function isSpanValid(
  minRange: number,
  maxRange: number,
  isZoomIn: boolean,
  option: DefaultizedZoomOptions,
) {
  const newSpanPercent = maxRange - minRange;

  if (
    (isZoomIn && newSpanPercent < option.minSpan) ||
    (!isZoomIn && newSpanPercent > option.maxSpan)
  ) {
    return false;
  }

  if (minRange < option.minStart || maxRange > option.maxEnd) {
    return false;
  }

  return true;
}

function getMultiplier(event: WheelEvent) {
  const ctrlMultiplier = event.ctrlKey ? 3 : 1;

  // DeltaMode: 0 is pixel, 1 is line, 2 is page
  // This is defined by the browser.
  if (event.deltaMode === 1) {
    return 1 * ctrlMultiplier;
  }
  if (event.deltaMode) {
    return 10 * ctrlMultiplier;
  }
  return 0.2 * ctrlMultiplier;
}

/**
 * Get the scale ratio and if it's a zoom in or out from a wheel event.
 */
function getWheelScaleRatio(event: WheelEvent, step: number) {
  const deltaY = -event.deltaY;
  const multiplier = getMultiplier(event);
  const scaledStep = (step * multiplier * deltaY) / 1000;
  // Clamp the scale ratio between 0.1 and 1.9 so that the zoom is not too big or too small.
  const scaleRatio = Math.min(Math.max(1 + scaledStep, 0.1), 1.9);
  const isZoomIn = deltaY > 0;
  return { scaleRatio, isZoomIn };
}

/**
 * Get the scale ratio and if it's a zoom in or out from a pinch gesture.
 */
function getPinchScaleRatio(curDiff: number, prevDiff: number, step: number) {
  const scaledStep = step / 1000;
  let scaleRatio: number = 0;
  let isZoomIn: boolean = false;

  const hasMoved = prevDiff > 0;

  if (hasMoved && curDiff > prevDiff) {
    // The distance between the two pointers has increased
    scaleRatio = 1 + scaledStep;
    isZoomIn = true;
  }
  if (hasMoved && curDiff < prevDiff) {
    // The distance between the two pointers has decreased
    scaleRatio = 1 - scaledStep;
    isZoomIn = false;
  }

  return { scaleRatio, isZoomIn };
}

function getDiff(eventCache: PointerEvent[]) {
  const [firstEvent, secondEvent] = eventCache;
  return Math.hypot(firstEvent.pageX - secondEvent.pageX, firstEvent.pageY - secondEvent.pageY);
}

/**
 * Get the ratio of the point in the horizontal center of the area.
 */
function getHorizontalCenterRatio(
  point: { x: number; y: number },
  area: { left: number; width: number },
) {
  const { left, width } = area;
  return (point.x - left) / width;
}

function preventDefault(event: TouchEvent) {
  event.preventDefault();
}

function getVerticalCenterRatio(
  point: { x: number; y: number },
  area: { top: number; height: number },
) {
  const { top, height } = area;
  return ((point.y - top) / height) * -1 + 1;
}
