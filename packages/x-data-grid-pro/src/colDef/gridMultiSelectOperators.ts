import type { GridFilterOperator } from '@mui/x-data-grid';
import { isObject } from '@mui/x-data-grid/internals';
import { GridFilterInputMultipleMultiSelect } from '../components/panel/filterPanel/GridFilterInputMultipleMultiSelect';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

/**
 * Returns filter operators for the `multiSelect` column type.
 * Operators: contains, doesNotContain, isEmpty, isNotEmpty
 */
export const getGridMultiSelectOperators = (): GridFilterOperator[] => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterValues = filterItem.value.map(parseObjectValue);
      return (cellValue): boolean => {
        if (!Array.isArray(cellValue)) {
          return false;
        }
        return filterValues.some((fv) => cellValue.some((val) => parseObjectValue(val) === fv));
      };
    },
    InputComponent: GridFilterInputMultipleMultiSelect,
  },
  {
    value: 'doesNotContain',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterValues = filterItem.value.map(parseObjectValue);
      return (cellValue): boolean => {
        if (!Array.isArray(cellValue)) {
          return true;
        }
        return !filterValues.some((fv) => cellValue.some((val) => parseObjectValue(val) === fv));
      };
    },
    InputComponent: GridFilterInputMultipleMultiSelect,
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: () => {
      return (cellValue): boolean => {
        return !cellValue || !Array.isArray(cellValue) || cellValue.length === 0;
      };
    },
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: () => {
      return (cellValue): boolean => {
        return Array.isArray(cellValue) && cellValue.length > 0;
      };
    },
    requiresFilterValue: false,
  },
];
