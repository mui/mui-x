import { FilterInputValue } from '../../components/tools/FilterInputValue';
import { FilterItem } from '../filterItem';
import { FilterOperator } from '../filterOperator';
import { ColDef } from './colDef';

export const NUMERIC_OPERATORS: FilterOperator[] = [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) === Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '!=',
    value: '!=',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) !== Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '>',
    value: '>',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) > Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '>=',
    value: '>=',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) >= Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '<',
    value: '<',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) < Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '<=',
    value: '<=',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Number(rowValue) <= Number(filterItem.value);
      };
    },
    InputComponent: FilterInputValue,
    InputComponentProps: { type: 'number' },
  },
];
