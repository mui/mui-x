import type * as React from 'react';
import type { KeyboardKey, PointerMode } from '@mui/x-internal-gestures/core';
import type { UseChartInteractionListenerInstance } from '@mui/x-charts/internals';

/**
 * The minimal slice of a chart instance required to bind zoom/pan gestures.
 *
 * Every method here is provided by core plugins (`useChartInteractionListener`,
 * `useChartDimensions`, `useChartElementRef`), so any chart — cartesian or not —
 * can consume these gesture hooks.
 */
export interface GestureInstance {
  chartsLayerContainerRef: React.RefObject<HTMLDivElement | null>;
  addInteractionListener: UseChartInteractionListenerInstance['addInteractionListener'];
  updateZoomInteractionListeners: UseChartInteractionListenerInstance['updateZoomInteractionListeners'];
  isPointInside: (x: number, y: number, targetElement?: Element | EventTarget | null) => boolean;
}

/**
 * Pointer/keyboard gating for a pan gesture, mirroring the options accepted by
 * `instance.updateZoomInteractionListeners('zoomPan', …)`.
 */
export interface GestureConfig {
  requiredKeys?: KeyboardKey[];
  pointerMode?: PointerMode[];
  mouse?: { requiredKeys?: KeyboardKey[] };
  touch?: { requiredKeys?: KeyboardKey[] };
}

export interface ChartPoint {
  x: number;
  y: number;
}
