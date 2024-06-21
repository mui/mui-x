import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';

const isTrackPad = (e: WheelEvent): boolean => {
  const { deltaY } = e;
  if (deltaY && !Number.isInteger(deltaY)) {
    return false;
  }
  return true;
};

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

    const handleZoom = (event: WheelEvent) => {
      event.preventDefault();
      if (element === null) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (isPointOutside(point, area)) {
        return;
      }

      const { deltaY } = event;
      const { left, width } = area;

      // TODO: make step a config option.
      const step = 5;
      const multiplier = isTrackPad(event) ? 1 : 10;
      const scaledStep = (step * multiplier) / 1000;
      const scaleRatio = deltaY < 0 ? 1 - scaledStep : 1 + scaledStep;
      const zoomIn = deltaY > 0;

      const centerRatio = (point.x - left) / width;

      const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoomRange);

      const newSpanPercent = newMaxRange - newMinRange;

      // TODO: make span a config option.
      if (
        (zoomIn && newSpanPercent < MIN_ALLOWED_SPAN) ||
        (!zoomIn && newSpanPercent > MAX_ALLOWED_SPAN)
      ) {
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

      const step = 5;
      const scaledStep = step / 1000;
      let scaleRatio: number = 0;
      let zoomIn: boolean = false;

      const index = eventCacheRef.current.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
      );
      eventCacheRef.current[index] = event;

      const prevDiff = eventPrevDiff.current;
      const [firstEvent, secondEvent] = eventCacheRef.current;

      // If two pointers are down, check for pinch gestures
      if (eventCacheRef.current.length === 2) {
        // Calculate the distance between the two pointers
        const curDiff = Math.hypot(
          firstEvent.pageX - secondEvent.pageX,
          firstEvent.pageY - secondEvent.pageY,
        );

        const hasMoved = prevDiff > 0;

        if (hasMoved && curDiff > prevDiff) {
          // The distance between the two pointers has increased
          scaleRatio = 1 + scaledStep;
          zoomIn = true;
        }
        if (hasMoved && curDiff < prevDiff) {
          // The distance between the two pointers has decreased
          scaleRatio = 1 - scaledStep;
          zoomIn = false;
        }

        if (scaleRatio === 0) {
          eventPrevDiff.current = curDiff;
          return;
        }

        const point = getSVGPoint(element, firstEvent);
        const { left, width } = area;

        const centerRatio = (point.x - left) / width;

        const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoomRange);

        const newSpanPercent = newMaxRange - newMinRange;

        // TODO: make span a config option.
        if (
          (zoomIn && newSpanPercent < MIN_ALLOWED_SPAN) ||
          (!zoomIn && newSpanPercent > MAX_ALLOWED_SPAN)
        ) {
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

    element.addEventListener('wheel', handleZoom);
    element.addEventListener('pointerdown', pointerDownHandler);
    element.addEventListener('pointermove', pointerMoveHandler);
    element.addEventListener('pointerup', pointerUpHandler);
    element.addEventListener('pointercancel', pointerUpHandler);
    element.addEventListener('pointerout', pointerUpHandler);
    element.addEventListener('pointerleave', pointerUpHandler);

    // Prevent zooming the page on touch devices
    element.addEventListener('touchstart', (e) => e.preventDefault());
    element.addEventListener('touchmove', (e) => e.preventDefault());

    return () => {
      element.removeEventListener('wheel', handleZoom);
      element.removeEventListener('pointerdown', pointerDownHandler);
      element.removeEventListener('pointermove', pointerMoveHandler);
      element.removeEventListener('pointerup', pointerUpHandler);
      element.removeEventListener('pointercancel', pointerUpHandler);
      element.removeEventListener('pointerout', pointerUpHandler);
      element.removeEventListener('pointerleave', pointerUpHandler);
    };
  }, [svgRef, setZoomRange, zoomRange, area]);
};
