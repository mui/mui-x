import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridColumnLookup } from './gridColumnsInterfaces';
import { wrapWithWarningOnCall } from '../../../utils/warning';

/**
 * @category Columns
 * @deprecated Use the selector returning exactly the value you are looking for.
 * @ignore - do not document.
 * TODO v6: Rename `gridColumnsStateSelector`
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
    columns.reduce<GridColumnLookup>((acc, col) => {
      if (col.filterable) {
        acc[col.field] = col;
      }
      return acc;
    }, {}),
);

/**
 * @category Columns
 * @deprecated Use `gridColumnFieldsSelector` instead.
 * @ignore - do not document.
 */
export const allGridColumnsFieldsSelector = wrapWithWarningOnCall(gridColumnFieldsSelector, [
  'MUI: The method allGridColumnsFieldsSelector is deprecated and will be removed in the next major version.',
  'Use gridColumnFieldsSelector instead',
]);

/**
 * @category Columns
 * @deprecated Use `gridColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const allGridColumnsSelector = wrapWithWarningOnCall(gridColumnDefinitionsSelector, [
  'MUI: The method allGridColumnsSelector is deprecated and will be removed in the next major version.',
  'Use gridColumnDefinitionsSelector instead',
]);

/**
 * @category Visible Columns
 * @deprecated Use `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const visibleGridColumnsSelector = wrapWithWarningOnCall(
  gridVisibleColumnDefinitionsSelector,
  [
    'MUI: The method visibleGridColumnsSelector is deprecated and will be removed in the next major version.',
    'Use gridVisibleColumnDefinitionsSelector instead',
  ],
);

/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const filterableGridColumnsSelector = wrapWithWarningOnCall(
  gridFilterableColumnDefinitionsSelector,
  [
    'MUI: The method filterableGridColumnsSelector is deprecated and will be removed in the next major version.',
    'Use gridFilterableColumnDefinitionsSelector instead',
  ],
);

/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnLookupSelector` instead (not the same return format).
 * @ignore - do not document.
 */
export const filterableGridColumnsIdsSelector = wrapWithWarningOnCall(
  createSelector(gridFilterableColumnDefinitionsSelector, (columns) =>
    columns.map((col) => col.field),
  ),
  [
    'MUI: The method filterableGridColumnsIdsSelector is deprecated and will be removed in the next major version.',
    'Use gridFilterableColumnDefinitionsSelector instead.',
    'The return format is now a lookup, if you want to get the same output as before, use the following code:',
    '',
    'const lookup = gridFilterableColumnLookupSelector(apiRef);',
    'const fields = gridColumnFieldsSelector(apiRef).filter(field => lookup[field]);',
  ],
);

/**
 * Get the amount of visible columns.
 * @category Visible Columns
 * @deprecated Use the length of the array returned by `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export const visibleGridColumnsLengthSelector = wrapWithWarningOnCall(
  createSelector(gridVisibleColumnDefinitionsSelector, (visibleColumns) => visibleColumns.length),
  [
    'MUI: The method visibleGridColumnsLengthSelector is deprecated and will be removed in the next major version.',
    'Use the length of the array returned by gridVisibleColumnDefinitionsSelector instead.',
  ],
);

/**
 * @category Visible Columns
 * @deprecated Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` instead.
 * @ignore - do not document.
 */
export const gridColumnsMetaSelector = wrapWithWarningOnCall(
  createSelector(
    gridColumnPositionsSelector,
    gridColumnsTotalWidthSelector,
    (positions, totalWidth) => ({ totalWidth, positions }),
  ),
  [
    'MUI: The method gridColumnsMetaSelector is deprecated and will be removed in the next major version.',
    'Use gridColumnsTotalWidthSelector or gridColumnPositionsSelector instead',
  ],
);
