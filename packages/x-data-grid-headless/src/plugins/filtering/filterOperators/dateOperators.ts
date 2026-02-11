import type { FilterCondition, FilterOperator } from '../types';

function buildApplyDateFilterFn(
  condition: FilterCondition,
  compareFn: (value1: number, value2: number) => boolean,
  showTime?: boolean,
): ((value: Date) => boolean) | null {
  if (!condition.value) {
    return null;
  }

  const date = new Date(condition.value);
  if (showTime) {
    date.setSeconds(0, 0);
  } else {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    date.setHours(0, 0, 0, 0);
  }
  const time = date.getTime();

  return (value: Date): boolean => {
    if (!value) {
      return false;
    }

    const dateCopy = new Date(value);
    if (showTime) {
      dateCopy.setSeconds(0, 0);
    } else {
      dateCopy.setHours(0, 0, 0, 0);
    }
    return compareFn(dateCopy.getTime(), time);
  };
}

export const getDateFilterOperators = (showTime?: boolean): FilterOperator<Date>[] => [
  {
    value: 'is',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 === v2, showTime),
  },
  {
    value: 'not',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 !== v2, showTime),
  },
  {
    value: 'after',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 > v2, showTime),
  },
  {
    value: 'onOrAfter',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 >= v2, showTime),
  },
  {
    value: 'before',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 < v2, showTime),
  },
  {
    value: 'onOrBefore',
    getApplyFilterFn: (condition) =>
      buildApplyDateFilterFn(condition, (v1, v2) => v1 <= v2, showTime),
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
