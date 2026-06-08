import type { GetApplyQuickFilterFn, GridMultiSelectColDef, ValueOptions } from '@mui/x-data-grid';
import {
  GRID_STRING_COL_DEF,
  getValueOptions,
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

const multiSelectKey = (value: (string | number)[] | null | undefined) => {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  return [...value].sort().join(',');
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
  chartable: true,
  // @ts-ignore premium-only
  groupingValueGetter: ((value: (string | number)[]) => multiSelectKey(value)) as any,
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
    // Join with a separator so element boundaries are preserved — otherwise
    // ['a','bc'] and ['ab','c'] would both collapse to "abc" and compare equal.
    return v1.join(',').localeCompare(v2.join(','));
  },
  rowSpanValueGetter: ((value: (string | number)[]) => multiSelectKey(value)) as any,
  renderCell: renderMultiSelectCell,
  renderEditCell: renderEditMultiSelectCell,
  valueFormatter: (value: (string | number)[], row, rawColDef, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    // Always a multiSelect colDef here — this formatter only lives on `GRID_MULTI_SELECT_COL_DEF`.
    const colDef = rawColDef as GridMultiSelectColDef;

    if (!Array.isArray(value)) {
      // Non-array values can come from aggregation (e.g. size count). Pass through so
      // the aggregation cell renders the number; arrays go through the formatter below.
      return value == null ? '' : (value as any);
    }

    if (value.length === 0) {
      return '';
    }

    const valueOptions = getValueOptions(colDef, { id: rowId, row });
    const separator = colDef.separator ?? ',';

    if (!valueOptions || !isArrayOfObjects(valueOptions)) {
      return value.map((v) => colDef.getOptionLabel!(v)).join(separator);
    }

    const optionByValue = new Map(
      valueOptions.map((option) => [colDef.getOptionValue!(option), option]),
    );

    return value
      .map((v) => {
        const valueOption = optionByValue.get(v);
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

    // Split on the column's configured separator in addition to the common delimiters, so a
    // custom `separator` round-trips through copy/paste.
    const separator = colDef.separator ?? ',';
    const delimiters = separator ? `${escapeRegExp(separator)}|[,;\\t\\n|]` : '[,;\\t\\n|]';
    const pastedValues = value
      .split(new RegExp(`(?:${delimiters})+`))
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

    // Drop duplicates so a paste like "React, React" stores a single value.
    const uniqueValues = Array.from(new Set(validValues));
    return uniqueValues.length > 0 ? uniqueValues : undefined;
  },
};
