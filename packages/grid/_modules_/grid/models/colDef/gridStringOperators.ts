import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { escapeRegExp } from '../../utils/utils';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridStringOperators = (): GridFilterOperator[] => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const filterRegex = new RegExp(escapeRegExp(filterItem.value), 'i');
      return ({ value }): boolean => {
        return filterRegex.test((value && value.toString()) || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'equals',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }
      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
      return ({ value }): boolean => {
        return collator.compare(filterItem.value, (value && value.toString()) || '') === 0;
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const filterRegex = new RegExp(`^${escapeRegExp(filterItem.value)}.*$`, 'i');
      return ({ value }): boolean => {
        return filterRegex.test((value && value.toString()) || '');
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

      const filterRegex = new RegExp(`.*${escapeRegExp(filterItem.value)}$`, 'i');
      return ({ value }): boolean => {
        return filterRegex.test((value && value.toString()) || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'isEmpty',
    getApplyFilterFn: () => {
      return ({ value }): boolean => {
        return value === '' || value == null;
      };
    },
  },
  {
    value: 'isNotEmpty',
    getApplyFilterFn: () => {
      return ({ value }): boolean => {
        return value !== '' && value != null;
      };
    },
  },
];
