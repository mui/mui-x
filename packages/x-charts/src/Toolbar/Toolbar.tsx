import * as React from 'react';
import { styled } from '@mui/material/styles';

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

export interface ToolbarProps extends React.PropsWithChildren {}

export function Toolbar({ children }: ToolbarProps) {
  return <ToolbarRoot>{children}</ToolbarRoot>;
}
