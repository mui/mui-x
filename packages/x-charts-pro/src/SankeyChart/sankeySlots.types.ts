import { type ChartsOverlaySlotProps, type ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import { type ChartsTooltipSlotProps, type ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import { type ChartsSlotProps, type ChartsSlots } from '@mui/x-charts/internals';
import { type ChartsToolbarSlotProps, type ChartsToolbarSlots } from '@mui/x-charts/Toolbar';

export interface SankeyChartSlots
  extends
    ChartsTooltipSlots<'item' | 'none'>,
    ChartsOverlaySlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface SankeyChartSlotProps
  extends
    ChartsTooltipSlotProps<'item' | 'none'>,
    ChartsOverlaySlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

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
