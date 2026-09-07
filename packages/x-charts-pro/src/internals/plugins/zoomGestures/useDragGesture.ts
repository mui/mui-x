'use client';
import * as React from 'react';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import type { PanEvent } from '@mui/x-internal-gestures/core';
import type { ChartPoint, GestureInstance, PanGestureConfig } from './zoomGestures.types';

export interface UseDragGestureOptions {
  /** Whether the gesture is active. */
  enabled: boolean;
  /** Pointer and keyboard gating for the gesture. */
  config?: PanGestureConfig;
  /**
   * Called when the drag starts.
   * @param {PanEvent} event The pan start event.
   */
  onPanStart?: (event: PanEvent) => void;
  /**
   * Called (rAF-throttled) on each drag update.
   * @param {ChartPoint} delta The pixel delta since the last call.
   * @param {PanEvent} event The pan event.
   */
  onPan: (delta: ChartPoint, event: PanEvent) => void;
  /**
   * Called when the drag ends.
   * @param {PanEvent} event The pan end event.
   */
  onPanEnd?: (event: PanEvent) => void;
}

/**
 * Generic drag-to-pan gesture binding.
 *
 * It owns the listener lifecycle, and lets you create your own interactions by providing the delta change of the interaction.
 */
export function useDragGesture(instance: GestureInstance, options: UseDragGestureOptions): void {
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
    instance.updateZoomInteractionListeners('zoomPan', {
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
      if (!(event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        isInteracting = true;
        handlersRef.current.onPanStart?.(event);
      }
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

    const panHandler = instance.addInteractionListener('zoomPan', handlePan);
    const panStartHandler = instance.addInteractionListener('zoomPanStart', handlePanStart);
    const panEndHandler = instance.addInteractionListener('zoomPanEnd', handlePanEnd);

    return () => {
      panHandler.cleanup();
      panStartHandler.cleanup();
      panEndHandler.cleanup();
      throttled.clear();
    };
  }, [instance, chartsLayerContainerRef, enabled]);
}
