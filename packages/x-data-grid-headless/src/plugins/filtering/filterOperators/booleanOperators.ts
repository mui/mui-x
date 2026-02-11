import type { FilterOperator } from '../types';

export const getBooleanFilterOperators = (): FilterOperator<boolean | null>[] => [
  {
    value: 'is',
    getApplyFilterFn: (condition) => {
      if (condition.value == null || condition.value === '') {
        return null;
      }
      const booleanValue =
        typeof condition.value === 'boolean' ? condition.value : condition.value === 'true';
      return (value): boolean => Boolean(value) === booleanValue;
    },
  },
];
