import * as React from 'react';
import {
  GRID_CELL_NAVIGATION_KEYDOWN,
  GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN,
} from '../../../constants/eventsConstants';
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
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { optionsSelector } from '../../utils/optionsSelector';
import { visibleGridColumnsLengthSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';

const getNextCellIndexes = (key: string, indexes: GridCellIndexCoordinates) => {
  if (!isArrowKeys(key)) {
    throw new Error('Material-UI: The first argument (key) should be an arrow key code.');
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
    throw new Error('Material-UI: The first argument (key) should be an arrow key code.');
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

export const useGridKeyboardNavigation = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridKeyboardNavigation');
  const options = useGridSelector(apiRef, optionsSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const colCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

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
      const colIndex = apiRef.current.getColumnIndex(params.field);
      const rowIndex = apiRef.current.getRowIndex(params.id);

      const key = mapKey(event);
      const isCtrlPressed = event.ctrlKey || event.metaKey || event.shiftKey;
      let rowCount = totalRowCount;

      if (options.pagination && totalRowCount > paginationState.pageSize) {
        rowCount = paginationState.pageSize * (paginationState.page + 1);
      }

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
            newRowIndex = options.pagination ? rowCount - paginationState.pageSize : 0;
          } else {
            newRowIndex = rowCount - 1;
          }
          nextCellIndexes = { colIndex: colIdx, rowIndex: newRowIndex };
        }
      } else if (isPageKeys(key) || isSpaceKey(key)) {
        const nextRowIndex =
          rowIndex +
          (key.indexOf('Down') > -1 || isSpaceKey(key)
            ? containerSizes!.viewportPageSize
            : -1 * containerSizes!.viewportPageSize);
        nextCellIndexes = { colIndex, rowIndex: nextRowIndex };
      } else {
        throw new Error('Material-UI. Key not mapped to navigation behavior.');
      }

      if (nextCellIndexes.rowIndex < 0) {
        const field = apiRef.current.getVisibleColumns()[nextCellIndexes.colIndex].field;
        apiRef.current.setColumnHeaderFocus(field);
        return;
      }

      nextCellIndexes.rowIndex =
        nextCellIndexes.rowIndex >= rowCount && rowCount > 0
          ? rowCount - 1
          : nextCellIndexes.rowIndex;
      nextCellIndexes.colIndex = nextCellIndexes.colIndex <= 0 ? 0 : nextCellIndexes.colIndex;
      nextCellIndexes.colIndex =
        nextCellIndexes.colIndex >= colCount ? colCount - 1 : nextCellIndexes.colIndex;
      logger.debug(
        `Navigating to next cell row ${nextCellIndexes.rowIndex}, col ${nextCellIndexes.colIndex}`,
      );
      apiRef.current.scrollToIndexes(nextCellIndexes);
      const field = apiRef.current.getVisibleColumns()[nextCellIndexes.colIndex].field;
      const id = apiRef.current.getRowIdFromRowIndex(nextCellIndexes.rowIndex);
      apiRef.current.setCellFocus(id, field);
    },
    [
      totalRowCount,
      options.pagination,
      paginationState.pageSize,
      paginationState.page,
      colCount,
      logger,
      apiRef,
      containerSizes,
    ],
  );

  const navigateColumnHeaders = React.useCallback(
    (params: GridColumnHeaderParams, event: React.KeyboardEvent) => {
      event.preventDefault();
      let nextColumnHeaderIndexes: GridColumnHeaderIndexCoordinates | null;
      const colIndex = apiRef.current.getColumnIndex(params.field);
      const key = mapKey(event);

      if (isArrowKeys(key)) {
        nextColumnHeaderIndexes = getNextColumnHeaderIndexes(key, {
          colIndex,
        });
      } else if (isHomeOrEndKeys(key)) {
        const colIdx = key === 'Home' ? 0 : colCount - 1;

        nextColumnHeaderIndexes = { colIndex: colIdx };
      } else if (isPageKeys(key)) {
        // Handle only Page Down key, Page Up should keep the current possition
        if (key.indexOf('Down') > -1) {
          const field = apiRef.current.getVisibleColumns()[colIndex].field;
          const id = apiRef.current.getRowIdFromRowIndex(containerSizes!.viewportPageSize - 1);

          apiRef.current.setCellFocus(id, field);
        }
        return;
      } else {
        throw new Error('Material-UI. Key not mapped to navigation behavior.');
      }

      if (!nextColumnHeaderIndexes) {
        const field = apiRef.current.getVisibleColumns()[colIndex].field;
        const id = apiRef.current.getRowIdFromRowIndex(0);
        apiRef.current.setCellFocus(id, field);
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
      apiRef.current.setColumnHeaderFocus(field);
    },
    [apiRef, colCount, containerSizes, logger],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_NAVIGATION_KEYDOWN, navigateCells);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN, navigateColumnHeaders);
};
