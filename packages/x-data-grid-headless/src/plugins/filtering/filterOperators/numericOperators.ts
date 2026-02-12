import type { FilterOperator } from '../types';

const parseNumericValue = (value: unknown) => {
  if (value == null) {
    return null;
  }
  return Number(value);
};

export const getNumericQuickFilterFn = (
  quickFilterValue: any,
): ((cellValue: number | string | null, row: any) => boolean) | null => {
  if (
    quickFilterValue == null ||
    quickFilterValue === '' ||
    Number.isNaN(Number(quickFilterValue))
  ) {
    return null;
  }
  const numValue = Number(quickFilterValue);
  return (value): boolean => {
    return parseNumericValue(value) === numValue;
  };
};

export const getNumericFilterOperators = (): FilterOperator<number | string | null>[] => [
  {
    value: '=',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        return parseNumericValue(value) === condition.value;
      };
    },
    getApplyQuickFilterFn: getNumericQuickFilterFn,
  },
  {
    value: '!=',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        return parseNumericValue(value) !== condition.value;
      };
    },
  },
  {
    value: '>',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        if (value == null) {
          return false;
        }
        return parseNumericValue(value)! > condition.value;
      };
    },
  },
  {
    value: '>=',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        if (value == null) {
          return false;
        }
        return parseNumericValue(value)! >= condition.value;
      };
    },
  },
  {
    value: '<',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        if (value == null) {
          return false;
        }
        return parseNumericValue(value)! < condition.value;
      };
    },
  },
  {
    value: '<=',
    getApplyFilterFn: (condition) => {
      if (
        condition.value == null ||
        condition.value === '' ||
        Number.isNaN(Number(condition.value))
      ) {
        return null;
      }
      return (value): boolean => {
        if (value == null) {
          return false;
        }
        return parseNumericValue(value)! <= condition.value;
      };
    },
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
  {
    value: 'isAnyOf',
    getApplyFilterFn: (condition) => {
      if (!Array.isArray(condition.value) || condition.value.length === 0) {
        return null;
      }
      return (value): boolean => {
        return value != null && condition.value.includes(Number(value));
      };
    },
  },
];
