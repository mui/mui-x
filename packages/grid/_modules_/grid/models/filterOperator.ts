import * as React from 'react';
import { FilterInputValueProps } from '../components/panel/filterPanel/FilterInputValueProps';
import { FilterItem } from './filterItem';
import { CellParams } from './params/cellParams';

export interface FilterOperator {
  value: string;
  getApplyFilterFn: (
    filterItem: FilterItem,
    column: any,
  ) => null | ((params: CellParams) => boolean);
  InputComponent: React.ComponentType<FilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
