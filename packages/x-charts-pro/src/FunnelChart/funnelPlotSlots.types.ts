import * as React from 'react';
import type { FunnelSectionProps } from './FunnelSection';

export interface FunnelPlotSlots {
  funnelSection?: React.ElementType<FunnelSectionProps>;
}

export interface FunnelPlotSlotProps {
  funnelSection?: FunnelSectionProps;
}

export interface FunnelPlotSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: FunnelPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: FunnelPlotSlotProps;
}
