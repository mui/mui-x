import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridSingleSelectOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return ({ value }): boolean => {
        return typeof value === 'string'
          ? filterItem.value === value
          : filterItem.value === (value as { value: any; label: string }).value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return ({ value }): boolean => {
        return typeof value === 'string'
          ? filterItem.value !== value
          : filterItem.value !== (value as { value: any; label: string }).value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
  },
];
