import { isArrayOfObjects } from './gridSelectColDefUtils';
import { GRID_SINGLE_SELECT_COL_DEF } from './gridSingleSelectColDef';
import { GridMultipleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditMultipleSelectCell } from '../components/cell/GridEditMultipleSelectCell';
import { getGridMultipleSelectOperators } from './gridMultipleSelectOperators';
import { isMultipleSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';

export const GRID_MULTIPLE_SELECT_COL_DEF: Omit<GridMultipleSelectColDef, 'field'> = {
  ...GRID_SINGLE_SELECT_COL_DEF,
  type: 'multipleSelect',
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
  renderCell: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value),
  renderEditCell: renderEditMultipleSelectCell,
  filterOperators: getGridMultipleSelectOperators(),
};
