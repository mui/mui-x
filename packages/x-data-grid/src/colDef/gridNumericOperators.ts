import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterOperator } from '../models/gridFilterOperator';
import type { GetApplyQuickFilterFn } from '../models/colDef/gridColDef';
import { GridFilterItem } from '../models';

const parseNumericValue = (value: unknown) => {
  if (value == null) {
    return null;
  }

  return Number(value);
};

export const getGridNumericQuickFilterFn: GetApplyQuickFilterFn<any, number | string | null> = (
  value,
) => {
  if (value == null || Number.isNaN(value) || value === '') {
    return null;
  }

  return (columnValue) => {
    return parseNumericValue(columnValue) === parseNumericValue(value);
  };
};

const createAnyFilterFn = (negate: boolean) => (filterItem: GridFilterItem) => {
  if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
    return null;
  }

  const isAnyOf = (value: unknown): boolean => {
    if (value == null) {
      return false;
    }
    return filterItem.value.includes(Number(value));
  };

  return negate ? (value: unknown) => !isAnyOf(value) : isAnyOf;
};

export const getGridNumericOperators = (): GridFilterOperator<
  any,
  number | string | null,
  any
>[] => [
  {
    value: '=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        return parseNumericValue(value) === filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: '!=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        return parseNumericValue(value) !== filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: '>',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        if (value == null) {
          return false;
        }

        return parseNumericValue(value)! > filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: '>=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        if (value == null) {
          return false;
        }

        return parseNumericValue(value)! >= filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: '<',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        if (value == null) {
          return false;
        }

        return parseNumericValue(value)! < filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: '<=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return (value): boolean => {
        if (value == null) {
          return false;
        }

        return parseNumericValue(value)! <= filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
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
    getApplyFilterFn: createAnyFilterFn(false),
    InputComponent: GridFilterInputMultipleValue,
    InputComponentProps: { type: 'number' },
  },
  {
    value: 'isNotAnyOf',
    getApplyFilterFn: createAnyFilterFn(true),
    InputComponent: GridFilterInputMultipleValue,
    InputComponentProps: { type: 'number' },
  },
];
