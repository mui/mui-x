'use client';
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSvgRef } from '../hooks';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

// Taken from @mui/x-date-time-pickers
const desktopModeMediaQuery = '@media (pointer: fine)';

export type UseMouseTrackerReturnValue = null | MousePosition;

/**
 * @deprecated We recommend using vanilla JS to let popper track mouse position.
 */
export function useMouseTracker(): UseMouseTrackerReturnValue {
  const svgRef = useSvgRef();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<MousePosition | null>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const controller = new AbortController();

    const handleOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        setMousePosition(null);
      }
    };

    const handleMove = (event: PointerEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
        height: event.height,
        pointerType: event.pointerType as MousePosition['pointerType'],
      });
    };

    element.addEventListener('pointerdown', handleMove, { signal: controller.signal });
    element.addEventListener('pointermove', handleMove, { signal: controller.signal });
    element.addEventListener('pointerup', handleOut, { signal: controller.signal });

    return () => {
      // Calling `.abort()` removes ALL event listeners
      // For more info, see https://kettanaito.com/blog/dont-sleep-on-abort-controller
      controller.abort();
    };
  }, [svgRef]);

  return mousePosition;
}

export function useIsDesktop(): boolean {
  const isDesktop = useMediaQuery(desktopModeMediaQuery, { defaultMatches: true });

  return isDesktop;
}

export type TriggerOptions = 'item' | 'axis' | 'none';

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}
