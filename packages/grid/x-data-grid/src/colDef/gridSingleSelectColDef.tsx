import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridSingleSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import { getGridSingleSelectOperators } from './gridSingleSelectOperators';
import {
  getLabelFromValueOption,
  isSingleSelectColDef,
} from '../components/panel/filterPanel/filterPanelUtils';

const isArrayOfObjects = (options: any): options is Array<{ value: any; label: string }> => {
  return typeof options[0] === 'object';
};

export const GRID_SINGLE_SELECT_COL_DEF: Omit<GridSingleSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'singleSelect',
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
      return getLabelFromValueOption(value);
    }

    const valueOption = valueOptions.find((option) => option.value === value);
    return valueOption ? getLabelFromValueOption(valueOption) : '';
  },
  renderEditCell: renderEditSingleSelectCell,
  filterOperators: getGridSingleSelectOperators(),
};
