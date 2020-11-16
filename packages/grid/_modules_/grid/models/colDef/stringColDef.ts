import * as React from 'react';
import { FilterInputValueProps, StringFilterInputValue } from '../../components/tools/StringFilterInputValue';
import { FilterItem } from '../../hooks/features/filter/visibleRowsState';
import { stringNumberComparer } from '../../utils/sortingUtils';
import { CellParams } from '../params/cellParams';
import { ColDef, ColTypeDef } from './colDef';

export interface FilterOperator {
  label: string;
  value: string | number;
  getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => (null | ((params: CellParams) => boolean));
  InputComponent: React.ComponentType<FilterInputValueProps>
}

export const STRING_OPERATORS: FilterOperator [] = [
  {
    label: 'Contains',
    value: 'contains',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(filterItem.value, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      }
    },
    InputComponent: StringFilterInputValue
  },
  {
    label: 'Equals',
    value: 'equals',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterItem.value?.localeCompare(rowValue?.toString() || '', undefined, { sensitivity: 'base' }) === 0;
      }
    },
    InputComponent: StringFilterInputValue
  },
  {
    label: 'Starts With',
    value: 'start',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(`^${filterItem.value}.*$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      }
    },
    InputComponent: StringFilterInputValue
  },
  {
    label: 'Ends With',
    value: 'end',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(`.*${filterItem.value}$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      }
    },
    InputComponent: StringFilterInputValue
  }
];
export const STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  resizable: true,
  filterable: true,
  sortDirection: null,
  sortComparator: stringNumberComparer,
  type: 'string',
  align: 'left',
  filterOperators: STRING_OPERATORS
};
