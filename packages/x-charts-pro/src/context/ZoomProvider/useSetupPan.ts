import * as React from 'react';
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks';
import { getSVGPoint } from '@mui/x-charts/internals';
import { useZoom } from './useZoom';

const MAX_RANGE = 100;
const MIN_RANGE = 0;

export const useSetupPan = () => {
  const { zoomRange, setZoomRange, setIsInteracting } = useZoom();
  const area = useDrawingArea();

  const svgRef = useSvgRef();

  const isDraggingRef = React.useRef(false);
  const touchStartRef = React.useRef<{ x: number; minX: number; maxX: number } | null>(null);
  const eventCacheRef = React.useRef<PointerEvent[]>([]);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handlePan = (event: PointerEvent) => {
      if (element === null || !isDraggingRef.current || eventCacheRef.current.length > 1) {
        return;
      }

      if (touchStartRef.current == null) {
        return;
      }

      const point = getSVGPoint(element, event);
      const movementX = point.x - touchStartRef.current.x;

      const max = touchStartRef.current.maxX;
      const min = touchStartRef.current.minX;
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
      isDraggingRef.current = true;
      setIsInteracting(true);

      const point = getSVGPoint(element, event);
      touchStartRef.current = {
        x: point.x,
        minX: zoomRange[0],
        maxX: zoomRange[1],
      };
    };

    const handleUp = (event: PointerEvent) => {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((e) => e.pointerId === event.pointerId),
        1,
      );
      setIsInteracting(false);
      isDraggingRef.current = false;
      touchStartRef.current = null;
    };

    element.addEventListener('pointerdown', handleDown);
    document.addEventListener('pointermove', handlePan);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);
    document.addEventListener('pointerleave', handleUp);

    return () => {
      element.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointermove', handlePan);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
      document.removeEventListener('pointerleave', handleUp);
    };
  }, [area, svgRef, isDraggingRef, zoomRange, setZoomRange, setIsInteracting]);
};
