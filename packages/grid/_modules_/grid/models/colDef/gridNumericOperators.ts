import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterInputMultipleValue } from '../../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { wrapWithDeprecationWarning } from '../../utils/deprecation';

const parseNumericValue = (value: string | number | null) => {
  if (value == null) {
    return null;
  }

  return Number(value);
};

export const getGridNumericOperators = (): GridFilterOperator[] => [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
    getApplyFilterFn: (filterItem: GridFilterItem) => {
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
export const getGridNumericColumnOperators = wrapWithDeprecationWarning(
  getGridNumericOperators,
  'MUI: Using getGridNumericColumnOperators is deprecated, use getGridNumericOperators instead.',
);
