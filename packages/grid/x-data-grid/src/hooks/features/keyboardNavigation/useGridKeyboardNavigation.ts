import * as React from 'react';
import { GridEvents, GridEventListener } from '../../../models/events';
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
  props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const currentPage = useGridVisibleRows(apiRef, props);

  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   */
  const goToCell = React.useCallback(
    (colIndex: number, rowIndex: number, closestColumnToUse: 'left' | 'right' = 'left') => {
      const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
      const rowId = visibleSortedRows[rowIndex]?.id;
      const nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);
      if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
        if (closestColumnToUse === 'left') {
          colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
        } else if (closestColumnToUse === 'right') {
          colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
        }
      }
      logger.debug(`Navigating to cell row ${rowIndex}, col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex, rowIndex });
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

  const handleCellNavigationKeyDown = React.useCallback<
    GridEventListener<GridEvents.cellNavigationKeyDown>
  >(
    (params, event) => {
      const dimensions = apiRef.current.getRootDimensions();
      if (!currentPage.range || !dimensions) {
        return;
      }

      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
      const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
      const colIndexBefore = (params as GridCellParams).field
        ? apiRef.current.getColumnIndex((params as GridCellParams).field)
        : 0;
      const rowIndexBefore = visibleSortedRows.findIndex((row) => row.id === params.id);
      const firstRowIndexInPage = currentPage.range.firstRowIndex;
      const lastRowIndexInPage = currentPage.range.lastRowIndex;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown':
        case 'Enter': {
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, rowIndexBefore + 1);
          }
          break;
        }

        case 'ArrowUp': {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, rowIndexBefore - 1);
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'ArrowRight': {
          if (colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, rowIndexBefore, 'right');
          }
          break;
        }

        case 'ArrowLeft': {
          if (colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, rowIndexBefore);
          }
          break;
        }

        case 'Tab': {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, rowIndexBefore, 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, rowIndexBefore, 'right');
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
              Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage),
            );
          }
          break;
        }

        case 'PageDown': {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage),
            );
          }
          break;
        }

        case 'PageUp': {
          // Go to the first row before going to header
          const nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);
          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, nextRowIndex);
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'Home': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, firstRowIndexInPage);
          } else {
            goToCell(firstColIndex, rowIndexBefore);
          }
          break;
        }

        case 'End': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, lastRowIndexInPage);
          } else {
            goToCell(lastColIndex, rowIndexBefore);
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
    [apiRef, currentPage, goToCell, goToHeader],
  );

  const handleColumnHeaderKeyDown = React.useCallback<
    GridEventListener<GridEvents.columnHeaderKeyDown>
  >(
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
      const firstRowIndexInPage = currentPage.range?.firstRowIndex ?? null;
      const lastRowIndexInPage = currentPage.range?.lastRowIndex ?? null;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          if (firstRowIndexInPage !== null) {
            goToCell(colIndexBefore, firstRowIndexInPage);
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
              Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage),
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
    [apiRef, currentPage, goToCell, goToHeader],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      // Ignore portal
      if (!event.currentTarget.contains(event.target as Element)) {
        return;
      }

      // Get the most recent params because the cell mode may have changed by another listener
      const cellParams = apiRef.current.getCellParams(params.id, params.field);

      if (cellParams.cellMode !== GridCellModes.Edit && isNavigationKey(event.key)) {
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, cellParams, event);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellNavigationKeyDown, handleCellNavigationKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
