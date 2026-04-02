import * as React from 'react';
import { DialogProps } from '@mui/material/Dialog';

export interface ScopePopoverProps extends Omit<DialogProps, 'open'> {
  container?: HTMLElement | null;
}
