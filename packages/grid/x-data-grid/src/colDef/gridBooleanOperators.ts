import { GridFilterInputBoolean } from '../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { v7 } from './utils';

export const getGridBooleanOperators = (): GridFilterOperator<any, boolean | null, any>[] => [
  {
    value: 'is',
    getApplyFilterFn: v7((filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const valueAsBoolean = filterItem.value === 'true';
      return (value, _, __, ___): boolean => {
        return Boolean(value) === valueAsBoolean;
      };
    }),
    InputComponent: GridFilterInputBoolean,
  },
];
