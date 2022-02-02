import * as React from 'react';
import { GridCellParams } from '@mui/x-data-grid-pro';
import { DemoLink } from './renderLink';

export function renderEmail(params: GridCellParams<string, any, any, any>) {
  const email = params.value as string;

  return <DemoLink href={`mailto:${email}`}>{email}</DemoLink>;
}
