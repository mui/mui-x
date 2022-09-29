import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';
import { GridCellParams, GridColDef } from '../models';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

const parseObjectValue = (value: GridFilterItem) => {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  return value.value;
};

export const getGridSingleSelectQuickFilterFn = (
  value: any,
  column: GridColDef,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => {
  if (!value) {
    return null;
  }
  const { valueOptions, valueFormatter, field } = column;

  const potentialValues = [parseObjectValue(value).toString()];

  const iterableColumnValues =
    typeof valueOptions === 'function' ? valueOptions({ field }) : valueOptions || [];

  if (iterableColumnValues) {
    iterableColumnValues.forEach((option) => {
      // for each valueOption, check if the formatted value
      let optionValue;
      let optionLabel;
      if (typeof option === 'object') {
        optionValue = option.value;
        optionLabel = option.label;
      } else {
        optionValue = option;
        if (valueFormatter) {
          optionLabel = valueFormatter({ value: option, field, api: apiRef.current });
        } else {
          optionLabel = option;
        }
      }

      if (optionLabel.slice(0, value.length).toLowerCase() === value.toLowerCase()) {
        if (!potentialValues.includes(optionValue)) {
          potentialValues.push(optionValue.toString());
        }
      }
    });
  }

  return ({ value: columnValue }: GridCellParams): boolean => {
    return columnValue != null
      ? potentialValues.includes(parseObjectValue(columnValue).toString())
      : false;
  };
};

export const getGridSingleSelectOperators = (): GridFilterOperator[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => parseObjectValue(value) === parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'not',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }
      return ({ value }): boolean => parseObjectValue(value) !== parseObjectValue(filterItem.value);
    },
    InputComponent: GridFilterInputSingleSelect,
  },
  {
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }
      const filterItemValues = filterItem.value.map(parseObjectValue);
      return ({ value }): boolean => filterItemValues.includes(parseObjectValue(value));
    },
    InputComponent: GridFilterInputMultipleSingleSelect,
  },
];
