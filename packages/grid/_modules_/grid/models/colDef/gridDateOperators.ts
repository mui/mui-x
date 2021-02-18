import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { GridColDef } from './gridColDef';

export const getGridDateOperators: (showTime?: boolean) => GridFilterOperator[] = (showTime) => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() === time;
        }
        return new Date(rowValue.toString()).getTime() === time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() !== time;
        }
        return new Date(rowValue.toString()).getTime() !== time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'after',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() > time;
        }
        return new Date(rowValue.toString()).getTime() > time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrAfter',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() >= time;
        }
        return new Date(rowValue.toString()).getTime() >= time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'before',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() < time;
        }
        return new Date(rowValue.toString()).getTime() < time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrBefore',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        if (!rowValue) {
          return false;
        }
        if (rowValue instanceof Date) {
          return (rowValue as Date).getTime() <= time;
        }
        return new Date(rowValue.toString()).getTime() <= time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
];
