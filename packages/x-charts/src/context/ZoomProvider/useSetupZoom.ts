import * as React from 'react';
import { useDrawingArea, useSvgRef } from '../../hooks';
import { useZoom } from './useZoom';
import { getSVGPoint } from '../../internals/utils';

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
      const multiplier = isTrackPad(event) ? 1 : 5;
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

    element.addEventListener('wheel', handleZoom);

    return () => {
      element.removeEventListener('wheel', handleZoom);
    };
  }, [svgRef, setZoomRange, zoomRange, area]);
};
