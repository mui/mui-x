import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { GridColDef } from './gridColDef';

export const getGridStringOperators: () => GridFilterOperator[] = () => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(filterItem.value, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'equals',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
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
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`^${filterItem.value}.*$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'endsWith',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`.*${filterItem.value}$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
];
