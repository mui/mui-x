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

export const useSetupPan = () => {
  const { zoomRange, setZoomRange } = useZoom();
  const area = useDrawingArea();

  const svgRef = useSvgRef();

  const isPanningRef = React.useRef(false);
  const touchStartRef = React.useRef<number | null>(null);
  const eventCacheRef = React.useRef<PointerEvent[]>([]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handlePan = (event: PointerEvent) => {
      if (element === null || !isPanningRef.current || eventCacheRef.current.length > 1) {
        return;
      }

      const movementX = event.clientX - (touchStartRef.current ?? 0);
      touchStartRef.current = event.clientX;

      const point = getSVGPoint(element, event);

      if (isPointOutside(point, area)) {
        isPanningRef.current = false;
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

    const handleDown = (event: PointerEvent) => {
      eventCacheRef.current.push(event);
      // Prevent default if there is only one pointer
      // otherwise it prevents the pinch movement.
      if (eventCacheRef.current.length === 1) {
        event.preventDefault();
      }
      isPanningRef.current = true;
      touchStartRef.current = event.clientX;
    };

    const handleUp = (event: PointerEvent) => {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((e) => e.pointerId === event.pointerId),
        1,
      );
      isPanningRef.current = false;
      touchStartRef.current = null;
    };

    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointermove', handlePan);
    element.addEventListener('pointerup', handleUp);

    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointermove', handlePan);
      element.removeEventListener('pointerup', handleUp);
    };
  }, [area, svgRef, isPanningRef, zoomRange, setZoomRange]);
};
