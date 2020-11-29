import * as React from 'react';
import { ColDef } from '../../../models/colDef/colDef';

export interface FilterItemProps {
  column: ColDef;
  onClick: (event: React.MouseEvent<any>) => void;
}
