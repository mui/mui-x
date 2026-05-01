import { type ChartsOverlaySlotProps, type ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import { type ChartsTooltipSlotProps, type ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import {
  type ChartsAxisSlotProps,
  type ChartsAxisSlots,
  type ChartsSlotProps,
  type ChartsSlots,
} from '@mui/x-charts/internals';
import { type ChartsLegendSlotProps, type ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import { type ChartsToolbarSlotProps, type ChartsToolbarSlots } from '@mui/x-charts/Toolbar';
import { type FunnelPlotSlotProps, type FunnelPlotSlots } from './funnelPlotSlots.types';

export interface FunnelChartSlots
  extends
    ChartsAxisSlots,
    FunnelPlotSlots,
    ChartsLegendSlots,
    ChartsOverlaySlots,
    ChartsAxisSlots,
    ChartsToolbarSlots,
    ChartsTooltipSlots<'item' | 'none'>,
    Partial<ChartsSlots> {}
export interface FunnelChartSlotProps
  extends
    ChartsAxisSlotProps,
    FunnelPlotSlotProps,
    ChartsLegendSlotProps,
    ChartsOverlaySlotProps,
    ChartsAxisSlotProps,
    ChartsToolbarSlotProps,
    ChartsTooltipSlotProps<'item' | 'none'>,
    Partial<ChartsSlotProps> {}

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
