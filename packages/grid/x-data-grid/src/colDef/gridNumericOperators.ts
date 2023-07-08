import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterOperator } from '../models/gridFilterOperator';
import type { GridApplyQuickFilterV7 } from '../models/colDef/gridColDef';
import { convertLegacyOperators, tagInternalFilter } from './utils';

const parseNumericValue = (value: unknown) => {
  if (value == null) {
    return null;
  }

  return Number(value);
};

export const getGridNumericQuickFilterFn = tagInternalFilter(
  (value: any): GridApplyQuickFilterV7 | null => {
    if (value == null || Number.isNaN(value) || value === '') {
      return null;
    }

    return (columnValue): boolean => {
      return parseNumericValue(columnValue) === parseNumericValue(value);
    };
  },
);

export const getGridNumericOperators = (): GridFilterOperator<any, number | string | null, any>[] =>
  convertLegacyOperators([
    {
      value: '=',
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: (filterItem) => {
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
      getApplyFilterFnV7: () => {
        return (value): boolean => {
          return value == null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFnV7: () => {
        return (value): boolean => {
          return value != null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isAnyOf',
      getApplyFilterFnV7: (filterItem) => {
        if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
          return null;
        }

        return (value): boolean => {
          return value != null && filterItem.value.includes(Number(value));
        };
      },
      InputComponent: GridFilterInputMultipleValue,
      InputComponentProps: { type: 'number' },
    },
  ]);
