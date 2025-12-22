import { type ChartsOverlaySlotProps, type ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import {
  type ChartsTooltipProps,
  type ChartsTooltipSlotProps,
  type ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';
import { type ChartsSlotProps, type ChartsSlots } from '@mui/x-charts/internals';
import { type ChartsToolbarSlotProps, type ChartsToolbarSlots } from '@mui/x-charts/Toolbar';

export interface SankeyChartSlots
  extends ChartsTooltipSlots, ChartsOverlaySlots, ChartsToolbarSlots, Partial<ChartsSlots> {}
export interface SankeyChartSlotProps
  extends
    Omit<ChartsTooltipSlotProps, 'tooltip'>,
    ChartsOverlaySlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {
  /**
   * Slot props for the tooltip component.
   * @default {}
   */
  tooltip?: Partial<ChartsTooltipProps<'item' | 'none'>>;
}

export interface SankeyChartSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SankeyChartSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SankeyChartSlotProps;
}
