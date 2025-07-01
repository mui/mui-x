'use client';
import * as React from 'react';
import { PointerGestureEventData } from '@mui/x-internal-gestures/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useChartContext } from '../context/ChartProvider';
import { useSvgRef } from '../hooks';

type MousePosition = {
  x: number;
  y: number;
  pointerType: 'mouse' | 'touch' | 'pen';
  height: number;
};

export type UseMouseTrackerReturnValue = null | MousePosition;

/**
 * @deprecated We recommend using vanilla JS to let popper track mouse position.
 */
export function useMouseTracker(): UseMouseTrackerReturnValue {
  const { instance } = useChartContext();

  // Use a ref to avoid rerendering on every mousemove event.
  const [mousePosition, setMousePosition] = React.useState<MousePosition | null>(null);

  React.useEffect(() => {
    const moveEndHandler = instance.addInteractionListener('moveEnd', (event) => {
      if (!event.detail.activeGestures.pan) {
        setMousePosition(null);
      }
    });

    const gestureHandler = (event: CustomEvent<PointerGestureEventData>) => {
      setMousePosition({
        x: event.detail.centroid.x,
        y: event.detail.centroid.y,
        height: event.detail.srcEvent.height,
        pointerType: event.detail.srcEvent.pointerType as MousePosition['pointerType'],
      });
    };

    const moveHandler = instance.addInteractionListener('move', gestureHandler);
    const panHandler = instance.addInteractionListener('pan', gestureHandler);

    return () => {
      moveHandler.cleanup();
      panHandler.cleanup();
      moveEndHandler.cleanup();
    };
  }, [instance]);

  return mousePosition;
}

type PointerType = Pick<MousePosition, 'pointerType'>;

export function usePointerType(): null | PointerType {
  const svgRef = useSvgRef();

  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleOut = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        setPointerType(null);
      }
    };

    const handleEnter = (event: PointerEvent) => {
      setPointerType({
        pointerType: event.pointerType as PointerType['pointerType'],
      });
    };

    element.addEventListener('pointerenter', handleEnter);
    element.addEventListener('pointerup', handleOut);

    return () => {
      element.removeEventListener('pointerenter', handleEnter);
      element.removeEventListener('pointerup', handleOut);
    };
  }, [svgRef]);

  return pointerType;
}

export type TriggerOptions = 'item' | 'axis' | 'none';

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}

// Taken from @mui/x-date-time-pickers
const mainPointerFineMediaQuery = '@media (pointer: fine)';

/**
 * Returns true if the main pointer is fine (e.g. mouse).
 * This is useful for determining how to position tooltips or other UI elements based on the type of input device.
 * @returns true if the main pointer is fine, false otherwise.
 */
export const useIsFineMainPointer = (): boolean => {
  return useMediaQuery(mainPointerFineMediaQuery, { defaultMatches: true });
};
