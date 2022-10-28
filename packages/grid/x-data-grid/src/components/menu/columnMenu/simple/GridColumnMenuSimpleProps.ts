import * as React from 'react';
import { GridColDef } from '../../../../models/colDef/gridColDef';

export interface GridColumnMenuSimpleProps extends React.HTMLAttributes<HTMLUListElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  currentColumn: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
}
