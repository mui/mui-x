import type { FilterOperator } from '../types';

const parseObjectValue = (value: unknown) => {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  return (value as { value: unknown }).value;
};

export const getSingleSelectQuickFilterFn = (
  quickFilterValue: any,
): ((cellValue: any, row: any) => boolean) | null => {
  if (quickFilterValue == null || quickFilterValue === '') {
    return null;
  }
  const trimmedValue = String(quickFilterValue).trim().toLowerCase();
  if (!trimmedValue) {
    return null;
  }
  return (value): boolean => {
    if (value == null) {
      return false;
    }
    // Check against the string representation (label) of the value
    const label = typeof value === 'object' && value !== null ? (value as { label: string }).label : String(value);
    return label.toLowerCase().includes(trimmedValue);
  };
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
    getApplyQuickFilterFn: getSingleSelectQuickFilterFn,
    getValueAsString: (value: any) => String(value ?? ''),
  },
  {
    value: 'not',
    getApplyFilterFn: (condition) => {
      if (condition.value == null || condition.value === '') {
        return null;
      }
      return (value): boolean => parseObjectValue(value) !== parseObjectValue(condition.value);
    },
    getValueAsString: (value: any) => String(value ?? ''),
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
