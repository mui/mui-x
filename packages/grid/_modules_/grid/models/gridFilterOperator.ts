import * as React from 'react';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';

export interface GridFilterOperator {
  label?: string;
  value: string;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: any,
  ) => null | ((params: GridCellParams) => boolean);
  InputComponent: React.ComponentType<GridFilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
