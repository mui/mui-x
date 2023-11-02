import { GridFilterInputDate } from '../components/panel/filterPanel/GridFilterInputDate';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator, GetApplyFilterFn } from '../models/gridFilterOperator';

const dateRegex = /(\d+)-(\d+)-(\d+)/;
const dateTimeRegex = /(\d+)-(\d+)-(\d+)T(\d+):(\d+)/;

function buildApplyFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  showTime?: boolean,
  keepHours?: boolean,
): ReturnType<GetApplyFilterFn> {
  if (!filterItem.value) {
    return null;
  }

  const [year, month, day, hour, minute] = filterItem.value
    .match(showTime ? dateTimeRegex : dateRegex)!
    .slice(1)
    .map(Number);

  const time = new Date(year, month - 1, day, hour || 0, minute || 0).getTime();

  return (value): boolean => {
    if (!value) {
      return false;
    }

    if (keepHours) {
      return compareFn(value.getTime(), time);
    }

    // Make a copy of the date to not reset the hours in the original object
    const dateCopy = new Date(value);
    const timeToCompare = dateCopy.setHours(
      showTime ? value.getHours() : 0,
      showTime ? value.getMinutes() : 0,
      0,
      0,
    );
    return compareFn(timeToCompare, time);
  };
}

export const getGridDateOperators = (showTime?: boolean): GridFilterOperator<any, Date, any>[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(filterItem, (value1, value2) => value1 === value2, showTime);
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(filterItem, (value1, value2) => value1 !== value2, showTime);
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'after',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(filterItem, (value1, value2) => value1 > value2, showTime);
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrAfter',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(filterItem, (value1, value2) => value1 >= value2, showTime);
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'before',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(
        filterItem,
        (value1, value2) => value1 < value2,
        showTime,
        !showTime,
      );
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'onOrBefore',
    getApplyFilterFn: (filterItem) => {
      return buildApplyFilterFn(filterItem, (value1, value2) => value1 <= value2, showTime);
    },
    InputComponent: GridFilterInputDate,
    InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: () => {
      return (value): boolean => {
        return value == null;
      };
    },
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: () => {
      return (value): boolean => {
        return value != null;
      };
    },
    requiresFilterValue: false,
  },
];
