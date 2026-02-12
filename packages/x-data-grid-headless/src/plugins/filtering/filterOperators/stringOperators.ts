import type { FilterCondition, FilterOperator } from '../types';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const createContainsFilterFn = (negate: boolean) => (condition: FilterCondition) => {
  if (!condition.value) {
    return null;
  }
  const trimmedValue = String(condition.value).trim();
  const filterRegex = new RegExp(escapeRegExp(trimmedValue), 'i');
  return (value: any): boolean => {
    if (value == null) {
      return negate;
    }
    const matches = filterRegex.test(String(value));
    return negate ? !matches : matches;
  };
};

const createEqualityFilterFn = (negate: boolean) => (condition: FilterCondition) => {
  if (!condition.value) {
    return null;
  }
  const trimmedValue = String(condition.value).trim();
  const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
  return (value: any): boolean => {
    if (value == null) {
      return negate;
    }
    const isEqual = collator.compare(trimmedValue, value.toString()) === 0;
    return negate ? !isEqual : isEqual;
  };
};

const createEmptyFilterFn = (negate: boolean) => () => {
  return (value: any): boolean => {
    const isEmpty = value === '' || value == null;
    return negate ? !isEmpty : isEmpty;
  };
};

export const getStringQuickFilterFn = (
  quickFilterValue: any,
): ((cellValue: string | number | null, row: any) => boolean) | null => {
  if (!quickFilterValue) {
    return null;
  }
  const trimmedValue = String(quickFilterValue).trim();
  if (!trimmedValue) {
    return null;
  }
  const filterRegex = new RegExp(escapeRegExp(trimmedValue), 'i');
  return (value): boolean => {
    if (value == null) {
      return false;
    }
    return filterRegex.test(String(value));
  };
};

export const getStringFilterOperators = (): FilterOperator<string | number | null>[] => [
  {
    value: 'contains',
    getApplyFilterFn: createContainsFilterFn(false),
    getApplyQuickFilterFn: getStringQuickFilterFn,
  },
  {
    value: 'doesNotContain',
    getApplyFilterFn: createContainsFilterFn(true),
  },
  {
    value: 'equals',
    getApplyFilterFn: createEqualityFilterFn(false),
  },
  {
    value: 'doesNotEqual',
    getApplyFilterFn: createEqualityFilterFn(true),
  },
  {
    value: 'startsWith',
    getApplyFilterFn: (condition: FilterCondition) => {
      if (!condition.value) {
        return null;
      }
      const trimmedValue = String(condition.value).trim();
      const filterRegex = new RegExp(`^${escapeRegExp(trimmedValue)}.*$`, 'i');
      return (value): boolean => {
        return value != null ? filterRegex.test(String(value)) : false;
      };
    },
  },
  {
    value: 'endsWith',
    getApplyFilterFn: (condition: FilterCondition) => {
      if (!condition.value) {
        return null;
      }
      const trimmedValue = String(condition.value).trim();
      const filterRegex = new RegExp(`.*${escapeRegExp(trimmedValue)}$`, 'i');
      return (value): boolean => {
        return value != null ? filterRegex.test(String(value)) : false;
      };
    },
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: createEmptyFilterFn(false),
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: createEmptyFilterFn(true),
    requiresFilterValue: false,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: (condition: FilterCondition) => {
      if (!Array.isArray(condition.value) || condition.value.length === 0) {
        return null;
      }
      const filterItemValue = condition.value.map((val: string) => String(val).trim());
      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
      return (value): boolean =>
        value != null
          ? filterItemValue.some(
              (filterValue: string) => collator.compare(filterValue, String(value)) === 0,
            )
          : false;
    },
  },
];
