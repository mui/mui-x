import { FilterInputValue } from '../../components/panel/filterPanel/FilterInputValue';
import { FilterItem } from '../filterItem';
import { FilterOperator } from '../filterOperator';
import { ColDef } from './colDef';

export const STRING_OPERATORS: FilterOperator[] = [
  {
    label: 'contains',
    value: 'contains',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(filterItem.value, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: FilterInputValue,
  },
  {
    label: 'equals',
    value: 'equals',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return (
          filterItem.value?.localeCompare(rowValue?.toString() || '', undefined, {
            sensitivity: 'base',
          }) === 0
        );
      };
    },
    InputComponent: FilterInputValue,
  },
  {
    label: 'starts with',
    value: 'startsWith',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`^${filterItem.value}.*$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: FilterInputValue,
  },
  {
    label: 'ends with',
    value: 'endsWith',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`.*${filterItem.value}$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: FilterInputValue,
  },
];
