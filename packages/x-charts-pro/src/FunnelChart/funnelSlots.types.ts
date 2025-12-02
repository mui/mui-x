import { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import {
  ChartsTooltipProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';
import {
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsSlotProps,
  ChartsSlots,
} from '@mui/x-charts/internals';
import { ChartsLegendSlotProps, ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '@mui/x-charts/Toolbar';
import { FunnelPlotSlotProps, FunnelPlotSlots } from './funnelPlotSlots.types';

export interface FunnelChartSlots
  extends ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsTooltipSlots,
    ChartsOverlaySlots,
    ChartsAxisSlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface FunnelChartSlotProps
  extends ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    Omit<ChartsTooltipSlotProps, 'tooltip'>,
    ChartsOverlaySlotProps,
    ChartsAxisSlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {
  /**
   * Slot props for the tooltip component.
   * @default {}
   */
  tooltip?: Partial<ChartsTooltipProps<'item' | 'none'>>;
}

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
