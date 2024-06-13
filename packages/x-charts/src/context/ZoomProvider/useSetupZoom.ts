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

const zoomAtPoint = (point: number, scale: number, currentRange: [number, number]) => {
  const [minRange, maxRange] = currentRange;

  // m = minRange, M = maxRange, z = scale, P = point
  // [(m+(z−1)P)/z,((z−1)P+M)/z]
  let newMinRange = (minRange + (scale - 1) * (point - minRange)) / scale;
  let minSpillover = 0;

  if (newMinRange < 0) {
    minSpillover = Math.abs(newMinRange);
    newMinRange = 0;
  }

  let newMaxRange = ((point - maxRange) * (scale - 1) + maxRange) / scale;
  let maxSpillover = 0;

  if (newMaxRange > 100) {
    newMaxRange = 100;
    maxSpillover = Math.abs(newMaxRange - 100);
  }

  console.log('sp', minSpillover, maxSpillover);

  newMaxRange += minSpillover;
  newMinRange -= maxSpillover;

  console.log('1', newMinRange, newMaxRange);

  newMinRange = Math.max(0, newMinRange);
  newMaxRange = Math.min(100, newMaxRange);
  console.log('2', newMinRange, newMaxRange);

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
      if ((zoomIn && newSpanPercent < 10) || (!zoomIn && newSpanPercent > 100)) {
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
