import type * as React from 'react';
import type { FunnelSectionProps } from './FunnelSection';
import { type FunnelSectionLabelProps } from './FunnelSectionLabel';
import type {
  FunnelSectionPropsOverrides,
  FunnelSectionLabelPropsOverrides,
} from '../models/chartsSlotsComponentsPropsPro';

export interface FunnelPlotSlots {
  /**
   * Custom component for funnel section.
   * @default FunnelSection
   */
  funnelSection?: React.ElementType<FunnelSectionProps & FunnelSectionPropsOverrides>;
  /**
   * Custom component for funnel section label.
   * @default FunnelSectionLabel
   */
  funnelSectionLabel?: React.ElementType<
    FunnelSectionLabelProps & FunnelSectionLabelPropsOverrides
  >;
}

export interface FunnelPlotSlotProps {
  funnelSection?: Partial<FunnelSectionProps> & FunnelSectionPropsOverrides;
  funnelSectionLabel?: Partial<FunnelSectionLabelProps> & FunnelSectionLabelPropsOverrides;
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
