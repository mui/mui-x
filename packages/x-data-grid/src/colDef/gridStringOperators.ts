import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { escapeRegExp } from '../utils/utils';
import type { GetApplyQuickFilterFn } from '../models/colDef/gridColDef';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { removeDiacritics } from '../hooks/features/filter/gridFilterUtils';

export const getGridStringQuickFilterFn: GetApplyQuickFilterFn<any, unknown> = (value) => {
  if (!value) {
    return null;
  }
  const filterRegex = new RegExp(escapeRegExp(value), 'i');
  return (_, row, column, apiRef) => {
    let columnValue = apiRef.current.getRowFormattedValue(row, column);
    if (apiRef.current.ignoreDiacritics) {
      columnValue = removeDiacritics(columnValue);
    }
    return columnValue != null ? filterRegex.test(columnValue.toString()) : false;
  };
};

const createContainsFilterFn =
  (disableTrim: boolean, negate: boolean) => (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    const trimmedValue = disableTrim ? filterItem.value : filterItem.value.trim();
    const filterRegex = new RegExp(escapeRegExp(trimmedValue), 'i');
    const contains = (value: unknown): boolean => {
      if (value == null) {
        return false;
      }
      return filterRegex.test(String(value));
    };
    return negate ? (value: unknown) => !contains(value) : contains;
  };

const createEqualityFilterFn =
  (disableTrim: boolean, negate: boolean) => (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    const trimmedValue = disableTrim ? filterItem.value : filterItem.value.trim();

    const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
    const isEqual = (value: unknown): boolean => {
      if (value == null) {
        return false;
      }
      return collator.compare(trimmedValue, value.toString()) === 0;
    };
    return negate ? (value: unknown) => !isEqual(value) : isEqual;
  };

const createEmptyFilterFn = (negate: boolean) => () => {
  const isEmpty = (value: unknown): boolean => {
    return value === '' || value == null;
  };
  return negate ? (value: unknown) => !isEmpty(value) : isEmpty;
};

const createAnyFilterFn =
  (disableTrim: boolean, negate: boolean) => (filterItem: GridFilterItem) => {
    if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
      return null;
    }

    const filterItemValue = disableTrim
      ? filterItem.value
      : filterItem.value.map((val) => val.trim());
    const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });

    const isAnyOf = (value: unknown): boolean => {
      if (value == null) {
        return false;
      }
      return filterItemValue.some((filterValue: GridFilterItem['value']) => {
        return collator.compare(filterValue, value.toString() || '') === 0;
      });
    };

    return negate ? (value: unknown) => !isAnyOf(value) : isAnyOf;
  };

export const getGridStringOperators = (
  disableTrim: boolean = false,
): GridFilterOperator<any, number | string | null, any>[] => [
  {
    value: 'contains',
    getApplyFilterFn: createContainsFilterFn(disableTrim, false),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'doesNotContain',
    getApplyFilterFn: createContainsFilterFn(disableTrim, true),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'equals',
    getApplyFilterFn: createEqualityFilterFn(disableTrim, false),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'doesNotEqual',
    getApplyFilterFn: createEqualityFilterFn(disableTrim, true),
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`^${escapeRegExp(filterItemValue)}.*$`, 'i');
      return (value): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'endsWith',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`.*${escapeRegExp(filterItemValue)}$`, 'i');
      return (value): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    },
    InputComponent: GridFilterInputValue,
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
    getApplyFilterFn: createAnyFilterFn(disableTrim, false),
    InputComponent: GridFilterInputMultipleValue,
  },
  {
    value: 'isNotAnyOf',
    getApplyFilterFn: createAnyFilterFn(disableTrim, true),
    InputComponent: GridFilterInputMultipleValue,
  },
];
