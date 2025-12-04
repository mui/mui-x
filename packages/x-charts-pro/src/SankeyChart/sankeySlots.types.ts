import { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import {
  ChartsTooltipProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsSlotProps, ChartsSlots } from '@mui/x-charts/internals';
import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '@mui/x-charts/Toolbar';

export interface SankeyChartSlots
  extends ChartsTooltipSlots,
    ChartsOverlaySlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface SankeyChartSlotProps
  extends Omit<ChartsTooltipSlotProps, 'tooltip'>,
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
