import { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import { ChartsTooltipSlotProps, ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '@mui/x-charts/internals';
import { ChartsLegendSlotProps, ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import { FunnelPlotSlotProps, FunnelPlotSlots } from './funnelPlotSlots.types';

export interface FunnelChartSlots
  extends ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsTooltipSlots,
    ChartsOverlaySlots,
    ChartsAxisSlots {}
export interface FunnelChartSlotProps
  extends ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsTooltipSlotProps,
    ChartsOverlaySlotProps,
    ChartsAxisSlotProps {}

export interface FunnelChartSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: FunnelChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: FunnelChartSlotProps;
}
