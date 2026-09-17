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
  GridComparatorFn,
  GridFilterOperator,
  GridValueGetter,
} from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type {
  GridComputedColumnDefinition,
  GridComputedColumnType,
} from '../computedColumns/gridComputedColumnsInterfaces';
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

function createNumberFormatter(definition: GridComputedColumnDefinition) {
  if (definition.type !== 'number' || definition.numberFormat === undefined) {
    return null;
  }
  try {
    return new Intl.NumberFormat(undefined, definition.numberFormat);
  } catch (error) {
    warnOnce([
      `MUI X Data Grid: The \`numberFormat\` of the computed column "${definition.field}" is not a valid \`Intl.NumberFormat\` options object, so the values are rendered without it.`,
      error instanceof Error ? error.message : '',
    ]);
    return null;
  }
}

/**
 * Keeps the errors last in both directions — a plain `sortComparator` is
 * negated for the descending order, which would move them first.
 */
function createGetSortComparator(
  typeColDef: GridColTypeDef,
): NonNullable<GridColDef['getSortComparator']> {
  return (sortDirection) => {
    const modifier = sortDirection === 'desc' ? -1 : 1;
    const typeComparator = typeColDef.sortComparator!;
    const comparator: GridComparatorFn = (value1, value2, cellParams1, cellParams2) => {
      const isError1 = isComputedErrorValue(value1);
      const isError2 = isComputedErrorValue(value2);
      if (isError1 || isError2) {
        if (isError1 && isError2) {
          return modifier * (value1 as string).localeCompare(value2 as string);
        }
        return isError1 ? 1 : -1;
      }
      return modifier * typeComparator(value1, value2, cellParams1, cellParams2);
    };
    return comparator;
  };
}

/**
 * The operators of the non-text types expect values of their type — the date
 * operators call `getTime()` — so the error codes never reach them.
 * Text columns filter on the code like on any other text.
 */
function createFilterOperators(
  type: GridComputedColumnType,
  typeColDef: GridColTypeDef,
): GridFilterOperator[] | undefined {
  if (type === 'string' || typeColDef.filterOperators === undefined) {
    return typeColDef.filterOperators as GridFilterOperator[] | undefined;
  }
  return typeColDef.filterOperators.map((operator) => ({
    ...operator,
    getApplyFilterFn: (filterItem, column) => {
      const applyFilterFn = operator.getApplyFilterFn(filterItem, column);
      if (!applyFilterFn) {
        return applyFilterFn;
      }
      return (value, row, colDef, apiRef) =>
        isComputedErrorValue(value) ? false : applyFilterFn(value, row, colDef, apiRef);
    },
  })) as GridFilterOperator[];
}

/**
 * The quick filter of the non-text types only matches values of their type
 * (the numeric one ignores a search that is not a number), so the error codes
 * are matched here: a computed cell is found by the text it shows.
 */
function createGetApplyQuickFilterFn(
  type: GridComputedColumnType,
  typeColDef: GridColTypeDef,
): GridColDef['getApplyQuickFilterFn'] {
  const typeGetApplyQuickFilterFn = typeColDef.getApplyQuickFilterFn;
  if (type === 'string') {
    return typeGetApplyQuickFilterFn;
  }
  return (value, colDef, apiRef) => {
    const typeApplyFn = typeGetApplyQuickFilterFn?.(value, colDef, apiRef) ?? null;
    const search = String(value ?? '').toLowerCase();
    if (search === '' || !FORMULA_ERROR_CODES.some((code) => code.toLowerCase().includes(search))) {
      return typeApplyFn;
    }
    return (cellValue, row, column, api) => {
      if (isComputedErrorValue(cellValue)) {
        return (cellValue as string).toLowerCase().includes(search);
      }
      return typeApplyFn ? typeApplyFn(cellValue, row, column, api) : false;
    };
  };
}

const computedCellClassName = (params: GridCellParams) =>
  clsx(
    gridClasses['cell--computed'],
    isComputedErrorValue(params.value) && gridClasses['cell--computedError'],
  );

/**
 * Creates the read-only column of a computed column definition,
 * without the `computedColDef` overrides.
 */
export function createComputedBaseColDef(
  definition: GridComputedColumnDefinition,
  getters: GridComputedColumnGetters,
): GridColDef {
  const typeColDef = COMPUTED_COLUMN_TYPE_COL_DEFS[definition.type] ?? GRID_STRING_COL_DEF;
  const numberFormatter = createNumberFormatter(definition);
  const typeValueFormatter = typeColDef.valueFormatter;
  const typeRenderCell = typeColDef.renderCell;

  const colDef: GridColDef = {
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
    getSortComparator: createGetSortComparator(typeColDef),
    filterOperators: createFilterOperators(definition.type, typeColDef),
    getApplyQuickFilterFn: createGetApplyQuickFilterFn(definition.type, typeColDef),
    cellClassName: computedCellClassName,
  };

  if (typeRenderCell) {
    // Returning `undefined` makes the cell render its formatted value.
    colDef.renderCell = (params) =>
      isComputedErrorValue(params.value) ? undefined : typeRenderCell(params);
  }

  return colDef;
}

function mergeCellClassNames(
  override: GridCellClassNamePropType | undefined,
): GridCellClassNamePropType {
  if (override === undefined) {
    return computedCellClassName;
  }
  return (params) =>
    clsx(
      computedCellClassName(params),
      typeof override === 'function' ? override(params) : override,
    );
}

/**
 * Applies the `computedColDef` prop on top of the base column.
 * The properties that make the column a computed column cannot be overridden.
 */
export function applyComputedColDefOverrides(
  baseColDef: GridColDef,
  definition: GridComputedColumnDefinition,
  computedColDef: DataGridPremiumProcessedProps['computedColDef'],
): GridColDef {
  const overrides =
    typeof computedColDef === 'function' ? computedColDef(definition) : computedColDef;
  if (overrides == null) {
    return baseColDef;
  }
  return {
    ...baseColDef,
    ...overrides,
    field: baseColDef.field,
    type: baseColDef.type,
    computed: true,
    editable: false,
    allowFormulas: false,
    valueGetter: baseColDef.valueGetter,
    valueSetter: undefined,
    cellClassName: mergeCellClassNames(overrides.cellClassName),
  } as GridColDef;
}
