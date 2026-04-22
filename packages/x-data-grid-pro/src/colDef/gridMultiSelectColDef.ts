import type { GetApplyQuickFilterFn, GridMultiSelectColDef, ValueOptions } from '@mui/x-data-grid';
import {
  GRID_STRING_COL_DEF,
  getValueOptions,
  isMultiSelectColDef,
  escapeRegExp,
  isObject,
  gridRowIdSelector,
  removeDiacritics,
} from '@mui/x-data-grid/internals';
import { getGridMultiSelectOperators } from './gridMultiSelectOperators';
import { renderMultiSelectCell } from '../components/cell/GridMultiSelectCell';
import { renderEditMultiSelectCell } from '../components/cell/GridEditMultiSelectCell';

const isArrayOfObjects = (options: ValueOptions[]): options is Array<Record<string, any>> => {
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
  // @ts-ignore premium-only
  availableAggregationFunctions: ['size'],
  // @ts-ignore premium-only
  pivotable: false,
  // @ts-ignore premium-only
  chartable: false,
  // @ts-ignore premium-only
  groupingValueGetter: ((value: (string | number)[]) => {
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }
    return [...value].sort().join(',');
  }) as any,
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  sortComparator: (v1, v2) => {
    const empty1 = !v1 || v1.length === 0;
    const empty2 = !v2 || v2.length === 0;
    if (empty1 && empty2) {
      return 0;
    }
    if (empty1) {
      return -1;
    }
    if (empty2) {
      return 1;
    }
    return v1.join('').localeCompare(v2.join(''));
  },
  rowSpanValueGetter: ((value: (string | number)[]) => {
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }
    return [...value].sort().join(',');
  }) as any,
  renderCell: renderMultiSelectCell,
  renderEditCell: renderEditMultiSelectCell,
  valueFormatter: (value: (string | number)[], row, colDef, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);

    if (!isMultiSelectColDef(colDef)) {
      return '';
    }

    if (!Array.isArray(value) || value.length === 0) {
      return '';
    }

    const valueOptions = getValueOptions(colDef, { id: rowId, row });
    const separator = colDef.separator ?? ',';

    if (!valueOptions || !isArrayOfObjects(valueOptions)) {
      return value.map((v) => colDef.getOptionLabel!(v)).join(separator);
    }

    return value
      .map((v) => {
        const valueOption = valueOptions.find((option) => colDef.getOptionValue!(option) === v);
        return valueOption ? colDef.getOptionLabel!(valueOption) : String(v);
      })
      .join(separator);
  },
  filterOperators: getGridMultiSelectOperators(),
  getApplyQuickFilterFn: getGridMultiSelectQuickFilterFn,
  // @ts-ignore premium-only
  pastedValueParser: (value: string, _row: any, column: any) => {
    const colDef = column as GridMultiSelectColDef;
    const valueOptions = getValueOptions(colDef) || [];
    const getOptionValue = colDef.getOptionValue!;
    const getOptionLabel = colDef.getOptionLabel!;

    const pastedValues = value
      .split(/[,;\t\n|]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const validValues = pastedValues
      .map((v: string) => {
        const lower = v.toLowerCase();
        const matchingOption = valueOptions.find((option) => {
          const optValue = String(getOptionValue(option)).toLowerCase();
          const optLabel = String(getOptionLabel(option)).toLowerCase();
          return optValue === lower || optLabel === lower;
        });
        return matchingOption ? getOptionValue(matchingOption) : null;
      })
      .filter((v): v is string | number => v !== null);

    return validValues.length > 0 ? validValues : undefined;
  },
};
