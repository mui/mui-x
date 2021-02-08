import { FilterInputValue } from '../../components/panel/filterPanel/FilterInputValue';
import { FilterItem } from '../filterItem';
import { FilterOperator } from '../filterOperator';
import { ColDef } from './colDef';

export const getStringOperators: () => FilterOperator[] = () => [
  {
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
