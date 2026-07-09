import type * as React from 'react';
import type { WithDataAttributes } from '@mui/x-internals/types';
import type { ScatterMarkerProps } from './ScatterMarker';
import type { MarkerPropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface ScatterMarkerSlots {
  /**
   * The component that renders the marker for a scatter point.
   * @default ScatterMarker
   */
  marker?: React.JSXElementConstructor<ScatterMarkerProps & MarkerPropsOverrides>;
}

export interface ScatterMarkerSlotProps {
  marker?: WithDataAttributes<Partial<ScatterMarkerProps> & MarkerPropsOverrides>;
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
