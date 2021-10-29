import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { GridFilterInputMultipleValue } from '../../components/panel/filterPanel/GridFilterInputMultipleValue';

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
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
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
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
  },
  {
    label: 'is any of',
    value: 'isAnyOf',
    isArrayValue: true,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value || filterItem.value.length === 0) {
        return null;
      }

      return ({ value }): boolean => {
        if (typeof value === 'object') {
          return filterItem.value.includes(value);
        }
        return filterItem.value.includes(value);
      };
    },
    InputComponent: GridFilterInputMultipleValue,
    InputComponentProps: { type: 'singleSelect' },
  },
];
