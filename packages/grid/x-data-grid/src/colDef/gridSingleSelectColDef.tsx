import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridSingleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import { getGridSingleSelectOperators } from './gridSingleSelectOperators';
import { isSingleSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';
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

    let valueOptions: Array<ValueOptions>;
    if (typeof colDef.valueOptions === 'function') {
      valueOptions = colDef.valueOptions!({ id, row: id ? api.getRow(id) : null, field });
    } else {
      valueOptions = colDef.valueOptions!;
    }

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
};
