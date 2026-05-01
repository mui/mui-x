import {
  createSelector,
  createSelectorMemoized,
  createRootSelector,
} from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import {
  type GridColumnLookup,
  type GridPinnedColumnFields,
  EMPTY_PINNED_COLUMN_FIELDS,
} from './gridColumnsInterfaces';
import { gridListColumnSelector, gridListViewSelector } from '../listView';

/**
 * Get the columns state
 * @category Columns
 */
export const gridColumnsStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.columns,
);

/**
 * Get an array of column fields in the order rendered on screen.
 * @category Columns
 */
export const gridColumnFieldsSelector = createSelector(
  gridColumnsStateSelector,
  (columnsState) => columnsState.orderedFields,
);

/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export const gridColumnLookupSelector = createSelector(
  gridColumnsStateSelector,
  (columnsState) => columnsState.lookup,
);

/**
 * Get an array of column definitions in the order rendered on screen..
 * @category Columns
 */
export const gridColumnDefinitionsSelector = createSelectorMemoized(
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
  (allFields, lookup) => allFields.map((field) => lookup[field]),
);

/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
export const gridColumnVisibilityModelSelector = createSelector(
  gridColumnsStateSelector,
  (columnsState) => columnsState.columnVisibilityModel,
);

/**
 * Get the "initial" column visibility model, containing the visibility status of each column.
 * It is updated when the `columns` prop is updated or when `updateColumns` API method is called.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
export const gridInitialColumnVisibilityModelSelector = createSelector(
  gridColumnsStateSelector,
  (columnsState) => columnsState.initialColumnVisibilityModel,
);

/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
export const gridVisibleColumnDefinitionsSelector = createSelectorMemoized(
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
  gridListViewSelector,
  gridListColumnSelector,
  (columns, columnVisibilityModel, listView, listColumn) =>
    listView && listColumn
      ? [listColumn]
      : columns.filter((column) => columnVisibilityModel[column.field] !== false),
);

/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
export const gridVisibleColumnFieldsSelector = createSelectorMemoized(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.map((column) => column.field),
);

/**
 * Get the visible pinned columns model.
 * @category Visible Columns
 */
export const gridPinnedColumnsSelector = createRootSelector(
  (state: GridStateCommunity) => state.pinnedColumns,
);

/**
 * Get all existing pinned columns. Place the columns on the side that depends on the rtl state.
 * @category Pinned Columns
 * @ignore - Do not document
 */
export const gridExistingPinnedColumnSelector = createSelectorMemoized(
  gridPinnedColumnsSelector,
  gridColumnFieldsSelector,
  (model, orderedFields) => filterMissingColumns(model, orderedFields),
);

/**
 * Get the visible pinned columns.
 * @category Visible Columns
 */
export const gridVisiblePinnedColumnDefinitionsSelector = createSelectorMemoized(
  gridColumnsStateSelector,
  gridPinnedColumnsSelector,
  gridVisibleColumnFieldsSelector,
  gridListViewSelector,
  (columnsState, model, visibleColumnFields, listView) => {
    if (listView) {
      return EMPTY_PINNED_COLUMN_FIELDS;
    }
    const visiblePinnedFields = filterMissingColumns(model, visibleColumnFields);
    const visiblePinnedColumns = {
      left: visiblePinnedFields.left.map((field) => columnsState.lookup[field]),
      right: visiblePinnedFields.right.map((field) => columnsState.lookup[field]),
    };
    return visiblePinnedColumns;
  },
);

function filterMissingColumns(pinnedColumns: GridPinnedColumnFields, columns: string[]) {
  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return EMPTY_PINNED_COLUMN_FIELDS;
  }

  if (pinnedColumns.left?.length === 0 && pinnedColumns.right?.length === 0) {
    return EMPTY_PINNED_COLUMN_FIELDS;
  }

  const filter = (newPinnedColumns: string[] | undefined, remainingColumns: string[]) => {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }
    return newPinnedColumns.filter((field) => remainingColumns.includes(field));
  };

  const leftPinnedColumns = filter(pinnedColumns.left, columns);
  const columnsWithoutLeftPinnedColumns = columns.filter(
    (field) => !leftPinnedColumns.includes(field),
  );
  const rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);

  return { left: leftPinnedColumns, right: rightPinnedColumns };
}

/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
export const gridColumnPositionsSelector = createSelectorMemoized(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => {
    const positions: number[] = [];
    let currentPosition = 0;

    for (let i = 0; i < visibleColumns.length; i += 1) {
      positions.push(currentPosition);
      currentPosition += visibleColumns[i].computedWidth;
    }

    return positions;
  },
);

/**
 * Get the filterable columns as an array.
 * @category Columns
 */
export const gridFilterableColumnDefinitionsSelector = createSelectorMemoized(
  gridColumnDefinitionsSelector,
  (columns) => columns.filter((col) => col.filterable),
);

/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export const gridFilterableColumnLookupSelector = createSelectorMemoized(
  gridColumnDefinitionsSelector,
  (columns) =>
    columns.reduce<GridColumnLookup>((acc, col) => {
      if (col.filterable) {
        acc[col.field] = col;
      }
      return acc;
    }, {}),
);

/**
 * Checks if some column has a colSpan field.
 * @category Columns
 * @ignore - Do not document
 */
export const gridHasColSpanSelector = createSelectorMemoized(
  gridColumnDefinitionsSelector,
  (columns) => columns.some((column) => column.colSpan !== undefined),
);
