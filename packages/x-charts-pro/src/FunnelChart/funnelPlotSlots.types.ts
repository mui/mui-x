import type * as React from 'react';
import type { FunnelSectionProps } from './FunnelSection';
import { type FunnelSectionLabelProps } from './FunnelSectionLabel';

export interface FunnelPlotSlots {
  /**
   * Custom component for funnel section.
   * @default FunnelSection
   */
  funnelSection?: React.ElementType<FunnelSectionProps>;
  /**
   * Custom component for funnel section label.
   * @default FunnelSectionLabel
   */
  funnelSectionLabel?: React.ElementType<FunnelSectionLabelProps>;
}

export interface FunnelPlotSlotProps {
  funnelSection?: FunnelSectionProps;
  funnelSectionLabel?: FunnelSectionLabelProps;
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
