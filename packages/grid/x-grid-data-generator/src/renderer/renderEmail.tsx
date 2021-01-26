import * as React from 'react';
import { CellParams } from '@material-ui/x-grid';
import { DemoLink } from './renderLink';

export function renderEmail(params: CellParams) {
  const email = params.value as string;

  return <DemoLink href={`mailto:${email}`}>{email}</DemoLink>;
}
