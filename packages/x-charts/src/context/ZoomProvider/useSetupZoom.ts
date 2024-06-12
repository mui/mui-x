import * as React from 'react';
import { useDrawingArea, useSvgRef } from '../../hooks';
import { useZoom } from './useZoom';
import { getSVGPoint } from '../../internals/utils';

const zoomAtPoint = (point: number, scale: number, currentRange: [number, number]) => {
  const [minRange, maxRange] = currentRange;

  // m = minRange, M = maxRange, z = scale, P = point
  // [(m+(z−1)P)/z,((z−1)P+M)/z]
  const newMinRange = Math.max(0, (minRange + (scale - 1) * (point - minRange)) / scale);
  const newMaxRange = Math.min(100, ((point - maxRange) * (scale - 1) + maxRange) / scale);

  return [newMinRange, newMaxRange];
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
      const { deltaY } = event;
      const { left, width } = area;

      // TODO: make step a config option.
      const scale = deltaY < 0 ? 0.995 : 1.005;

      // Center point is a number from 0 to 200, where 100 is the center of the chart.
      // This is because our calculations scale on center for 100 if there is no skew.
      // We clamp the window value to 0-100 then double it.
      const centerPoint = Math.min(100, Math.max(0, ((point.x - left) / width) * 100)) * 2;

      // TODO: zoom at cursor position.
      const [newMinRange, newMaxRange] = zoomAtPoint(centerPoint, scale, zoomRange);

      const newSpanPercent = newMaxRange - newMinRange;

      // TODO: make span a config option.
      if (newSpanPercent < 10 || newSpanPercent > 100) {
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
