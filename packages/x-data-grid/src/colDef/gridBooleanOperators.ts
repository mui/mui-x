import { GridFilterInputBoolean } from '../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';

export const getGridBooleanOperators = (): GridFilterOperator<any, boolean | null, any>[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const valueAsBoolean = String(filterItem.value) === 'true';
      return (value): boolean => {
        return Boolean(value) === valueAsBoolean;
      };
    },
    InputComponent: GridFilterInputBoolean,
  },
];
