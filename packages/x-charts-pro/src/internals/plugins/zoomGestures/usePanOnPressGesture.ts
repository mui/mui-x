'use client';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type PanEvent } from '@mui/x-internal-gestures/core';
import { type ChartPoint, type GestureInstance, type PanGestureConfig } from './zoomGestures.types';

export interface UsePanOnPressGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /** Pointer/keyboard gating forwarded to the interaction listener. */
  config?: PanGestureConfig;
  /**
   * Called once when a pan starts.
   * @param {PanEvent} event The original pan start event.
   */
  onPanStart?: (event: PanEvent) => void;
  /**
   * Throttled call of the pan event
   * @param {ChartPoint} delta The accumulated pixel delta since the last call.
   * @param {PanEvent} event The original pan event.
   */
  onPan: (delta: ChartPoint, event: PanEvent) => void;
  /**
   * Called once when a pan ends.
   * @param {PanEvent} event The original pan end event.
   */
  onPanEnd?: (event: PanEvent) => void;
}

/**
 * Generic drag-to-pan gesture binding, decoupled from any coordinate system.
 *
 * It owns the listener lifecycle, the per-frame accumulation of the pixel delta, and
 * the rAF throttling. What to do with the delta is entirely up to `onPan` — cartesian
 * zoom translates an axis range, a map translates the projection, etc.
 */
export function usePanOnPressGesture(
  instance: GestureInstance,
  options: UsePanOnPressGestureOptions,
): void {
  const { enabled, config, onPanStart, onPan, onPanEnd } = options;
  const { chartsLayerContainerRef } = instance;

  // Keep the latest handlers in a ref so changing them doesn't rebind listeners.
  const handlersRef = React.useRef({ onPanStart, onPan, onPanEnd });
  React.useEffect(() => {
    handlersRef.current = { onPanStart, onPan, onPanEnd };
  });

  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    instance.updateZoomInteractionListeners('zoomPressAndDrag', {
      requiredKeys: config?.requiredKeys,
      pointerMode: config?.pointerMode,
      pointerOptions: {
        mouse: config?.mouse,
        touch: config?.touch,
      },
    });
  }, [enabled, config, instance]);

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;
    if (element === null || !enabled) {
      return () => {};
    }

    let isInteracting = false;
    let lastEvent: PanEvent | null = null;
    const accumulated = { x: 0, y: 0 };

    const handlePanStart = (event: PanEvent) => {
      isInteracting = true;
      handlersRef.current.onPanStart?.(event);
    };
    const handlePanEnd = (event: PanEvent) => {
      isInteracting = false;
      handlersRef.current.onPanEnd?.(event);
    };

    const throttled = rafThrottle(() => {
      const delta = { x: accumulated.x, y: accumulated.y };
      accumulated.x = 0;
      accumulated.y = 0;
      if (lastEvent) {
        handlersRef.current.onPan(delta, lastEvent);
      }
    });

    const handlePan = (event: PanEvent) => {
      if (!isInteracting) {
        return;
      }
      lastEvent = event;
      accumulated.x += event.detail.deltaX;
      accumulated.y += event.detail.deltaY;
      throttled();
    };

    const panHandler = instance.addInteractionListener('zoomPressAndDrag', handlePan);
    const panStartHandler = instance.addInteractionListener(
      'zoomPressAndDragStart',
      handlePanStart,
    );
    const panEndHandler = instance.addInteractionListener('zoomPressAndDragEnd', handlePanEnd);

    return () => {
      panHandler.cleanup();
      panStartHandler.cleanup();
      panEndHandler.cleanup();
      throttled.clear();
    };
  }, [instance, chartsLayerContainerRef, enabled]);
}
