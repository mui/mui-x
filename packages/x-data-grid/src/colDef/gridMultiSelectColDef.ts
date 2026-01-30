import { GRID_STRING_COL_DEF } from './gridStringColDef';
import {
  GetApplyQuickFilterFn,
  GridMultiSelectColDef,
  ValueOptions,
} from '../models/colDef/gridColDef';
import { getGridMultiSelectOperators } from './gridMultiSelectOperators';
import {
  getValueOptions,
  isMultiSelectColDef,
} from '../components/panel/filterPanel/filterPanelUtils';
import { escapeRegExp, isObject } from '../utils/utils';
import { gridRowIdSelector } from '../hooks/core/gridPropsSelectors';
import { renderMultiSelectCell } from '../components/cell/GridMultiSelectCell';
import { renderEditMultiSelectCell } from '../components/cell/GridEditMultiSelectCell';
import { removeDiacritics } from '../hooks/features/filter/gridFilterUtils';

const isArrayOfObjects = (options: any): options is Array<Record<string, any>> => {
  return typeof options[0] === 'object';
};

const defaultGetOptionValue = (value: ValueOptions) => {
  return isObject(value) ? value.value : value;
};

const defaultGetOptionLabel = (value: ValueOptions) => {
  return isObject(value) ? value.label : String(value);
};

export const getGridMultiSelectQuickFilterFn: GetApplyQuickFilterFn<any, any> = (value) => {
  if (!value) {
    return null;
  }
  const filterRegex = new RegExp(escapeRegExp(value), 'i');
  return (_, row, column, apiRef) => {
    let formattedValue = apiRef.current.getRowFormattedValue(row, column);
    if (apiRef.current.ignoreDiacritics) {
      formattedValue = removeDiacritics(formattedValue);
    }
    return formattedValue != null ? filterRegex.test(formattedValue.toString()) : false;
  };
};

export const GRID_MULTI_SELECT_COL_DEF: Omit<GridMultiSelectColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'multiSelect',
  display: 'flex',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  sortComparator: (v1, v2) => (v1?.length ?? 0) - (v2?.length ?? 0),
  renderCell: renderMultiSelectCell,
  renderEditCell: renderEditMultiSelectCell,
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
        const valueOption = valueOptions.find((option) => colDef.getOptionValue!(option) === v);
        return valueOption ? colDef.getOptionLabel!(valueOption) : String(v);
      })
      .join(separator);
  },
  filterOperators: getGridMultiSelectOperators(),
  getApplyQuickFilterFn: getGridMultiSelectQuickFilterFn,
  pastedValueParser: (value, row, column) => {
    const colDef = column as GridMultiSelectColDef;
    const valueOptions = getValueOptions(colDef) || [];
    const getOptionValue = colDef.getOptionValue!;
    const getOptionLabel = colDef.getOptionLabel!;
    const separator = colDef.separator ?? ', ';

    const pastedValues = value.split(separator).map((v: string) => v.trim());
    const validValues = pastedValues
      .map((v: string) => {
        const matchingOption = valueOptions.find(
          (option) => String(getOptionValue(option)) === v || getOptionLabel(option) === v,
        );
        return matchingOption ? getOptionValue(matchingOption) : null;
      })
      .filter((v) => v !== null);

    return validValues.length > 0 ? validValues : undefined;
  },
};
