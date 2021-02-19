import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { GridColDef } from './gridColDef';

export const getGridNumericColumnOperators: () => GridFilterOperator[] = () => [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) === Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '!=',
    value: '!=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) !== Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '>',
    value: '>',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) > Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '>=',
    value: '>=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) >= Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '<',
    value: '<',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) < Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '<=',
    value: '<=',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) <= Number(filterItem.value);
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
];
