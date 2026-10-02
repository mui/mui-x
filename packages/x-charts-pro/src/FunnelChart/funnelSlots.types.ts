import type { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import type { ChartsTooltipSlotProps, ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import type {
  ChartsAxisSlotProps,
  ChartsAxisSlots,
  ChartsSlotProps,
  ChartsSlots,
} from '@mui/x-charts/internals';
import type { ChartsLegendSlotProps, ChartsLegendSlots } from '@mui/x-charts/ChartsLegend';
import type { ChartsToolbarSlotProps, ChartsToolbarSlots } from '@mui/x-charts/Toolbar';
import type { FunnelPlotSlotProps, FunnelPlotSlots } from './funnelPlotSlots.types';

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
