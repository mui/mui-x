import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';

export interface GridColumnMenuItemProps {
  // Native Props
  colDef: GridColDef;
  onClick: (event: React.MouseEvent<any>) => void;
  // User Props
  [key: string]: any;
}
