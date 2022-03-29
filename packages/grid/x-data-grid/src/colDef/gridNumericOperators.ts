import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { wrapWithWarningOnCall } from '../utils/warning';

const parseNumericValue = (value: string | number | null | undefined) => {
  if (value == null) {
    return null;
  }

  return Number(value);
};

export const getGridNumericOperators = (): GridFilterOperator<
  any,
  number | string | null,
  any
>[] => [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
        return parseNumericValue(value) === filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '!=',
    value: '!=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
        return parseNumericValue(value) !== filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: '>',
    value: '>',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
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
    label: '>=',
    value: '>=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
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
    label: '<',
    value: '<',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
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
    label: '<=',
    value: '<=',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
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
      return ({ value }): boolean => {
        return value == null;
      };
    },
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: () => {
      return ({ value }): boolean => {
        return value != null;
      };
    },
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }

      return ({ value }): boolean => {
        return value != null && filterItem.value.includes(Number(value));
      };
    },
    InputComponent: GridFilterInputMultipleValue,
    InputComponentProps: { type: 'number' },
  },
];

/**
 * @deprecated Use `getGridNumericOperators` instead.
 */
export const getGridNumericColumnOperators = wrapWithWarningOnCall(getGridNumericOperators, [
  'MUI: The method getGridNumericColumnOperators is deprecated and will be removed in the next major version.',
  'Use getGridNumericOperators instead.',
]);
