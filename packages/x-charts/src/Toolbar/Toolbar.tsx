import * as React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { chartsToolbarClasses } from './chartToolbarClasses';
import { ChartsToolbarProps } from './ChartsToolbar.types';
import { ChartsToolbarSlotsProvider } from './ChartsToolbarSlotsContext';

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

export function Toolbar({
  className,
  slots,
  slotProps,
  ...other
}: React.PropsWithChildren<ChartsToolbarProps>) {
  return (
    <ChartsToolbarSlotsProvider slots={slots} slotProps={slotProps}>
      <ToolbarRoot className={clsx(chartsToolbarClasses.root, className)} {...other} />
    </ChartsToolbarSlotsProvider>
  );
}
