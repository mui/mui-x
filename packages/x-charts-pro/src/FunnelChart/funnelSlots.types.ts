import { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import { ChartsTooltipSlotProps, ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import {
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsSlotProps,
  ChartsSlots,
} from '@mui/x-charts/internals';
import { ChartsLegendSlotProps, ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import { ChartsToolbarProps } from '@mui/x-charts/Toolbar';
import { FunnelPlotSlotProps, FunnelPlotSlots } from './funnelPlotSlots.types';

export interface FunnelChartSlots
  extends ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsTooltipSlots,
    ChartsOverlaySlots,
    ChartsAxisSlots,
    Partial<ChartsSlots> {
  /**
   * Custom component for the toolbar.
   * @default ChartsToolbar
   */
  toolbar?: React.ElementType<ChartsToolbarProps>;
}
export interface FunnelChartSlotProps
  extends ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsTooltipSlotProps,
    ChartsOverlaySlotProps,
    ChartsAxisSlotProps,
    Partial<ChartsSlotProps> {
  /**
   * Props for the toolbar component.
   */
  toolbar?: Partial<ChartsToolbarProps>;
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
