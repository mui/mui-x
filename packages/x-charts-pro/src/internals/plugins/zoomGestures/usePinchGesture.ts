'use client';
import * as React from 'react';
import { getChartPoint } from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type KeyboardKey } from '@mui/x-internal-gestures/core';
import { type ChartPoint, type GestureInstance } from './zoomGestures.types';

export interface UsePinchGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /** Keys that must be held for the pinch to trigger the gesture. */
  requiredKeys?: KeyboardKey[];
  /**
   * Called (rAF-throttled) on each pinch update.
   *
   * @param {ChartPoint} point The pinch centroid, in SVG coordinates.
   * @param {number} deltaScale The incremental scale change for this update.
   * @param {number} direction `> 0` when zooming in, `< 0` when zooming out.
   */
  onPinch: (point: ChartPoint, deltaScale: number, direction: number) => void;
}

/**
 * Generic pinch gesture binding. Forwards the centroid and scale delta to `onPinch`.
 */
export function usePinchGesture(instance: GestureInstance, options: UsePinchGestureOptions): void {
  const { enabled, requiredKeys, onPinch } = options;
  const { chartsLayerContainerRef } = instance;
  const onPinchRef = React.useRef(onPinch);
  React.useEffect(() => {
    onPinchRef.current = onPinch;
  });

  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    instance.updateZoomInteractionListeners('zoomPinch', { requiredKeys });
  }, [enabled, requiredKeys, instance]);

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;
    if (element === null || !enabled) {
      return () => { };
    }

    const latest = { point: { x: 0, y: 0 }, deltaScale: 0, direction: 0, valid: false };
    const flush = rafThrottle(() => {
      if (latest.valid) {
        onPinchRef.current(latest.point, latest.deltaScale, latest.direction);
        latest.valid = false;
      }
    });

    const handler = instance.addInteractionListener('zoomPinch', (event) => {
      // A direction of 0 means the pinch gesture is not yet meaningful.
      if (event.detail.direction === 0) {
        return;
      }
      latest.point = getChartPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });
      latest.deltaScale = event.detail.deltaScale;
      latest.direction = event.detail.direction;
      latest.valid = true;
      flush();
    });

    return () => {
      handler.cleanup();
      flush.clear();
    };
  }, [chartsLayerContainerRef, enabled, instance]);
}
