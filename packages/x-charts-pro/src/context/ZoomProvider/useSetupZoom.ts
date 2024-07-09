import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';

const MAX_RANGE = 100;
const MIN_RANGE = 0;

const MIN_ALLOWED_SPAN = 10;
const MAX_ALLOWED_SPAN = 100;

/**
 * Helper to get the range (in percents of a reference range) corresponding to a given scale.
 * @param centerRatio {number} The ratio of the point that should not move between the previous and next range.
 * @param scaleRatio {number} The target scale ratio.
 * @returns The range to display.
 */
const zoomAtPoint = (
  centerRatio: number,
  scaleRatio: number,
  currentRange: readonly [number, number],
) => {
  const [minRange, maxRange] = currentRange;

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

const isPointOutside = (
  point: { x: number; y: number },
  area: { left: number; top: number; width: number; height: number },
) => {
  const outsideX = point.x < area.left || point.x > area.left + area.width;
  const outsideY = point.y < area.top || point.y > area.top + area.height;
  return outsideX || outsideY;
};

export const useSetupZoom = () => {
  const { zoomRange, setZoomRange } = useZoom();
  const area = useDrawingArea();

  const svgRef = useSvgRef();
  const eventCacheRef = React.useRef<PointerEvent[]>([]);
  const eventPrevDiff = React.useRef<number>(0);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const wheelHandler = (event: WheelEvent) => {
      if (element === null) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (isPointOutside(point, area)) {
        return;
      }

      event.preventDefault();

      const centerRatio = getHorizontalCenterRatio(point, area);

      // TODO: make step a config option.
      const step = 5;
      const { scaleRatio, isZoomIn } = getWheelScaleRatio(event, step);

      const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoomRange);

      // TODO: make span a config option.
      if (!isSpanValid(newMinRange, newMaxRange, isZoomIn)) {
        return;
      }

      setZoomRange([newMinRange, newMaxRange]);
    };

    function pointerDownHandler(event: PointerEvent) {
      eventCacheRef.current.push(event);
    }

    function pointerMoveHandler(event: PointerEvent) {
      if (element === null) {
        return;
      }

      const index = eventCacheRef.current.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
      );
      eventCacheRef.current[index] = event;

      // If two pointers are down, check for pinch gestures
      if (eventCacheRef.current.length === 2) {
        // TODO: make step configurable
        const step = 5;
        const { scaleRatio, isZoomIn, curDiff, firstEvent } = getPinchScaleRatio(
          eventCacheRef.current,
          eventPrevDiff.current,
          step,
        );

        // If the scale ratio is 0, it means the pinch gesture is not valid.
        if (scaleRatio === 0) {
          eventPrevDiff.current = curDiff;
          return;
        }

        const point = getSVGPoint(element, firstEvent);

        const centerRatio = getHorizontalCenterRatio(point, area);

        const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoomRange);

        // TODO: make span a config option.
        if (!isSpanValid(newMinRange, newMaxRange, isZoomIn)) {
          eventPrevDiff.current = curDiff;
          return;
        }

        eventPrevDiff.current = curDiff;
        setZoomRange([newMinRange, newMaxRange]);
      }
    }

    function pointerUpHandler(event: PointerEvent) {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((e) => e.pointerId === event.pointerId),
        1,
      );

      if (eventCacheRef.current.length < 2) {
        eventPrevDiff.current = 0;
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
    };
  }, [svgRef, setZoomRange, zoomRange, area]);
};

/**
 * Checks if the new span is valid.
 */
function isSpanValid(minRange: number, maxRange: number, isZoomIn: boolean) {
  const newSpanPercent = maxRange - minRange;

  // TODO: make span a config option.
  if (
    (isZoomIn && newSpanPercent < MIN_ALLOWED_SPAN) ||
    (!isZoomIn && newSpanPercent > MAX_ALLOWED_SPAN)
  ) {
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
function getPinchScaleRatio(eventCache: PointerEvent[], prevDiff: number, step: number) {
  const scaledStep = step / 1000;
  let scaleRatio: number = 0;
  let isZoomIn: boolean = false;

  const [firstEvent, secondEvent] = eventCache;

  // Calculate the distance between the two pointers
  const curDiff = Math.hypot(
    firstEvent.pageX - secondEvent.pageX,
    firstEvent.pageY - secondEvent.pageY,
  );

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

  return { scaleRatio, isZoomIn, curDiff, firstEvent };
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
