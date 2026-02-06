import type { GridFilterOperator } from '@mui/x-data-grid';
import { isObject } from '@mui/x-data-grid/internals';
import { GridFilterInputMultiSelect } from '../components/panel/filterPanel/GridFilterInputMultiSelect';

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
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      const filterValue = parseObjectValue(filterItem.value);
      return (cellValue): boolean => {
        if (!Array.isArray(cellValue)) {
          return false;
        }
        return cellValue.some((val) => parseObjectValue(val) === filterValue);
      };
    },
    InputComponent: GridFilterInputMultiSelect,
  },
  {
    value: 'doesNotContain',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      const filterValue = parseObjectValue(filterItem.value);
      return (cellValue): boolean => {
        if (!Array.isArray(cellValue)) {
          return true;
        }
        return !cellValue.some((val) => parseObjectValue(val) === filterValue);
      };
    },
    InputComponent: GridFilterInputMultiSelect,
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
