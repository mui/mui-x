'use client';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { getChartPoint } from '@mui/x-charts/internals';
import { type KeyboardKey } from '@mui/x-internal-gestures/core';
import { type ChartPoint, type GestureInstance } from './zoomGestures.types';

export interface UseWheelGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /** Keys that must be held for the wheel to trigger the gesture. */
  requiredKeys?: KeyboardKey[];
  /**
   * Called on each wheel tick inside the drawing area.
   *
   * @param {ChartPoint} point The wheel focal point, in SVG coordinates.
   * @param {WheelEvent} event The `WheelEvent`.
   */
  onWheel: (point: ChartPoint, event: WheelEvent) => void;
}

/**
 * Generic wheel gesture binding.
 *
 * It owns the listener lifecycle, and lets you create your own interactions from the focal point and wheel event it forwards to `onWheel`.
 */
export function useWheelGesture(instance: GestureInstance, options: UseWheelGestureOptions): void {
  const { enabled, requiredKeys, onWheel } = options;
  const { chartsLayerContainerRef } = instance;
  const startedOutsideRef = React.useRef(false);
  const startedOutsideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onWheelRef = React.useRef(onWheel);
  React.useEffect(() => {
    onWheelRef.current = onWheel;
  });

  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    instance.updateZoomInteractionListeners('zoomTurnWheel', { requiredKeys });
  }, [enabled, requiredKeys, instance]);

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;
    if (element === null || !enabled) {
      return () => {};
    }

    const rafThrottledOnWheel = rafThrottle((point: ChartPoint, event: WheelEvent) =>
      onWheelRef.current(point, event),
    );

    const handler = instance.addInteractionListener('zoomTurnWheel', (event) => {
      const point = getChartPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });

      // Ignore wheel events that started outside the chart area (e.g. while page-scrolling
      // over the chart). The timeout debounces re-entry caused by the scroll itself.
      if (startedOutsideRef.current || !instance.isPointInside(point.x, point.y)) {
        startedOutsideRef.current = true;
        if (startedOutsideTimeoutRef.current) {
          clearTimeout(startedOutsideTimeoutRef.current);
        }
        startedOutsideTimeoutRef.current = setTimeout(() => {
          startedOutsideRef.current = false;
          startedOutsideTimeoutRef.current = null;
        }, 100);
        return;
      }

      event.detail.srcEvent.preventDefault();

      rafThrottledOnWheel(point, event.detail.srcEvent as WheelEvent);
    });

    return () => {
      handler.cleanup();
      if (startedOutsideTimeoutRef.current) {
        clearTimeout(startedOutsideTimeoutRef.current);
        startedOutsideTimeoutRef.current = null;
      }
      startedOutsideRef.current = false;
      rafThrottledOnWheel.clear();
    };
  }, [chartsLayerContainerRef, enabled, instance]);
}
