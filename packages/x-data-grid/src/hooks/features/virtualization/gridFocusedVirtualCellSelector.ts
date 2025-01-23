import { createSelector } from 'reselect';
import { createSelectorMemoized } from '../../../utils/createSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridRenderContextSelector } from './gridVirtualizationSelectors';
import { gridFocusCellSelector } from '../focus';
import { gridVisibleRowsSelector } from '../pagination';
import { gridRowsLookupSelector } from '../rows';

const gridIsFocusedCellOutOfContex = createSelector(
  gridFocusCellSelector,
  gridRenderContextSelector,
  gridVisibleRowsSelector,
  gridVisibleColumnDefinitionsSelector,
  gridRowsLookupSelector,
  (focusedCell, renderContext, currentPage, visibleColumns, rows) => {
    if (!focusedCell) {
      return false;
    }

    const row = rows[focusedCell.id];
    if (!row) {
      return false;
    }

    const rowIndex = currentPage.rowToIndexMap.get(row);
    const columnIndex = visibleColumns
      .slice(renderContext.firstColumnIndex, renderContext.lastColumnIndex)
      .findIndex((column) => column.field === focusedCell.field);

    const isInRenderContext =
      rowIndex !== undefined &&
      columnIndex !== -1 &&
      rowIndex >= renderContext.firstRowIndex &&
      rowIndex <= renderContext.lastRowIndex;

    return !isInRenderContext;
  },
);

export const gridFocusedVirtualCellSelector = createSelectorMemoized(
  gridIsFocusedCellOutOfContex,
  gridVisibleColumnDefinitionsSelector,
  gridVisibleRowsSelector,
  gridRowsLookupSelector,
  gridFocusCellSelector,
  (isFocusedCellOutOfRenderContext, visibleColumns, currentPage, rows, focusedCell) => {
    if (!isFocusedCellOutOfRenderContext) {
      return null;
    }

    const row = rows[focusedCell!.id];
    if (!row) {
      return null;
    }

    const rowIndex = currentPage.rowToIndexMap.get(row);

    if (rowIndex === undefined) {
      return null;
    }

    const columnIndex = visibleColumns.findIndex((column) => column.field === focusedCell!.field);

    if (columnIndex === -1) {
      return null;
    }

    return {
      ...focusedCell,
      rowIndex,
      columnIndex,
    };
  },
);
