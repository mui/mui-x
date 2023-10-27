import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridColumnLookup } from './gridColumnsInterfaces';

/**
 * Get the columns state
 * @category Columns
 */
export const gridColumnsStateSelector = (state: GridStateCommunity) => state.columns;

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
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
export const gridVisibleColumnDefinitionsSelector = createSelectorMemoized(
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
  (columns, columnVisibilityModel) =>
    columns.filter((column) => columnVisibilityModel[column.field] !== false),
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
