import { GridFilterInputSingleSelect } from '../../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridSingleSelectOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => {
        if (typeof value === 'object') {
          return filterItem.value === (value as { value: any; label: string }).value;
        }
        return filterItem.value === value;
      };
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => {
        if (typeof value === 'object') {
          return filterItem.value !== (value as { value: any; label: string }).value;
        }
        return filterItem.value !== value;
      };
    },
    InputComponent: GridFilterInputSingleSelect,
  },
];
