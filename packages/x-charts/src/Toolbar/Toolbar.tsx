import * as React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { chartsToolbarClasses } from './chartToolbarClasses';

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

export interface ChartsToolbarProps extends React.PropsWithChildren {
  className?: string;
}

export function Toolbar({ className, ...other }: ChartsToolbarProps) {
  return <ToolbarRoot className={clsx(chartsToolbarClasses.root, className)} {...other} />;
}
