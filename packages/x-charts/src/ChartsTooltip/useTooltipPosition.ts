'use client';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { useSvgRef } from '../hooks';

export function useTooltipPosition() {
  const svgRef = useSvgRef();
  const [position, setPosition] = React.useState<null | { x: number; y: number }>(null);

  React.useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement === null) {
      return undefined;
    }

    const pointerUpdate = rafThrottle((x: number, y: number) => {
      setPosition({ x, y });
    });

    const handlePointerEvent = (event: PointerEvent) => {
      pointerUpdate(event.clientX, event.clientY);
    };

    svgElement.addEventListener('pointerdown', handlePointerEvent);
    svgElement.addEventListener('pointermove', handlePointerEvent);
    svgElement.addEventListener('pointerenter', handlePointerEvent);

    return () => {
      svgElement.removeEventListener('pointerdown', handlePointerEvent);
      svgElement.removeEventListener('pointermove', handlePointerEvent);
      svgElement.removeEventListener('pointerenter', handlePointerEvent);
      pointerUpdate.clear();
    };
  }, [svgRef]);

  return position;
}
