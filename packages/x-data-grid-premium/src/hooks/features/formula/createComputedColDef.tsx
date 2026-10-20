import * as React from 'react';
import clsx from 'clsx';
import { warnOnce } from '@mui/x-internals/warning';
import {
  GRID_BOOLEAN_COL_DEF,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  GRID_NUMERIC_COL_DEF,
  GRID_STRING_COL_DEF,
  gridClasses,
} from '@mui/x-data-grid-pro';
import type {
  GridCellClassNamePropType,
  GridCellParams,
  GridColDef,
  GridColTypeDef,
  GridColumnHeaderClassNamePropType,
  GridComparatorFn,
  GridFilterOperator,
  GridRenderCellParams,
  GridValidRowModel,
  GridValueGetter,
} from '@mui/x-data-grid-pro';
import { GridFooterCell } from '@mui/x-data-grid-pro/internals';
import type { GridAggregationCellMeta } from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type {
  GridComputedColumnDefinition,
  GridComputedColumnType,
} from '../computedColumns/gridComputedColumnsInterfaces';
import { GridComputedErrorCell } from '../../../components/GridComputedErrorCell';
import { FORMULA_ERROR_CODES } from './engine';

const COMPUTED_COLUMN_TYPE_COL_DEFS: Record<GridComputedColumnType, GridColTypeDef> = {
  number: GRID_NUMERIC_COL_DEF,
  string: GRID_STRING_COL_DEF,
  boolean: GRID_BOOLEAN_COL_DEF,
  date: GRID_DATE_COL_DEF,
  dateTime: GRID_DATETIME_COL_DEF,
};

const FORMULA_ERROR_CODE_SET: ReadonlySet<unknown> = new Set(FORMULA_ERROR_CODES);

/**
 * The getters of a computed column. They are created once per evaluated
 * definition (formula + type): the cell-formula runtime compares `valueGetter`
 * identities to decide when the formulas reading a column must re-evaluate.
 */
export interface GridComputedColumnGetters {
  valueGetter: GridValueGetter;
  groupingValueGetter: NonNullable<GridColDef['groupingValueGetter']>;
  rowSpanValueGetter: NonNullable<GridColDef['rowSpanValueGetter']>;
}

/**
 * Computed cells hold their error as its code string (`#DIV/0!`), so the code
 * is what gets sorted, filtered, exported and copied.
 */
export function isComputedErrorValue(value: unknown): boolean {
  return typeof value === 'string' && FORMULA_ERROR_CODE_SET.has(value);
}

/**
 * Tells whether the evaluated result of a row is an error, as opposed to a text
 * result that happens to read like an error code. The value alone cannot tell
 * the two apart; the rendering asks the runtime, which memoized the result.
 * @param {GridValidRowModel} row The row of the cell.
 * @returns {boolean} Whether the result of the row is an error.
 */
export type GridComputedErrorRowPredicate = (row: GridValidRowModel) => boolean;

const IS_ERROR_ROW_BY_VALUE: GridComputedErrorRowPredicate = () => true;

function createNumberFormatter(definition: GridComputedColumnDefinition) {
  if (definition.type !== 'number' || definition.numberFormat === undefined) {
    return null;
  }
  try {
    return new Intl.NumberFormat(undefined, definition.numberFormat);
  } catch (error) {
    warnOnce(
      [
        `MUI X Data Grid: The \`numberFormat\` of the computed column "${definition.field}" is not a valid \`Intl.NumberFormat\` options object, so the values are rendered without it.`,
        error instanceof Error ? error.message : '',
      ].join('\n'),
    );
    return null;
  }
}

/**
 * Keeps the errors last in both directions — a plain `sortComparator` is
 * negated for the descending order, which would move them first — so the
 * comparator only receives values of the column type.
 * @param {GridComparatorFn} comparator The comparator of the values.
 * @param {number} errorsModifier `-1` to sort two error codes in descending order.
 * @param {number} valuesModifier `-1` to negate the comparator of the values.
 * @returns {GridComparatorFn} The comparator.
 */
function createErrorsLastComparator(
  comparator: GridComparatorFn,
  errorsModifier: number,
  valuesModifier: number,
): GridComparatorFn {
  return (value1, value2, cellParams1, cellParams2) => {
    const isError1 = isComputedErrorValue(value1);
    const isError2 = isComputedErrorValue(value2);
    if (isError1 || isError2) {
      if (isError1 && isError2) {
        return errorsModifier * (value1 as string).localeCompare(value2 as string);
      }
      return isError1 ? 1 : -1;
    }
    return valuesModifier * comparator(value1, value2, cellParams1, cellParams2);
  };
}

/**
 * Sorts with a `sortComparator`, negated for the descending order like the grid does.
 */
function createGetSortComparator(
  sortComparator: GridComparatorFn,
): NonNullable<GridColDef['getSortComparator']> {
  return (sortDirection) => {
    const modifier = sortDirection === 'desc' ? -1 : 1;
    return createErrorsLastComparator(sortComparator, modifier, modifier);
  };
}

/**
 * Sorts with a `getSortComparator`, whose comparators already follow the direction.
 */
function guardGetSortComparator(
  getSortComparator: NonNullable<GridColDef['getSortComparator']>,
): NonNullable<GridColDef['getSortComparator']> {
  return (sortDirection) => {
    const comparator = getSortComparator(sortDirection);
    if (!comparator) {
      return comparator;
    }
    return createErrorsLastComparator(comparator, sortDirection === 'desc' ? -1 : 1, 1);
  };
}

/**
 * The error codes bypass the formatter: the date formatters throw on anything but a `Date`.
 * A text column only bypasses it for the rows whose result is an error: a text
 * result that reads like an error code is formatted like any other text.
 */
function guardValueFormatter(
  valueFormatter: NonNullable<GridColDef['valueFormatter']>,
  type: GridComputedColumnType,
  isErrorRow: GridComputedErrorRowPredicate,
): NonNullable<GridColDef['valueFormatter']> {
  return (value, row, column, apiRef) =>
    isComputedErrorValue(value) && (type !== 'string' || isErrorRow(row))
      ? value
      : valueFormatter(value as never, row, column, apiRef);
}

/**
 * The operators of the non-text types expect values of their type — the date
 * operators call `getTime()` — so the error codes never reach them, not even
 * the null checks. An error is a value the cell shows, so it is not empty, as
 * in the text columns, which filter on the code like on any other text: only
 * `isNotEmpty` matches it.
 */
function createFilterOperators(
  type: GridComputedColumnType,
  filterOperators: readonly GridFilterOperator<any, any, any>[] | undefined,
): GridFilterOperator[] | undefined {
  if (type === 'string' || filterOperators === undefined) {
    return filterOperators as GridFilterOperator[] | undefined;
  }
  return filterOperators.map((operator) => {
    const matchesErrors = operator.value === 'isNotEmpty';
    return {
      ...operator,
      getApplyFilterFn: (filterItem, column) => {
        const applyFilterFn = operator.getApplyFilterFn(filterItem, column);
        if (!applyFilterFn) {
          return applyFilterFn;
        }
        return (value, row, colDef, apiRef) =>
          isComputedErrorValue(value) ? matchesErrors : applyFilterFn(value, row, colDef, apiRef);
      },
    };
  }) as GridFilterOperator[];
}

/**
 * The quick filter of the non-text types only matches values of their type
 * (the numeric one ignores a search that is not a number), so the error codes
 * are matched here: a computed cell is found by the text it shows. The quick
 * filter of the type only receives values of the type.
 */
function createGetApplyQuickFilterFn(
  type: GridComputedColumnType,
  typeGetApplyQuickFilterFn: GridColDef['getApplyQuickFilterFn'],
): GridColDef['getApplyQuickFilterFn'] {
  if (type === 'string') {
    return typeGetApplyQuickFilterFn;
  }
  return (value, colDef, apiRef) => {
    const typeApplyFn = typeGetApplyQuickFilterFn?.(value, colDef, apiRef) ?? null;
    const search = String(value ?? '').toLowerCase();
    const searchesErrors =
      search !== '' && FORMULA_ERROR_CODES.some((code) => code.toLowerCase().includes(search));
    if (!searchesErrors && typeApplyFn === null) {
      return null;
    }
    return (cellValue, row, column, api) => {
      if (isComputedErrorValue(cellValue)) {
        return searchesErrors && (cellValue as string).toLowerCase().includes(search);
      }
      return typeApplyFn ? typeApplyFn(cellValue, row, column, api) : false;
    };
  };
}

function createCellClassName(isErrorRow: GridComputedErrorRowPredicate) {
  return (params: GridCellParams) =>
    clsx(
      gridClasses['cell--computed'],
      isComputedErrorValue(params.value) &&
        isErrorRow(params.row) &&
        gridClasses['cell--computedError'],
    );
}

function getComputedHeaderClassName(invalid: boolean): string {
  return clsx(
    gridClasses['columnHeader--computed'],
    invalid && gridClasses['columnHeader--computedInvalid'],
  );
}

/**
 * The header of a computed column tells whether its formula is valid.
 */
export function withComputedHeaderClassName(baseColDef: GridColDef, invalid: boolean): GridColDef {
  return { ...baseColDef, headerClassName: getComputedHeaderClassName(invalid) };
}

/**
 * Creates the read-only column of a computed column definition,
 * without the `computedColDef` overrides.
 * @param {GridComputedColumnDefinition} definition The definition of the column.
 * @param {GridComputedColumnGetters} getters The getters bridging the column to the runtime.
 * @param {boolean} invalid Whether the formula of the definition is invalid.
 * @param {GridComputedErrorRowPredicate} isErrorRow Tells whether the result of a row is an error;
 * by default every value equal to an error code is one (the editor preview never renders cells).
 * @returns {GridColDef} The column.
 */
export function createComputedBaseColDef(
  definition: GridComputedColumnDefinition,
  getters: GridComputedColumnGetters,
  invalid: boolean = false,
  isErrorRow: GridComputedErrorRowPredicate = IS_ERROR_ROW_BY_VALUE,
): GridColDef {
  const typeColDef = COMPUTED_COLUMN_TYPE_COL_DEFS[definition.type] ?? GRID_STRING_COL_DEF;
  const numberFormatter = createNumberFormatter(definition);
  const typeValueFormatter = typeColDef.valueFormatter;
  const typeRenderCell = typeColDef.renderCell;
  const cellClassName = createCellClassName(isErrorRow);

  return {
    ...typeColDef,
    field: definition.field,
    headerName: definition.headerName,
    description: definition.description,
    computed: true,
    editable: false,
    pivotable: false,
    ...getters,
    // The errors bypass the formatter of the type: the date formatters throw on anything but a `Date`.
    valueFormatter: (value, row, column, apiRef) => {
      if (isComputedErrorValue(value)) {
        return value;
      }
      if (numberFormatter !== null && typeof value === 'number') {
        return numberFormatter.format(value);
      }
      return typeValueFormatter ? typeValueFormatter(value as never, row, column, apiRef) : value;
    },
    // The grid sorts with `getSortComparator`; `sortComparator` is for the code that reads it directly.
    sortComparator: createErrorsLastComparator(typeColDef.sortComparator!, 1, 1),
    getSortComparator: createGetSortComparator(typeColDef.sortComparator!),
    filterOperators: createFilterOperators(definition.type, typeColDef.filterOperators),
    getApplyQuickFilterFn: createGetApplyQuickFilterFn(
      definition.type,
      typeColDef.getApplyQuickFilterFn,
    ),
    cellClassName,
    headerClassName: getComputedHeaderClassName(invalid),
    // Returning `undefined` makes the cell render its formatted value.
    renderCell: (params: GridRenderCellParams & { aggregation?: GridAggregationCellMeta }) => {
      if (isComputedErrorValue(params.value) && isErrorRow(params.row)) {
        return <GridComputedErrorCell {...params} />;
      }
      // The aggregation wrapper only renders the footer cell of a column without
      // `renderCell`; this one takes over, as the boolean type renderer does.
      if (params.aggregation?.position === 'footer') {
        return <GridFooterCell {...params} />;
      }
      return typeRenderCell ? typeRenderCell(params) : undefined;
    },
  };
}

function mergeCellClassNames(
  base: GridCellClassNamePropType | undefined,
  override: GridCellClassNamePropType | undefined,
): GridCellClassNamePropType | undefined {
  if (override === undefined) {
    return base;
  }
  return (params) =>
    clsx(
      typeof base === 'function' ? base(params) : base,
      typeof override === 'function' ? override(params) : override,
    );
}

function mergeHeaderClassNames(
  base: GridColumnHeaderClassNamePropType | undefined,
  override: GridColumnHeaderClassNamePropType | undefined,
): GridColumnHeaderClassNamePropType | undefined {
  if (override === undefined) {
    return base;
  }
  return (params) =>
    clsx(
      typeof base === 'function' ? base(params) : base,
      typeof override === 'function' ? override(params) : override,
    );
}

/**
 * Wraps the functions of the overrides that receive the cell value, so that they
 * only receive values of the column type, as the ones of the base column do:
 * the errors are sorted last, rendered with the error cell and skipped by the filters.
 * The functions that only add to the cell (`cellClassName`, `colSpan`) are not wrapped.
 */
function guardOverrides(
  overrides: Partial<GridColDef>,
  definition: GridComputedColumnDefinition,
  isErrorRow: GridComputedErrorRowPredicate,
): Partial<GridColDef> {
  const guarded: Partial<GridColDef> = {};
  const {
    getSortComparator,
    sortComparator,
    valueFormatter,
    renderCell,
    filterOperators,
    getApplyQuickFilterFn,
  } = overrides;
  if (typeof sortComparator === 'function') {
    // For the code that reads `sortComparator` directly, as on the base column.
    guarded.sortComparator = createErrorsLastComparator(sortComparator, 1, 1);
  }
  if (typeof getSortComparator === 'function') {
    guarded.getSortComparator = guardGetSortComparator(getSortComparator);
  } else if (typeof sortComparator === 'function') {
    // The `getSortComparator` of the base column takes precedence over `sortComparator`.
    guarded.getSortComparator = createGetSortComparator(sortComparator);
  }
  if (typeof valueFormatter === 'function') {
    guarded.valueFormatter = guardValueFormatter(valueFormatter, definition.type, isErrorRow);
  }
  if (typeof renderCell === 'function') {
    guarded.renderCell = (params) => {
      if (isComputedErrorValue(params.value)) {
        if (isErrorRow(params.row)) {
          return <GridComputedErrorCell {...params} />;
        }
        // The grouping cell of a group of errors: returning `undefined` renders the code as text.
        if (params.rowNode.type !== 'leaf') {
          return undefined;
        }
      }
      return renderCell(params);
    };
  }
  if (Array.isArray(filterOperators)) {
    guarded.filterOperators = createFilterOperators(definition.type, filterOperators);
  }
  if (typeof getApplyQuickFilterFn === 'function') {
    guarded.getApplyQuickFilterFn = createGetApplyQuickFilterFn(
      definition.type,
      getApplyQuickFilterFn,
    );
  }
  return guarded;
}

/**
 * Resolves the `computedColDef` prop for one computed column.
 * @param {GridComputedColumnDefinition} definition The definition of the column.
 * @param {DataGridPremiumProcessedProps['computedColDef']} computedColDef The `computedColDef` prop.
 * @returns {Partial<GridColDef> | null} The overrides of the column, `null` when there are none.
 */
export function resolveComputedColDefOverrides(
  definition: GridComputedColumnDefinition,
  computedColDef: DataGridPremiumProcessedProps['computedColDef'],
): Partial<GridColDef> | null {
  const overrides =
    typeof computedColDef === 'function' ? computedColDef(definition) : computedColDef;
  if (process.env.NODE_ENV !== 'production' && overrides?.editable !== undefined) {
    warnOnce(
      [
        'MUI X Data Grid: The `editable` property of `computedColDef` is ignored: the cells of a computed column are never editable.',
        'To prevent users from editing a computed column, set `editable: false` on its definition in the `computedColumns` model.',
        'See https://mui.com/x/react-data-grid/computed-columns/#prevent-changes',
      ].join('\n'),
    );
  }
  return overrides ?? null;
}

/**
 * Compares two resolved overrides key by key, so that an inline `computedColDef`
 * with the same content does not re-create the column.
 * @param {Partial<GridColDef> | null} a The first overrides.
 * @param {Partial<GridColDef> | null} b The second overrides.
 * @returns {boolean} `true` when both have the same keys with the same values.
 */
export function areComputedColDefOverridesEqual(
  a: Partial<GridColDef> | null,
  b: Partial<GridColDef> | null,
): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  const aKeys = Object.keys(a) as (keyof GridColDef)[];
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }
  return aKeys.every((key) => Object.hasOwn(b, key) && Object.is(a[key], b[key]));
}

/**
 * Applies the `computedColDef` overrides on top of the base column.
 * The properties that make the column a computed column cannot be overridden:
 * the three getters are the only way to the evaluated value (the grid hands a
 * replacement `row[field]`, which a synthetic column never has).
 * @param {GridColDef} baseColDef The column without the overrides.
 * @param {GridComputedColumnDefinition} definition The definition of the column.
 * @param {Partial<GridColDef> | null} overrides The overrides resolved by `resolveComputedColDefOverrides()`.
 * @param {GridComputedErrorRowPredicate} isErrorRow Tells whether the result of a row is an error.
 * @returns {GridColDef} The column.
 */
export function applyComputedColDefOverrides(
  baseColDef: GridColDef,
  definition: GridComputedColumnDefinition,
  overrides: Partial<GridColDef> | null,
  isErrorRow: GridComputedErrorRowPredicate,
): GridColDef {
  if (overrides === null) {
    return baseColDef;
  }
  return {
    ...baseColDef,
    ...overrides,
    ...guardOverrides(overrides, definition, isErrorRow),
    field: baseColDef.field,
    type: baseColDef.type,
    computed: true,
    editable: false,
    allowFormulas: false,
    valueGetter: baseColDef.valueGetter,
    valueSetter: undefined,
    groupingValueGetter: baseColDef.groupingValueGetter,
    rowSpanValueGetter: baseColDef.rowSpanValueGetter,
    cellClassName: mergeCellClassNames(baseColDef.cellClassName, overrides.cellClassName),
    headerClassName: mergeHeaderClassNames(baseColDef.headerClassName, overrides.headerClassName),
  } as GridColDef;
}
