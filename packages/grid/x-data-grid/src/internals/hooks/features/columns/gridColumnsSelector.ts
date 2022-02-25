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
 * @category Columns
 */
export const gridColumnFieldsSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.all,
);

/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export const gridColumnLookupSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.lookup,
);

/**
 * Get the columns as an array.
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
 * @category Visible Columns
 */
export const gridColumnVisibilityModelSelector = createSelector(
  gridColumnsSelector,
  (columnsState) => columnsState.columnVisibilityModel,
);

/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
export const gridVisibleColumnDefinitionsSelector = createSelector(
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
  (columns, columnVisibilityModel) =>
    columns.filter((column) => columnVisibilityModel[column.field] !== false),
);

/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
export const gridVisibleColumnFieldsSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.map((column) => column.field),
);

/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
export const gridColumnPositionsSelector = createSelector(
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
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export const gridColumnsTotalWidthSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  (visibleColumns, positions) => {
    const colCount = visibleColumns.length;
    if (colCount === 0) {
      return 0;
    }
    return positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth;
  },
);

/**
 * Get the filterable columns as an array.
 * @category Columns
 */
export const gridFilterableColumnDefinitionsSelector = createSelector(
  gridColumnDefinitionsSelector,
  (columns) => columns.filter((col) => col.filterable),
);

/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
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
 * @category Visible Columns
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
 * Get the amount of visible columns.
 * @category Visible Columns
 * @deprecated Use the length of `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const visibleGridColumnsLengthSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.length,
);

/**
 * @category Visible Columns
 * @deprecated Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` instead.
 * @ignore - do not document.
 */
export const gridColumnsMetaSelector = createSelector(
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  (positions, totalWidth) => ({ totalWidth, positions }),
);
