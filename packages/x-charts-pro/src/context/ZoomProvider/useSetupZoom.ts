'use client';
import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import {
  AxisId,
  DefaultizedZoomOption,
  getSVGPoint,
  UseChartCartesianAxisSignature,
  useChartContext,
  useSelector,
  useStore,
  ZoomData,
} from '@mui/x-charts/internals';
import { UseChartProZoomState } from '../../internals/plugins/useChartProZoom/useChartProZoom.types';
import { selectorChartZoomOptions } from '../../internals/plugins/useChartProZoom';

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
  options: Record<AxisId, DefaultizedZoomOption>,
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
  const store = useStore<[UseChartCartesianAxisSignature, UseChartProZoomState]>();

  const options = useSelector(store, selectorChartZoomOptions);
  const isZoomEnabled = Object.keys(options).length > 0;
  const setZoomMap = React.useCallback(
    (updateFunction: (zoomMap: Map<AxisId, ZoomData>) => Map<AxisId, ZoomData>) =>
      store.update((prev) => ({
        ...prev,
        zoom: {
          ...prev.zoom,
          zoomMap: updateFunction(prev.zoom.zoomMap),
        },
      })),
    [store],
  );
  const setIsInteracting = React.useCallback(
    (newValue: boolean) =>
      store.update((prev) => ({
        ...prev,
        zoom: {
          ...prev.zoom,
          isInteracting: newValue,
        },
      })),
    [store],
  );

  const drawingArea = useDrawingArea();
  const { instance } = useChartContext();

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

      if (!instance.isPointInside(point)) {
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

      store.update((prevState) => {
        const newZoomData = new Map(prevState.zoom.zoomMap);

        let updated = false;
        newZoomData.forEach((zoom, key) => {
          const option = options[zoom.axisId];
          if (!option) {
            return;
          }

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const { scaleRatio, isZoomIn } = getWheelScaleRatio(event, option.step);
          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return;
          }

          updated = true;

          newZoomData.set(key, { axisId: zoom.axisId, start: newMinRange, end: newMaxRange });
        });

        return updated
          ? {
              ...prevState,
              zoom: {
                ...prevState.zoom,
                zoomMap: newZoomData,
              },
            }
          : prevState;
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

      setZoomMap((prevZoomData) => {
        const newZoomData = new Map(prevZoomData);
        let updated = false;

        prevZoomData.forEach((zoom, key) => {
          const option = options[key];
          if (!option) {
            return;
          }

          const { scaleRatio, isZoomIn } = getPinchScaleRatio(
            curDiff,
            eventPrevDiff.current,
            option.step,
          );

          // If the scale ratio is 0, it means the pinch gesture is not valid.
          if (scaleRatio === 0) {
            return;
          }

          const point = getSVGPoint(element, firstEvent);

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return;
          }
          updated = true;
          newZoomData.set(key, { axisId: zoom.axisId, start: newMinRange, end: newMaxRange });
        });

        eventPrevDiff.current = curDiff;

        return updated ? newZoomData : prevZoomData;
      });
    }

    function pointerUpHandler(event: PointerEvent) {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((cachedEvent) => cachedEvent.pointerId === event.pointerId),
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
  }, [svgRef, drawingArea, isZoomEnabled, options, setIsInteracting, instance, setZoomMap, store]);
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
