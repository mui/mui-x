import { FilterInputValue } from '../../components/tools/FilterInputValue';
import { FilterItem } from '../filterItem';
import { FilterOperator } from '../filterOperator';
import { ColDef } from './colDef';

export const getDateOperators: (showTime?: boolean) => FilterOperator[] = (showTime) => [
  {
    label: 'is',
    value: 'is',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    label: 'is not',
    value: 'not',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    label: 'is after',
    value: 'after',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    label: 'is on or after',
    value: 'onOrAfter',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    label: 'is before',
    value: 'before',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    label: 'is on or before',
    value: 'onOrBefore',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
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
    InputComponent: FilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
];
