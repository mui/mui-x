import * as React from 'react';
import { useSvgRef } from '../../hooks';
import { useZoom } from './useZoom';

const zoomAtPoint = (point: number, scale: number, currentRange: [number, number]) => {
  const [minRange, maxRange] = currentRange;

  // m = minRange, M = maxRange, z = scale, P = point
  // [(m+(z−1)P)/z,((z−1)P+M)/z]
  const newMinRange = Math.max(0, (minRange + (scale - 1) * (point - minRange)) / scale);
  const newMaxRange = Math.min(100, ((point - maxRange) * (scale - 1) + maxRange) / scale);

  return [newMinRange, newMaxRange];
};

const centerOfRange = (range: [number, number]) => {
  const [min, max] = range;
  return (max - min) / 2;
};

export const useSetupZoom = () => {
  const { zoomRange, setZoomRange } = useZoom();

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

      const { deltaY } = event;

      // TODO: make step a config option.
      const scale = deltaY < 0 ? 0.995 : 1.005;

      const centerPoint = centerOfRange(zoomRange);

      // TODO: zoom at cursor position.
      const [newMinRange, newMaxRange] = zoomAtPoint(centerPoint, scale, zoomRange);

      const newSpanPercent = newMaxRange - newMinRange;

      // TODO: make span a config option.
      if (newSpanPercent < 10) {
        return;
      }

      setZoomRange([newMinRange, newMaxRange]);
    };

    element.addEventListener('wheel', handleZoom);

    return () => {
      element.removeEventListener('wheel', handleZoom);
    };
  }, [svgRef, setZoomRange, zoomRange]);
};
