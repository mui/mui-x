import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';

// TODO: move to helper
const isPointOutside = (
  point: { x: number; y: number },
  area: { left: number; top: number; width: number; height: number },
) => {
  const outsideX = point.x < area.left || point.x > area.left + area.width;
  const outsideY = point.y < area.top || point.y > area.top + area.height;
  return outsideX || outsideY;
};

export const useSetupPan = () => {
  const { zoomRange, setZoomRange } = useZoom();
  const area = useDrawingArea();

  const svgRef = useSvgRef();

  const isTrackingRef = React.useRef(false);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handlePan = (event: MouseEvent) => {
      if (element === null || !isTrackingRef.current) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (isPointOutside(point, area)) {
        isTrackingRef.current = false;
        return;
      }

      const { movementX } = event;

      const range = zoomRange;
      const [min, max] = range;
      const span = max - min;

      const newMinRange = min - (movementX / area.width) * span;
      const newMaxRange = max - (movementX / area.width) * span;

      setZoomRange([newMinRange, newMaxRange]);
    };

    const handleDown = () => {
      isTrackingRef.current = true;
    };

    const handleUp = () => {
      isTrackingRef.current = false;
    };

    element.addEventListener('mousedown', handleDown);
    element.addEventListener('mousemove', handlePan);
    element.addEventListener('mouseup', handleUp);

    return () => {
      element.removeEventListener('mousedown', handleDown);
      element.removeEventListener('mousemove', handlePan);
      element.removeEventListener('mouseup', handleUp);
    };
  }, [area, svgRef, isTrackingRef, zoomRange, setZoomRange]);
};
