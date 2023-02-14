import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridSingleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import { getGridSingleSelectOperators } from './gridSingleSelectOperators';
import { isSingleSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';

const isArrayOfObjects = (options: any): options is Array<{ value: any; label: string }> => {
  return typeof options[0] === 'object';
};

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

const defaultGetOptionValue = (value: unknown) => {
  return isObject(value) ? value.value : value;
};

const defaultGetOptionLabel = (value: unknown) => {
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
