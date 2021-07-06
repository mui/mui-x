import { GridFilterInputBoolean } from '../../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';

export const getGridBooleanOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const valueAsBoolean = filterItem.value === 'true';
      return ({ value }): boolean => {
        return Boolean(value) === valueAsBoolean;
      };
    },
    InputComponent: GridFilterInputBoolean,
  },
];
