'use client';
import * as React from 'react';
import type { GestureInstance } from './zoomGestures.types';

export interface UseKeyboardGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /**
   * Called for each key pressed while the focus is inside the chart.
   *
   * @param {KeyboardEvent} event The `KeyboardEvent`.
   */
  onKeyDown: (event: KeyboardEvent) => void;
}

/**
 * Generic keyboard gesture binding.
 *
 * The listener sits on the chart layer container, so it only runs while the focus is inside the
 * chart. It never captures keys from the rest of the page.
 */
export function useKeyboardGesture(
  instance: GestureInstance,
  options: UseKeyboardGestureOptions,
): void {
  const { enabled, onKeyDown } = options;
  const { chartsLayerContainerRef } = instance;
  const onKeyDownRef = React.useRef(onKeyDown);
  React.useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  });

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;
    if (element === null || !enabled) {
      return () => {};
    }

    const handler = (event: KeyboardEvent) => onKeyDownRef.current(event);

    element.addEventListener('keydown', handler);

    return () => {
      element.removeEventListener('keydown', handler);
    };
  }, [chartsLayerContainerRef, enabled]);
}
