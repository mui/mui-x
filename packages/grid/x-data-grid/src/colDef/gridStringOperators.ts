import { GridFilterInputValue } from '../components/panel/filterPanel/GridFilterInputValue';
import { escapeRegExp } from '../utils/utils';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleValue } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridCellParams } from '../models';

export const getGridStringQuickFilterFn = (value: any) => {
  if (!value) {
    return null;
  }
  const filterRegex = new RegExp(escapeRegExp(value), 'i');
  return ({ formattedValue: columnValue }: GridCellParams): boolean => {
    return columnValue != null ? filterRegex.test(columnValue.toString()) : false;
  };
};

export const getGridStringOperators = (
  disableTrim: boolean = false,
): GridFilterOperator<any, number | string | null, any>[] => [
  {
    value: 'contains',
    getApplyFilterFnV7: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(escapeRegExp(filterItemValue), 'i');
      return (value, _, __): boolean => {
        return value != null ? filterRegex.test(String(value)) : false;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'equals',
    getApplyFilterFnV7: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
      return (value, _, __): boolean => {
        return value != null ? collator.compare(filterItemValue, value.toString()) === 0 : false;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFnV7: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`^${escapeRegExp(filterItemValue)}.*$`, 'i');
      return (value, _, __): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'endsWith',
    getApplyFilterFnV7: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();

      const filterRegex = new RegExp(`.*${escapeRegExp(filterItemValue)}$`, 'i');
      return (value, _, __): boolean => {
        return value != null ? filterRegex.test(value.toString()) : false;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'isEmpty',
    getApplyFilterFnV7: () => {
      return (value, _, __): boolean => {
        return value === '' || value == null;
      };
    },
    requiresFilterValue: false,
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFnV7: () => {
      return (value, _, __): boolean => {
        return value !== '' && value != null;
      };
    },
    requiresFilterValue: false,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFnV7: (filterItem: GridFilterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterItemValue = disableTrim
        ? filterItem.value
        : filterItem.value.map((val) => val.trim());
      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });

      return (value, _, __): boolean =>
        value != null
          ? filterItemValue.some((filterValue: GridFilterItem['value']) => {
              return collator.compare(filterValue, value.toString() || '') === 0;
            })
          : false;
    },
    InputComponent: GridFilterInputMultipleValue,
  },
];
