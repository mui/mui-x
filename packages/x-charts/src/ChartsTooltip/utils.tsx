'use client';
import * as React from 'react';
import { PointerGestureEventData } from '@web-gestures/core';
import { useChartContext } from '../context/ChartProvider';

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

type PointerType = Pick<MousePosition, 'height' | 'pointerType'>;

export function usePointerType(): null | PointerType {
  const { instance } = useChartContext();

  const [pointerType, setPointerType] = React.useState<null | PointerType>(null);

  React.useEffect(() => {
    const moveEndHandler = instance.addInteractionListener('moveEnd', (event) => {
      if (event.detail.srcEvent.pointerType !== 'mouse' && !event.detail.activeGestures.pan) {
        setPointerType(null);
      }
    });
    const panEndHandler = instance.addInteractionListener('panEnd', (event) => {
      if (event.detail.srcEvent.pointerType !== 'mouse') {
        setPointerType(null);
      }
    });
    const quickPressEndHandler = instance.addInteractionListener('quickPressEnd', (event) => {
      if (event.detail.srcEvent.pointerType !== 'mouse' && !event.detail.activeGestures.pan) {
        setPointerType(null);
      }
    });

    const gestureHandler = (event: CustomEvent<PointerGestureEventData>) => {
      setPointerType({
        height: Math.max(event.detail.srcEvent.height, 24),
        pointerType: event.detail.srcEvent.pointerType as PointerType['pointerType'],
      });
    };
    const moveStartHandler = instance.addInteractionListener('moveStart', gestureHandler);
    const panStartHandler = instance.addInteractionListener('panStart', gestureHandler);
    const pressHandler = instance.addInteractionListener('quickPress', gestureHandler);

    return () => {
      moveEndHandler.cleanup();
      panEndHandler.cleanup();
      moveStartHandler.cleanup();
      panStartHandler.cleanup();
      pressHandler.cleanup();
      quickPressEndHandler.cleanup();
    };
  }, [instance]);

  return pointerType;
}

export type TriggerOptions = 'item' | 'axis' | 'none';

export function utcFormatter(v: string | number | Date): string {
  if (v instanceof Date) {
    return v.toUTCString();
  }
  return v.toLocaleString();
}
