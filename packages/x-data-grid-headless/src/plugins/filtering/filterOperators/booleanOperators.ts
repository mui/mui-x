import type { FilterOperator } from '../types';

export const getBooleanFilterOperators = (): FilterOperator<boolean | null>[] => [
  {
    value: 'is',
    getApplyFilterFn: (condition) => {
      if (condition.value == null || condition.value === '') {
        return null;
      }

      let booleanValue: boolean;

      if (typeof condition.value === 'boolean') {
        booleanValue = condition.value;
      } else {
        const strValue = String(condition.value).toLowerCase();
        if (strValue === 'true') {
          booleanValue = true;
        } else if (strValue === 'false') {
          booleanValue = false;
        } else {
          // Invalid string value — treat as no filter
          return null;
        }
      }

      return (value): boolean => Boolean(value) === booleanValue;
    },
  },
];
