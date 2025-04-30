import * as React from 'react';
import { ChartsSlotProps, ChartsSlots } from '../material';

export type ChartsToolbarSlots = Partial<ChartsSlots>;

export type ChartsToolbarSlotProps = Partial<ChartsSlotProps>;

export interface ToolbarProps extends React.PropsWithChildren {
  /**
   * The slots used by the ChartsToolbar and descendants.
   */
  slots?: ChartsToolbarSlots;
  /**
   * The slot props used by the ChartsToolbar and descendants.
   */
  slotProps?: ChartsToolbarSlotProps;
}
