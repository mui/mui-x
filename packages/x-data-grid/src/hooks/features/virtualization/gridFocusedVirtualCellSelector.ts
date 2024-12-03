import { createSelectorMemoized } from '../../../utils/createSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridRenderContextSelector } from './gridVirtualizationSelectors';
import { gridFocusCellSelector } from '../focus';
import { gridVisibleRowsSelector } from '../pagination';
import { gridRowsLookupSelector } from '../rows';

export const gridFocusedVirtualCellSelector = createSelectorMemoized(
  gridRenderContextSelector,
  gridFocusCellSelector,
  gridVisibleColumnDefinitionsSelector,
  gridVisibleRowsSelector,
  gridRowsLookupSelector,
  (renderContext, focusedCell, visibleColumns, currentPage, rows) => {
    if (!focusedCell) {
      return null;
    }

    const row = rows[focusedCell.id];
    if (!row) {
      return null;
    }

    const rowIndex = currentPage.rowToIndexMap.get(row);

    if (rowIndex === undefined) {
      return null;
    }

    const columnIndex = visibleColumns.findIndex((column) => column.field === focusedCell.field);

    if (columnIndex === -1) {
      return null;
    }

    const isFocusedCellInContext =
      rowIndex >= renderContext.firstRowIndex &&
      rowIndex <= renderContext.lastRowIndex &&
      columnIndex >= renderContext.firstColumnIndex &&
      columnIndex <= renderContext.lastColumnIndex;

    if (isFocusedCellInContext) {
      return null;
    }

    return {
      ...focusedCell,
      rowIndex,
      columnIndex,
    };
  },
);
