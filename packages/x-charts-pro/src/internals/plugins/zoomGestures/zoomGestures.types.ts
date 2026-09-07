import type * as React from 'react';
import type { KeyboardKey, PointerMode } from '@mui/x-internal-gestures/core';
import type { UseChartInteractionListenerInstance } from '@mui/x-charts/internals';

/**
 * The minimal slice of a chart instance required to bind zoom/pan gestures.
 */
export interface GestureInstance {
  chartsLayerContainerRef: React.RefObject<HTMLDivElement | null>;
  addInteractionListener: UseChartInteractionListenerInstance['addInteractionListener'];
  updateZoomInteractionListeners: UseChartInteractionListenerInstance['updateZoomInteractionListeners'];
  isPointInside: (x: number, y: number, targetElement?: Element | EventTarget | null) => boolean;
}

/**
 * Pointer and keyboard gating for a pan gesture.
 */
export interface PanGestureConfig {
  requiredKeys?: KeyboardKey[];
  pointerMode?: PointerMode[];
  mouse?: { requiredKeys?: KeyboardKey[] };
  touch?: { requiredKeys?: KeyboardKey[] };
}

export interface ChartPoint {
  x: number;
  y: number;
}
