import * as React from 'react';
import { FilterInputValueProps } from '../components/panel/filterPanel/FilterInputValueProps';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';

export interface GridFilterOperator {
  label?: string;
  value: string;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: any,
  ) => null | ((params: GridCellParams) => boolean);
  InputComponent: React.ComponentType<FilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
