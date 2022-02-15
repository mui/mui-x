import * as React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { DemoLink } from './renderLink';

export function renderEmail(params: GridRenderCellParams<any, any, any, any>) {
  const email = params.value as string;

  return <DemoLink href={`mailto:${email}`}>{email}</DemoLink>;
}
