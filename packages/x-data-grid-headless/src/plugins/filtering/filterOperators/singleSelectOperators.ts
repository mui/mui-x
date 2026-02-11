import type { FilterOperator } from '../types';

const parseObjectValue = (value: unknown) => {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  return (value as { value: unknown }).value;
};

export const getSingleSelectFilterOperators = (): FilterOperator[] => [
  {
    value: 'is',
    getApplyFilterFn: (condition) => {
      if (condition.value == null || condition.value === '') {
        return null;
      }
      return (value): boolean => parseObjectValue(value) === parseObjectValue(condition.value);
    },
  },
  {
    value: 'not',
    getApplyFilterFn: (condition) => {
      if (condition.value == null || condition.value === '') {
        return null;
      }
      return (value): boolean => parseObjectValue(value) !== parseObjectValue(condition.value);
    },
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: (condition) => {
      if (!Array.isArray(condition.value) || condition.value.length === 0) {
        return null;
      }
      const filterItemValues = condition.value.map(parseObjectValue);
      return (value): boolean => filterItemValues.includes(parseObjectValue(value));
    },
  },
];
