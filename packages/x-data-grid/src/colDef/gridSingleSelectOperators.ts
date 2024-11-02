import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';
import { isObject } from '../utils/utils';
import { GridFilterItem } from '../models';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

const createAnyFilterFn = (negate: boolean) => (filterItem: GridFilterItem) => {
  if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
    return null;
  }

  const filterItemValues = filterItem.value.map(parseObjectValue);

  const isAnyOf = (value: unknown): boolean => {
    if (value == null) {
      return false;
    }
    return filterItemValues.includes(parseObjectValue(value));
  };

  return negate ? (value: unknown) => !isAnyOf(value) : isAnyOf;
};
export const getGridSingleSelectOperators = (): GridFilterOperator[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return (value): boolean => parseObjectValue(value) === parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return (value): boolean => parseObjectValue(value) !== parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: createAnyFilterFn(false),
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
  {
    value: 'isNotAnyOf',
    getApplyFilterFn: createAnyFilterFn(true),
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
];
