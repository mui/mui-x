import { GridFilterInputMultipleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSelect';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleMultipleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleMultipleSelect';
import { isObject } from '../utils/utils';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

export const getGridMultipleSelectOperators = (): GridFilterOperator[] => [
  {
    value: 'contains',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean =>
        Array.isArray(value)
          ? value.includes(parseObjectValue(filterItem.value))
          : parseObjectValue(value) === parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputMultipleSelect,
  },
  {
    value: 'notContains',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean =>
        Array.isArray(value)
          ? !value.includes(parseObjectValue(filterItem.value))
          : parseObjectValue(value) !== parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputMultipleSelect,
  },
  {
    value: 'containsAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterItemValues = filterItem.value.map(parseObjectValue);
      return ({ value }): boolean =>
        Array.isArray(value)
          ? filterItemValues.some((r) => value.includes(r))
          : filterItemValues.includes(parseObjectValue(value));
    },
    InputComponent: GridFilterInputMultipleMultipleSelect,
  },
];
