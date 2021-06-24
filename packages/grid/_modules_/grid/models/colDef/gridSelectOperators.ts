import { GridFilterInputValue } from '../../components/panel/filterPanel/GridFilterInputValue';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridSelectOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
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
    InputComponentProps: { type: 'select' },
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      return ({ value }): boolean => {
        return (
          filterItem.value?.localeCompare((value && value.toString()) || '', undefined, {
            sensitivity: 'base',
          }) !== 0
        );
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'select' },
  },
];
