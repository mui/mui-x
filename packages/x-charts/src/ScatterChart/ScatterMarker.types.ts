import * as React from 'react';
import type { ScatterMarkerProps } from './ScatterMarker';

export interface ScatterMarkerSlots {
  /**
   * The component that renders the marker for a scatter point.
   * @default ScatterMarker
   */
  marker?: React.JSXElementConstructor<ScatterMarkerProps>;
}

export interface ScatterMarkerSlotProps {
  marker?: ScatterMarkerProps;
}

export interface ScatterMarkerSlotExtension {
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ScatterMarkerSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ScatterMarkerSlots;
}
