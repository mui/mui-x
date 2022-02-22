import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridColumnLookup } from './gridColumnsInterfaces';

/**
 * @category Columns
 * @deprecated Use the selector returning exactly the value you are looking for.
 * @ignore - do not document.
 * TODO: Rename `gridColumnsStateSelector`
 */
export const gridColumnsSelector = (state: GridStateCommunity) => state.columns;

/**
 * Get the field of each column.
 * This array contains the hidden columns.
 * @category Columns
 */
export const gridColumnFieldsSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.all,
);

/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * This lookup contains the hidden columns.
 * @category Columns
 */
export const gridColumnLookupSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.lookup,
);

/**
 * Get the columns as an array.
 * This array contains the hidden columns.
 * @category Columns
 */
export const gridColumnDefinitionsSelector = createSelector(
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
  (allFields, lookup) => allFields.map((field) => lookup[field]),
);

/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @¢category Columns
 */
export const gridColumnVisibilityModelSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.columnVisibilityModel,
);

/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export const gridVisibleColumnDefinitionsSelector = createSelector(
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
  (columns, columnVisibilityModel) =>
    columns.filter((column) => columnVisibilityModel[column.field] !== false),
);

/**
 * Get the field of each visible column.
 * @category Columns
 */
export const gridVisibleColumnFieldsSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.map((column) => column.field),
);

/**
 * Get the total width of the visible columns and the position of each visible column.
 * @category Columns
 */
export const gridColumnsMetaSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => {
    const positions: number[] = [];

    const totalWidth = visibleColumns.reduce((acc, curCol) => {
      positions.push(acc);
      return acc + curCol.computedWidth;
    }, 0);

    return { totalWidth, positions };
  },
);

/**
 * Get the filterable columns as an array.
 * This array contains the hidden columns.
 * @category Columns
 */
export const gridFilterableColumnDefinitionsSelector = createSelector(
  gridColumnDefinitionsSelector,
  (columns) => columns.filter((col) => col.filterable),
);

/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * This lookup contains the hidden columns.
 * @category Columns
 */
export const gridFilterableColumnLookupSelector = createSelector(
  gridColumnDefinitionsSelector,
  (columns) =>
    columns.reduce((acc, col) => {
      if (col.filterable) {
        acc[col.field] = col;
      }
      return acc;
    }, {} as GridColumnLookup),
);

/**
 * Get the amount of visible columns.
 * @category Columns
 */
export const gridVisibleColumnLengthSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.length,
);

/**
 * Get the summed width of all the visible columns.
 * @category Columns
 */
export const gridColumnsTotalWidthSelector = createSelector(
  gridColumnsMetaSelector,
  (meta) => meta.totalWidth,
);

/**
 * @category Columns
 * @deprecated Use `gridColumnFieldsSelector` instead.
 * @ignore - do not document.
 */
export const allGridColumnsFieldsSelector = gridColumnFieldsSelector;

/**
 * @category Columns
 * @deprecated Use `gridColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const allGridColumnsSelector = gridColumnDefinitionsSelector;

/**
 * @category Columns
 * @deprecated Use `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const visibleGridColumnsSelector = gridVisibleColumnDefinitionsSelector;

/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const filterableGridColumnsSelector = gridFilterableColumnDefinitionsSelector;

/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnLookupSelector` instead (not the same return format).
 * @ignore - do not document.
 */
export const filterableGridColumnsIdsSelector = createSelector(
  gridFilterableColumnDefinitionsSelector,
  (columns) => columns.map((col) => col.field),
);

/**
 * @category Columns
 * @deprecated Use `gridVisibleColumnLengthSelector` instead.
 * @ignore - do not document.
 */
export const visibleGridColumnsLengthSelector = gridVisibleColumnLengthSelector;
