import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterInputMultipleValue } from '../../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridNumericColumnOperators = (): GridFilterOperator[] => [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }): boolean => {
        return Number(value) === filterItem.value;
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
        return Number(value) !== filterItem.value;
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
        return Number(value) > filterItem.value;
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
        return Number(value) >= filterItem.value;
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
        return Number(value) < filterItem.value;
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
        return Number(value) <= filterItem.value;
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
    label: 'is any of',
    value: 'isAnyOf',
    isArrayValue: true,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value.length === 0) {
        return null;
      }

      return ({ value }): boolean => {
        return value !== null && filterItem.value.includes(Number(value));
      };
    },
    InputComponent: GridFilterInputMultipleValue,
    InputComponentProps: { type: 'number' },
  },
];
