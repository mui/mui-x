import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ChartsToolbarSlotsProvider } from './ChartsToolbarSlotsContext';
import { ChartsSlotProps, ChartsSlots } from '../material';

const ToolbarRoot = styled('div', {
  name: 'MuiChartsToolbar',
  slot: 'Root',
})(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  minHeight: 44,
  boxSizing: 'border-box',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 4,
}));

export interface ToolbarProps extends React.PropsWithChildren {
  /**
   * The slots used by the ChartsToolbar and descendants.
   */
  slots?: ChartsSlots;
  /**
   * The slot props used by the ChartsToolbar and descendants.
   */
  slotProps?: ChartsSlotProps;
}

export function Toolbar({ slots, slotProps, children }: ToolbarProps) {
  return (
    <ChartsToolbarSlotsProvider slots={slots} slotProps={slotProps}>
      <ToolbarRoot>{children}</ToolbarRoot>
    </ChartsToolbarSlotsProvider>
  );
}
