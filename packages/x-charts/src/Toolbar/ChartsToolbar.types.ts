import { ChartsToolbarSlotProps, ChartsToolbarSlots } from '../material';

export interface ChartsToolbarProps {
  className?: string;
  /**
   * The slots used by the ChartsToolbar and descendants.
   */
  slots?: Partial<ChartsToolbarSlots>;
  /**
   * The slot props used by the ChartsToolbar and descendants.
   */
  slotProps?: Partial<ChartsToolbarSlotProps>;
}
