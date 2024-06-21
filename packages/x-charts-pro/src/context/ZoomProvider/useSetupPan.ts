import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';

const MAX_RANGE = 100;
const MIN_RANGE = 0;

// TODO: move to helper
const isPointOutside = (
  point: { x: number; y: number },
  area: { left: number; top: number; width: number; height: number },
) => {
  const outsideX = point.x < area.left || point.x > area.left + area.width;
  const outsideY = point.y < area.top || point.y > area.top + area.height;
  return outsideX || outsideY;
};

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return 'targetTouches' in event;
};

export const useSetupPan = () => {
  const { zoomRange, setZoomRange } = useZoom();
  const area = useDrawingArea();

  const svgRef = useSvgRef();

  const isTrackingRef = React.useRef(false);
  const touchStartRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handlePan = (event: MouseEvent | TouchEvent) => {
      if (element === null || !isTrackingRef.current) {
        return;
      }

      let target: Touch | MouseEvent;
      let movementX: number;

      if (isTouchEvent(event)) {
        target = event.targetTouches[0];
        movementX = target.clientX - (touchStartRef.current ?? 0);
        touchStartRef.current = target.clientX;
      } else {
        target = event;
        movementX = event.movementX;
      }

      const point = getSVGPoint(element, target);

      if (isPointOutside(point, area)) {
        isTrackingRef.current = false;
        return;
      }

      const range = zoomRange;
      const [min, max] = range;
      const span = max - min;

      let newMinRange = min - (movementX / area.width) * span;
      let newMaxRange = max - (movementX / area.width) * span;

      if (newMinRange < MIN_RANGE) {
        newMinRange = MIN_RANGE;
        newMaxRange = span;
      }

      if (newMaxRange > MAX_RANGE) {
        newMaxRange = MAX_RANGE;
        newMinRange = MAX_RANGE - span;
      }

      setZoomRange([newMinRange, newMaxRange]);
    };

    const handleDown = (event: MouseEvent | TouchEvent) => {
      // Prevent text selection
      event.preventDefault();
      isTrackingRef.current = true;
      touchStartRef.current = isTouchEvent(event) ? event.targetTouches[0].clientX : null;
    };

    const handleUp = () => {
      isTrackingRef.current = false;
      touchStartRef.current = null;
    };

    element.addEventListener('mousedown', handleDown);
    element.addEventListener('mousemove', handlePan);
    element.addEventListener('mouseup', handleUp);
    element.addEventListener('touchstart', handleDown);
    element.addEventListener('touchmove', handlePan);
    element.addEventListener('touchend', handleUp);

    return () => {
      element.removeEventListener('mousedown', handleDown);
      element.removeEventListener('mousemove', handlePan);
      element.removeEventListener('mouseup', handleUp);
      element.removeEventListener('touchstart', handleDown);
      element.removeEventListener('touchmove', handlePan);
      element.removeEventListener('touchend', handleUp);
    };
  }, [area, svgRef, isTrackingRef, zoomRange, setZoomRange]);
};
