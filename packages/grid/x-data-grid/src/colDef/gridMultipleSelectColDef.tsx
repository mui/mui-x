import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridMultipleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditMultipleSelectCell } from '../components/cell/GridEditMultipleSelectCell';
import { getGridMultipleSelectOperators } from './gridMultipleSelectOperators';
import { isMultipleSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';
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

export const GRID_MULTIPLE_SELECT_COL_DEF: Omit<GridMultipleSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'multipleSelect',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  valueFormatter(params) {
    const { id, field, value, api } = params;
    const colDef = params.api.getColumn(field);

    if (!isMultipleSelectColDef(colDef)) {
      return [];
    }

    let valueOptions: Array<ValueOptions>;
    if (typeof colDef.valueOptions === 'function') {
      valueOptions = colDef.valueOptions!({ id, row: id ? api.getRow(id) : null, field });
    } else {
      valueOptions = colDef.valueOptions!;
    }

    if (value == null) {
      return [];
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
  renderEditCell: renderEditMultipleSelectCell,
  filterOperators: getGridMultipleSelectOperators(),
};
