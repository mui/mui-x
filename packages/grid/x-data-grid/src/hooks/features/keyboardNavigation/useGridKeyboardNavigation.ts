import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef/gridCheckboxSelectionColDef';
import { gridClasses } from '../../../constants/gridClasses';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../constants/gridDetailPanelToggleField';
import { GridRowEntry, GridRowId } from '../../../models';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';

function enrichPageRowsWithPinnedRows(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  rows: GridRowEntry[],
) {
  const pinnedRows = gridPinnedRowsSelector(apiRef) || {};

  return [...(pinnedRows.top || []), ...rows, ...(pinnedRows.bottom || [])];
}

/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */
export const useGridKeyboardNavigation = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode' | 'getRowId'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const initialCurrentPageRows = useGridVisibleRows(apiRef, props).rows;

  const currentPageRows = React.useMemo(
    () => enrichPageRowsWithPinnedRows(apiRef, initialCurrentPageRows),
    [apiRef, initialCurrentPageRows],
  );

  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   * TODO replace with apiRef.current.unstable_moveFocusToRelativeCell()
   */
  const goToCell = React.useCallback(
    (colIndex: number, rowId: GridRowId, closestColumnToUse: 'left' | 'right' = 'left') => {
      const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
      const nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);
      if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
        if (closestColumnToUse === 'left') {
          colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
        } else if (closestColumnToUse === 'right') {
          colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
        }
      }
      // `scrollToIndexes` requires a rowIndex relative to all visible rows.
      // Those rows do not include pinned rows, but pinned rows do not need scroll anyway.
      const rowIndexRelativeToAllRows = visibleSortedRows.findIndex((row) => row.id === rowId);
      logger.debug(`Navigating to cell row ${rowIndexRelativeToAllRows}, col ${colIndex}`);
      apiRef.current.scrollToIndexes({
        colIndex,
        rowIndex: rowIndexRelativeToAllRows,
      });
      const field = apiRef.current.getVisibleColumns()[colIndex].field;
      apiRef.current.setCellFocus(rowId, field);
    },
    [apiRef, logger],
  );

  const goToHeader = React.useCallback(
    (colIndex: number, event: React.SyntheticEvent<Element>) => {
      logger.debug(`Navigating to header col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex });
      const field = apiRef.current.getVisibleColumns()[colIndex].field;
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef, logger],
  );

  const getRowIdFromIndex = React.useCallback(
    (rowIndex: number) => {
      return currentPageRows[rowIndex].id;
    },
    [currentPageRows],
  );

  const handleCellNavigationKeyDown = React.useCallback<GridEventListener<'cellNavigationKeyDown'>>(
    (params, event) => {
      const dimensions = apiRef.current.getRootDimensions();
      if (currentPageRows.length === 0 || !dimensions) {
        return;
      }

      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();

      const colIndexBefore = (params as GridCellParams).field
        ? apiRef.current.getColumnIndex((params as GridCellParams).field)
        : 0;
      const rowIndexBefore = currentPageRows.findIndex((row) => row.id === params.id);
      const firstRowIndexInPage = 0;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown':
        case 'Enter': {
          // TODO v6: Remove Enter case because `cellNavigationKeyDown` is not fired by the new editing API
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore + 1));
          }
          break;
        }

        case 'ArrowUp': {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore - 1));
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'ArrowRight': {
          if (colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }
          break;
        }

        case 'ArrowLeft': {
          if (colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }

        case 'Tab': {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore), 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }
          break;
        }

        case ' ': {
          const field = (params as GridCellParams).field;
          if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            break;
          }
          const colDef = (params as GridCellParams).colDef;
          if (colDef && colDef.type === 'treeDataGroup') {
            break;
          }
          if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)),
            );
          }
          break;
        }

        case 'PageDown': {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)),
            );
          }
          break;
        }

        case 'PageUp': {
          // Go to the first row before going to header
          const nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);
          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(nextRowIndex));
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'Home': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, getRowIdFromIndex(firstRowIndexInPage));
          } else {
            goToCell(firstColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }

        case 'End': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, getRowIdFromIndex(lastRowIndexInPage));
          } else {
            goToCell(lastColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [apiRef, currentPageRows, goToCell, goToHeader, getRowIdFromIndex],
  );

  const handleColumnHeaderKeyDown = React.useCallback<GridEventListener<'columnHeaderKeyDown'>>(
    (params, event) => {
      const headerTitleNode = event.currentTarget.querySelector(
        `.${gridClasses.columnHeaderTitleContainerContent}`,
      );
      const isFromInsideContent =
        !!headerTitleNode && headerTitleNode.contains(event.target as Node | null);

      if (isFromInsideContent && params.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
        // There is one exception for the checkBoxHeader
        return;
      }

      const dimensions = apiRef.current.getRootDimensions();
      if (!dimensions) {
        return;
      }

      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
      const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
      const firstRowIndexInPage = 0;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          if (firstRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(firstRowIndexInPage));
          }
          break;
        }

        case 'ArrowRight': {
          if (colIndexBefore < lastColIndex) {
            goToHeader(colIndexBefore + 1, event);
          }
          break;
        }

        case 'ArrowLeft': {
          if (colIndexBefore > firstColIndex) {
            goToHeader(colIndexBefore - 1, event);
          }
          break;
        }

        case 'PageDown': {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(
                Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage),
              ),
            );
          }
          break;
        }

        case 'Home': {
          goToHeader(firstColIndex, event);
          break;
        }

        case 'End': {
          goToHeader(lastColIndex, event);
          break;
        }

        case 'Enter': {
          if (event.ctrlKey || event.metaKey) {
            apiRef.current.toggleColumnMenu(params.field);
          }
          break;
        }

        case ' ': {
          // prevent Space event from scrolling
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [apiRef, currentPageRows, goToCell, goToHeader, getRowIdFromIndex],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      // Ignore portal
      if (!event.currentTarget.contains(event.target as Element)) {
        return;
      }

      // Get the most recent params because the cell mode may have changed by another listener
      const cellParams = apiRef.current.getCellParams(params.id, params.field);

      if (cellParams.cellMode !== GridCellModes.Edit && isNavigationKey(event.key)) {
        apiRef.current.publishEvent('cellNavigationKeyDown', cellParams, event);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, 'cellNavigationKeyDown', handleCellNavigationKeyDown);
  useGridApiEventHandler(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};
