import * as React from 'react';
import { FilterInputValueProps } from '../components/tools/StringFilterInputValueProps';
import { FilterItem } from './filterItem';
import { CellParams } from './params/cellParams';

export interface FilterOperator {
  label: string;
  value: string;
  getApplyFilterFn: (
    filterItem: FilterItem,
    column: any,
  ) => null | ((params: CellParams) => boolean);
  InputComponent: React.ComponentType<FilterInputValueProps>;
}
