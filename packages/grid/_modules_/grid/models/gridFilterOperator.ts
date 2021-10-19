import * as React from 'react';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';
import type { GridStateColDef } from './colDef';

export interface GridFilterOperator {
  label?: string;
  value: string;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: GridStateColDef,
  ) => null | ((params: GridCellParams) => boolean);
  InputComponent?: React.JSXElementConstructor<GridFilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
