import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const getGridStringOperators: () => GridFilterOperator[] = () => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
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
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return ({ value }): boolean => {
        return (
          filterItem.value?.localeCompare((value && value.toString()) || '', undefined, {
            sensitivity: 'base',
          }) === 0
        );
      };
    },
    InputComponent: GridFilterInputValue,
  },
  {
    value: 'startsWith',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
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
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`.*${escapeRegExp(filterItem.value)}$`, 'i');
      return ({ value }): boolean => {
        return filterRegex.test((value && value.toString()) || '');
      };
    },
    InputComponent: GridFilterInputValue,
  },
];
