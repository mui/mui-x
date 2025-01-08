import {
  GridFilterInputBoolean,
  sanitizeFilterItemValue,
} from '../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';

export const getGridBooleanOperators = (): GridFilterOperator<any, boolean | null, any>[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      const sanitizedValue = sanitizeFilterItemValue(filterItem.value);
      if (sanitizedValue === undefined) {
        return null;
      }

      return (value): boolean => Boolean(value) === sanitizedValue;
    },
    InputComponent: GridFilterInputBoolean,
  },
];
