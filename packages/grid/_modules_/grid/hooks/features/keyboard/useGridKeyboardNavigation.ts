import * as React from 'react';
import { GridEvents, GridEventListener } from '../../../models/events';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { visibleGridColumnsLengthSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';

/**
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * @requires useGridFilter (state)
 * @requires useGridColumns (state, method)
 * @requires useGridRows (state, method)
 * @requires useGridSorting (method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 */
export const useGridKeyboardNavigation = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination' | 'paginationMode'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const colCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const visibleSortedRows = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  const currentPage = useCurrentPageRows(apiRef, props);

  const goToCell = React.useCallback(
    (colIndex: number, rowIndex: number) => {
      logger.debug(`Navigating to cell row ${rowIndex}, col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex, rowIndex });
      const field = apiRef.current.getVisibleColumns()[colIndex].field;
      const node = visibleSortedRows[rowIndex];
      apiRef.current.setCellFocus(node.id, field);
    },
    [apiRef, logger, visibleSortedRows],
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
      event.preventDefault();
      const dimensions = apiRef.current.getRootDimensions();
      if (!currentPage.range || !dimensions) {
        return;
      }

      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
      const colIndexBefore = (params as GridCellParams).field
        ? apiRef.current.getColumnIndex((params as GridCellParams).field)
        : 0;
      const rowIndexBefore = visibleSortedRows.findIndex((row) => row.id === params.id);
      const firstRowIndexInPage = currentPage.range.firstRowIndex;
      const lastRowIndexInPage = currentPage.range.lastRowIndex;
      const firstColIndex = 0;
      const lastColIndex = colCount - 1;

      // eslint-disable-next-line default-case
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
            goToCell(colIndexBefore + 1, rowIndexBefore);
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
            goToCell(colIndexBefore - 1, rowIndexBefore);
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, rowIndexBefore);
          }
          break;
        }

        case 'PageDown':
        case ' ': {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage),
            );
          }
          break;
        }

        case 'PageUp': {
          if (rowIndexBefore - viewportPageSize >= firstRowIndexInPage) {
            goToCell(colIndexBefore, rowIndexBefore - viewportPageSize);
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
      }
    },
    [apiRef, visibleSortedRows, colCount, currentPage, goToCell, goToHeader],
  );

  const handleColumnHeaderNavigationKeyDown = React.useCallback<
    GridEventListener<GridEvents.columnHeaderNavigationKeyDown>
  >(
    (params, event) => {
      event.preventDefault();
      const dimensions = apiRef.current.getRootDimensions();
      if (!dimensions) {
        return;
      }

      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
      const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
      const firstRowIndexInPage = currentPage.range?.firstRowIndex ?? null;
      const lastRowIndexInPage = currentPage.range?.lastRowIndex ?? null;
      const firstColIndex = 0;
      const lastColIndex = colCount - 1;

      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'ArrowDown':
        case 'Enter': {
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
      }
    },
    [apiRef, colCount, currentPage, goToCell, goToHeader],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellNavigationKeyDown, handleCellNavigationKeyDown);
  useGridApiEventHandler(
    apiRef,
    GridEvents.columnHeaderNavigationKeyDown,
    handleColumnHeaderNavigationKeyDown,
  );
};
