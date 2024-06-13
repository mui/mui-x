import * as React from 'react';
import { useDrawingArea, useSvgRef } from '../../hooks';
import { useZoom } from './useZoom';
import { getSVGPoint } from '../../internals/utils';

function throttle(fn: Function, wait: number) {
  let time = Date.now();

  return function inThrottle(event: WheelEvent) {
    event.preventDefault();

    if (time + wait - Date.now() < 0) {
      fn(event);
      time = Date.now();
    }
  };
}

const MAX_RANGE = 100;
const MIN_RANGE = 0;

const MIN_ALLOWED_SPAN = 10;
const MAX_ALLOWED_SPAN = 100;

const zoomAtPoint = (point: number, scale: number, currentRange: [number, number]) => {
  const [minRange, maxRange] = currentRange;

  // m = minRange, M = maxRange, z = scale, P = point
  // [(m+(z−1)P)/z,((z−1)P+M)/z]
  let newMinRange = (minRange + (scale - 1) * (point - minRange)) / scale;
  let minSpillover = 0;

  if (newMinRange < MIN_RANGE) {
    minSpillover = Math.abs(newMinRange);
    newMinRange = MIN_RANGE;
  }

  let newMaxRange = ((point - maxRange) * (scale - 1) + maxRange) / scale;
  let maxSpillover = 0;

  if (newMaxRange > MAX_RANGE) {
    newMaxRange = MAX_RANGE;
    maxSpillover = Math.abs(newMaxRange - MAX_RANGE);
  }

  if (minSpillover > 0 && maxSpillover > 0) {
    // This shouldn't happen, but just in case.
    throw Error('MUI X Charts: Both min and max zoom ranges spillover the [0-100] boundary.');
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
      const scale = deltaY < 0 ? 0.995 : 1.005;
      const zoomIn = deltaY > 0;

      // Center point is a number from 0 to 200, where 100 is the center of the chart.
      // This is because our calculations scale on center for 100 if there is no skew.
      // We clamp the window value to 0-100 then double it.
      const centerPoint = Math.min(100, Math.max(0, ((point.x - left) / width) * 100)) * 2;

      // TODO: zoom at cursor position.
      const [newMinRange, newMaxRange] = zoomAtPoint(centerPoint, scale, zoomRange);

      const newSpanPercent = newMaxRange - newMinRange;

      console.log('newSpanPercent', newSpanPercent);

      // TODO: make span a config option.
      if (
        (zoomIn && newSpanPercent < MIN_ALLOWED_SPAN) ||
        (!zoomIn && newSpanPercent > MAX_ALLOWED_SPAN)
      ) {
        return;
      }

      setZoomRange([newMinRange, newMaxRange]);
    };

    const handler = throttle(handleZoom, 25);

    element.addEventListener('wheel', handler);

    return () => {
      element.removeEventListener('wheel', handler);
    };
  }, [svgRef, setZoomRange, zoomRange, area]);
};
