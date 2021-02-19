import * as React from 'react';
import { GridCellParams } from '@material-ui/x-grid';
import { DemoLink } from './renderLink';

export function renderEmail(params: GridCellParams) {
  const email = params.value as string;

  return <DemoLink href={`mailto:${email}`}>{email}</DemoLink>;
}
