import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

const dateRegex = /(\d+)-(\d+)-(\d+)/;
const dateTimeRegex = /(\d+)-(\d+)-(\d+)T(\d+):(\d+)/;

function buildApplyFilterFn(
  valueToFilter: string,
  compareFn: (value1: number, value2: number) => boolean,
  showTime?: boolean,
  keepHours?: boolean,
) {
  const [year, month, day, hour, minute] = valueToFilter
    .match(showTime ? dateTimeRegex : dateRegex)!
    .slice(1)
    .map(Number);

  const time = new Date(year, month - 1, day, hour || 0, minute || 0).getTime();

  return ({ value }): boolean => {
    if (!value) {
      return false;
    }

    const valueAsDate = value instanceof Date ? value : new Date(value.toString());
    if (keepHours) {
      return compareFn(valueAsDate.getTime(), time);
    }

    // Make a copy of the date to not reset the hours in the original object
    const dateCopy = value instanceof Date ? new Date(valueAsDate) : valueAsDate;
    const timeToCompare = dateCopy.setHours(
      showTime ? valueAsDate.getHours() : 0,
      showTime ? valueAsDate.getMinutes() : 0,
      0,
      0,
    );
    return compareFn(timeToCompare, time);
  };
}

export const getGridDateOperators: (showTime?: boolean) => GridFilterOperator[] = (showTime) => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return buildApplyFilterFn(filterItem.value, (value1, value2) => value1 === value2, showTime);
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
      return buildApplyFilterFn(filterItem.value, (value1, value2) => value1 !== value2, showTime);
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
      return buildApplyFilterFn(filterItem.value, (value1, value2) => value1 > value2, showTime);
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
      return buildApplyFilterFn(filterItem.value, (value1, value2) => value1 >= value2, showTime);
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
      return buildApplyFilterFn(
        filterItem.value,
        (value1, value2) => value1 < value2,
        showTime,
        !showTime,
      );
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
      return buildApplyFilterFn(filterItem.value, (value1, value2) => value1 <= value2, showTime);
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
];
