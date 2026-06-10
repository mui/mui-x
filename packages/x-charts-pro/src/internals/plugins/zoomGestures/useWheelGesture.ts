'use client';
import * as React from 'react';
import { getChartPoint } from '@mui/x-charts/internals';
import { type KeyboardKey } from '@mui/x-internal-gestures/core';
import { type ChartPoint, type GestureInstance } from './zoomGestures.types';

export interface UseWheelGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /** Keys that must be held for the wheel to trigger the gesture. */
  requiredKeys?: KeyboardKey[];
  /**
   * Called on each wheel tick that lands inside the drawing area.
   *
   * @param {ChartPoint} point The wheel focal point, in SVG coordinates.
   * @param {WheelEvent} event The raw `WheelEvent`.
   */
  onWheel: (point: ChartPoint, event: WheelEvent) => void;
}

/**
 * Generic wheel gesture binding. Handles the "started outside the chart" guard and
 * `preventDefault`, then forwards the focal point and wheel delta to `onWheel`.
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

      onWheelRef.current(point, event.detail.srcEvent as WheelEvent);
    });

    return () => {
      handler.cleanup();
      if (startedOutsideTimeoutRef.current) {
        clearTimeout(startedOutsideTimeoutRef.current);
        startedOutsideTimeoutRef.current = null;
      }
      startedOutsideRef.current = false;
    };
  }, [chartsLayerContainerRef, enabled, instance]);
}
