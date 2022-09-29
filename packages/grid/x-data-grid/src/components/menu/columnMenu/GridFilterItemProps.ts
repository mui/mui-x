import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';

export interface GridFilterItemProps {
  column: GridColDef;
  onClick: (event: React.MouseEvent<any>) => void;
}
