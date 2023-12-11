import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridSingleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import { getGridSingleSelectOperators } from './gridSingleSelectOperators';
import {
  getValueOptions,
  isSingleSelectColDef,
} from '../components/panel/filterPanel/filterPanelUtils';
import { isObject } from '../utils/utils';

const isArrayOfObjects = (options: any): options is Array<Record<string, any>> => {
  return typeof options[0] === 'object';
};

const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

export const GRID_SINGLE_SELECT_COL_DEF: Omit<GridSingleSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'singleSelect',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  valueFormatter(params) {
    const { id, field, value, api } = params;
    const colDef = params.api.getColumn(field);

    if (!isSingleSelectColDef(colDef)) {
      return '';
    }

    const valueOptions = getValueOptions(colDef, { id, row: id ? api.getRow(id) : null });
    if (value == null) {
      return '';
    }

    if (!valueOptions) {
      return value;
    }

    if (!isArrayOfObjects(valueOptions)) {
      return colDef.getOptionLabel!(value);
    }

    const valueOption = valueOptions.find((option) => colDef.getOptionValue!(option) === value);
    return valueOption ? colDef.getOptionLabel!(valueOption) : '';
  },
  renderEditCell: renderEditSingleSelectCell,
  filterOperators: getGridSingleSelectOperators(),
  // @ts-ignore
  pastedValueParser: (value, params) => {
    const colDef = params.colDef as GridSingleSelectColDef;
    const valueOptions = getValueOptions(colDef) || [];
    const getOptionValue = (colDef as GridSingleSelectColDef).getOptionValue!;
    const valueOption = valueOptions.find((option) => {
      if (getOptionValue(option) === value) {
        return true;
      }
      return false;
    });
    if (valueOption) {
      return value;
    }
    // do not paste the value if it is not in the valueOptions
    return undefined;
  },
};
