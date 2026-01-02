import * as React from 'react';
import MuiTooltip from '@mui/material/Tooltip';

export type TooltipProps = {
  children: React.ReactElement<unknown>;
  message: string;
};

export function Tooltip({ children, message }: TooltipProps) {
  return <MuiTooltip title={message}>{children}</MuiTooltip>;
}
