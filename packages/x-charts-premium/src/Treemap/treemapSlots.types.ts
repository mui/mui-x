import type { ChartsOverlaySlotProps, ChartsOverlaySlots } from '@mui/x-charts/ChartsOverlay';
import type { ChartsTooltipSlotProps, ChartsTooltipSlots } from '@mui/x-charts/ChartsTooltip';
import type { ChartsSlotProps, ChartsSlots } from '@mui/x-charts/internals';
import type { ChartsToolbarSlotProps, ChartsToolbarSlots } from '@mui/x-charts/Toolbar';

export interface TreemapSlots
  extends
    ChartsTooltipSlots<'item' | 'none'>,
    ChartsOverlaySlots,
    ChartsToolbarSlots,
    Partial<ChartsSlots> {}
export interface TreemapSlotProps
  extends
    ChartsTooltipSlotProps<'item' | 'none'>,
    ChartsOverlaySlotProps,
    ChartsToolbarSlotProps,
    Partial<ChartsSlotProps> {}

export interface TreemapSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreemapSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreemapSlotProps;
}
