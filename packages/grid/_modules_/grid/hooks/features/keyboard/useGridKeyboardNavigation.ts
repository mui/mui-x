import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import {
  isArrowKeys,
  isEnterKey,
  isHomeOrEndKeys,
  isPageKeys,
  isSpaceKey,
  isTabKey,
} from '../../../utils/keyboardUtils';
import { visibleGridColumnsLengthSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';
import { clamp } from '../../../utils/utils';

const getNextCellIndexes = (key: string, indexes: GridCellIndexCoordinates) => {
  if (!isArrowKeys(key)) {
    throw new Error('MUI: The first argument (key) should be an arrow key code.');
  }

  switch (key) {
    case 'ArrowLeft':
      return { ...indexes, colIndex: indexes.colIndex - 1 };
    case 'ArrowRight':
      return { ...indexes, colIndex: indexes.colIndex + 1 };
    case 'ArrowUp':
      return { ...indexes, rowIndex: indexes.rowIndex - 1 };
    default:
      // Last option key === 'ArrowDown'
      return { ...indexes, rowIndex: indexes.rowIndex + 1 };
  }
};

const getNextColumnHeaderIndexes = (key: string, indexes: GridColumnHeaderIndexCoordinates) => {
  if (!isArrowKeys(key)) {
    throw new Error('MUI: The first argument (key) should be an arrow key code.');
  }

  switch (key) {
    case 'ArrowLeft':
      return { colIndex: indexes.colIndex - 1 };
    case 'ArrowRight':
      return { colIndex: indexes.colIndex + 1 };
    case 'ArrowDown':
      return null;
    default:
      // Last option key === 'ArrowUp'
      return { ...indexes };
  }
};

/**
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * @requires useGridColumns (state, method)
 * @requires useGridRows (state, method)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method)
 * @requires useGridScroll (method)
 */
export const useGridKeyboardNavigation = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination' | 'paginationMode'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const colCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const visibleSortedRows = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  const currentPage = useCurrentPageRows(apiRef, props);

  const mapKey = (event: React.KeyboardEvent) => {
    if (isEnterKey(event.key)) {
      return 'ArrowDown';
    }
    if (isTabKey(event.key)) {
      return event.shiftKey ? 'ArrowLeft' : 'ArrowRight';
    }
    return event.key;
  };

  const navigateCells = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      event.preventDefault();
      const dimensions = apiRef.current.getRootDimensions();

      if (!currentPage.range || !dimensions) {
        return;
      }

      const colIndex = apiRef.current.getColumnIndex(params.field);
      const rowIndex = visibleSortedRows.findIndex((row) => row.id === params.id);

      const key = mapKey(event);
      const isCtrlPressed = event.ctrlKey || event.metaKey || event.shiftKey;

      let nextCellIndexes: GridCellIndexCoordinates;
      if (isArrowKeys(key)) {
        nextCellIndexes = getNextCellIndexes(key, {
          colIndex,
          rowIndex,
        });
      } else if (isHomeOrEndKeys(key)) {
        const colIdx = key === 'Home' ? 0 : colCount - 1;

        if (!isCtrlPressed) {
          // we go to the current row, first col, or last col!
          nextCellIndexes = { colIndex: colIdx, rowIndex };
        } else {
          // In that case we go to first row, first col, or last row last col!
          let newRowIndex = 0;
          if (colIdx === 0) {
            newRowIndex = currentPage.range.firstRowIndex;
          } else {
            newRowIndex = currentPage.range.lastRowIndex;
          }
          nextCellIndexes = { colIndex: colIdx, rowIndex: newRowIndex };
        }
      } else if (isPageKeys(key) || isSpaceKey(key)) {
        const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
        const nextRowIndex =
          rowIndex +
          (key.indexOf('Down') > -1 || isSpaceKey(key) ? viewportPageSize : -1 * viewportPageSize);
        nextCellIndexes = { colIndex, rowIndex: nextRowIndex };
      } else {
        throw new Error('MUI: Key not mapped to navigation behavior.');
      }

      if (nextCellIndexes.rowIndex < currentPage.range.firstRowIndex) {
        const field = apiRef.current.getVisibleColumns()[nextCellIndexes.colIndex].field;
        apiRef.current.setColumnHeaderFocus(field, event);
        return;
      }

      nextCellIndexes.rowIndex = clamp(nextCellIndexes.rowIndex, 0, currentPage.range.lastRowIndex);
      nextCellIndexes.colIndex = clamp(nextCellIndexes.colIndex, 0, colCount - 1);
      logger.debug(
        `Navigating to next cell row ${nextCellIndexes.rowIndex}, col ${nextCellIndexes.colIndex}`,
      );
      apiRef.current.scrollToIndexes(nextCellIndexes);
      const field = apiRef.current.getVisibleColumns()[nextCellIndexes.colIndex].field;
      const node = visibleSortedRows[nextCellIndexes.rowIndex];
      apiRef.current.setCellFocus(node.id, field);
    },
    [apiRef, visibleSortedRows, colCount, logger, currentPage],
  );

  const navigateColumnHeaders = React.useCallback(
    (params: GridColumnHeaderParams, event: React.KeyboardEvent) => {
      event.preventDefault();

      let nextColumnHeaderIndexes: GridColumnHeaderIndexCoordinates | null;
      const colIndex = apiRef.current.getColumnIndex(params.field);
      const key = mapKey(event);
      const dimensions = apiRef.current.getRootDimensions();
      if (!dimensions) {
        return;
      }

      if (isArrowKeys(key)) {
        nextColumnHeaderIndexes = getNextColumnHeaderIndexes(key, {
          colIndex,
        });
      } else if (isHomeOrEndKeys(key)) {
        const colIdx = key === 'Home' ? 0 : colCount - 1;

        nextColumnHeaderIndexes = { colIndex: colIdx };
      } else if (isPageKeys(key)) {
        // Handle only Page Down key, Page Up should keep the current position
        if (key.indexOf('Down') > -1 && currentPage.rows.length) {
          const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
          const field = apiRef.current.getVisibleColumns()[colIndex].field;
          const id = currentPage.rows[Math.min(viewportPageSize, currentPage.rows.length - 1)].id;
          apiRef.current.setCellFocus(id, field);
        }
        return;
      } else {
        throw new Error('MUI: Key not mapped to navigation behavior.');
      }

      if (!nextColumnHeaderIndexes) {
        const field = apiRef.current.getVisibleColumns()[colIndex].field;
        if (currentPage.rows.length) {
          apiRef.current.setCellFocus(currentPage.rows[0].id, field);
        }
        return;
      }

      nextColumnHeaderIndexes!.colIndex = Math.max(0, nextColumnHeaderIndexes!.colIndex);
      nextColumnHeaderIndexes!.colIndex =
        nextColumnHeaderIndexes!.colIndex >= colCount
          ? colCount - 1
          : nextColumnHeaderIndexes!.colIndex;

      logger.debug(`Navigating to next column row ${nextColumnHeaderIndexes.colIndex}`);
      apiRef.current.scrollToIndexes(nextColumnHeaderIndexes);
      const field = apiRef.current.getVisibleColumns()[nextColumnHeaderIndexes.colIndex].field;
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef, colCount, logger, currentPage.rows],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellNavigationKeyDown, navigateCells);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderNavigationKeyDown, navigateColumnHeaders);
};
