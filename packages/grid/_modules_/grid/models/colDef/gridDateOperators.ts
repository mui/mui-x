import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridDateOperators: (showTime?: boolean) => GridFilterOperator[] = (showTime) => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() === time;
        }
        return new Date(value.toString()).getTime() === time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() !== time;
        }
        return new Date(value.toString()).getTime() !== time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'after',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() > time;
        }
        return new Date(value.toString()).getTime() > time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrAfter',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() >= time;
        }
        return new Date(value.toString()).getTime() >= time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'before',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() < time;
        }
        return new Date(value.toString()).getTime() < time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrBefore',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const time = new Date(filterItem.value).getTime();
      return ({ value }): boolean => {
        if (!value) {
          return false;
        }
        if (value instanceof Date) {
          return (value as Date).getTime() <= time;
        }
        return new Date(value.toString()).getTime() <= time;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
];
