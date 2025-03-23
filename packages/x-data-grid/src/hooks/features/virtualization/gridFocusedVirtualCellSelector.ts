import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridRenderContextSelector } from './gridVirtualizationSelectors';
import { gridFocusCellSelector } from '../focus';
import { gridVisibleRowsSelector } from '../pagination';

const gridIsFocusedCellOutOfContext = createSelector(
  gridFocusCellSelector,
  gridRenderContextSelector,
  gridVisibleRowsSelector,
  gridVisibleColumnDefinitionsSelector,
  (focusedCell, renderContext, currentPage, visibleColumns) => {
    if (!focusedCell) {
      return false;
    }

    const rowIndex = currentPage.rowIdToIndexMap.get(focusedCell.id);
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
  gridIsFocusedCellOutOfContext,
  gridVisibleColumnDefinitionsSelector,
  gridVisibleRowsSelector,
  gridFocusCellSelector,
  (isFocusedCellOutOfRenderContext, visibleColumns, currentPage, focusedCell) => {
    if (!isFocusedCellOutOfRenderContext) {
      return null;
    }

    const rowIndex = currentPage.rowIdToIndexMap.get(focusedCell!.id);

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
