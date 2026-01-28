import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridMultiSelectColDef, ValueOptions } from '../models/colDef/gridColDef';
import { getGridMultiSelectOperators } from './gridMultiSelectOperators';
import { getValueOptions, isMultiSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';
import { isObject } from '../utils/utils';
import { gridRowIdSelector } from '../hooks/core/gridPropsSelectors';
import { renderMultiSelectCell } from '../components/cell/GridMultiSelectCell';

const isArrayOfObjects = (options: any): options is Array<Record<string, any>> => {
  return typeof options[0] === 'object';
};

const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

export const GRID_MULTI_SELECT_COL_DEF: Omit<GridMultiSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'multiSelect',
  display: 'flex',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  sortComparator: (v1, v2) => (v1?.length ?? 0) - (v2?.length ?? 0),
  renderCell: renderMultiSelectCell,
  valueFormatter: (value: any, row, colDef, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);

    if (!isMultiSelectColDef(colDef)) {
      return '';
    }

    if (!Array.isArray(value) || value.length === 0) {
      return '';
    }

    const valueOptions = getValueOptions(colDef, { id: rowId, row });
    const separator = colDef.separator ?? ', ';

    if (!valueOptions || !isArrayOfObjects(valueOptions)) {
      return value.map((v: any) => colDef.getOptionLabel!(v)).join(separator);
    }

    return value
      .map((v: any) => {
        const valueOption = valueOptions.find(
          (option) => colDef.getOptionValue!(option) === v,
        );
        return valueOption ? colDef.getOptionLabel!(valueOption) : String(v);
      })
      .join(separator);
  },
  filterOperators: getGridMultiSelectOperators(),
  // @ts-ignore
  pastedValueParser: (value, row, column) => {
    const colDef = column as GridMultiSelectColDef;
    const valueOptions = getValueOptions(colDef) || [];
    const getOptionValue = colDef.getOptionValue!;
    const getOptionLabel = colDef.getOptionLabel!;
    const separator = colDef.separator ?? ', ';

    const values = value.split(separator).map((v: string) => v.trim());
    const validValues = values.filter((v: string) =>
      valueOptions.some(
        (option) =>
          String(getOptionValue(option)) === v || getOptionLabel(option) === v,
      ),
    );

    return validValues.length > 0 ? validValues : undefined;
  },
};
