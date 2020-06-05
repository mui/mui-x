import { useCallback, useRef } from 'react';
import { useLogger } from '../utils/useLogger';
import { KEYDOWN_EVENT, KEYUP_EVENT, MULTIPLE_KEY_PRESS_CHANGED } from '../../constants/eventsConstants';

import { GridApiRef } from '../../grid';
import {
  findGridRootFromCurrent,
  findParentElementFromClassName,
  getCellElementFromIndexes,
  getDataFromElem,
  getIdFromRowElem,
  isArrowKeys,
  isCell,
  isHomeOrEndKeys,
  isMultipleKey,
  isNavigationKey,
  isPageKeys,
  isSpaceKey,
  isTabKey,
} from '../../utils';
import { CELL_CSS_CLASS, ROW_CSS_CLASS } from '../../constants/cssClassesConstants';
import { CellIndexCoordinates, GridOptions } from '../../models';

import { useApiEventHandler } from './useApiEventHandler';

const getNextCellIndexes = (code: string, indexes: CellIndexCoordinates) => {
  if (!isArrowKeys(code)) {
    throw new Error('first argument code should be an Arrow Key code');
  }

  if (code === 'ArrowLeft') {
    return { ...indexes, colIndex: indexes.colIndex - 1 };
  }
  if (code === 'ArrowRight') {
    return { ...indexes, colIndex: indexes.colIndex + 1 };
  }
  if (code === 'ArrowUp') {
    return { ...indexes, rowIndex: indexes.rowIndex - 1 };
  }
  // Last option code === 'ArrowDown'
  return { ...indexes, rowIndex: indexes.rowIndex + 1 };
};

export const useKeyboard = (options: GridOptions, initialised: boolean, apiRef: GridApiRef): void => {
  const logger = useLogger('useKeyboard');
  const isMultipleKeyPressed = useRef(false);

  const onMultipleKeyChange = useCallback(
    (isPressed: boolean) => {
      isMultipleKeyPressed.current = isPressed;
      if (apiRef.current) {
        apiRef.current.emit(MULTIPLE_KEY_PRESS_CHANGED, isPressed);
      }
    },
    [apiRef, isMultipleKeyPressed],
  );

  const navigateCells = useCallback(
    (code: string, isCtrlPressed: boolean) => {
      const cellEl = findParentElementFromClassName(
        document.activeElement as HTMLDivElement,
        CELL_CSS_CLASS,
      )! as HTMLElement;
      cellEl.tabIndex = -1;

      const root = findGridRootFromCurrent(cellEl)!;
      const currentColIndex = Number(getDataFromElem(cellEl, 'colindex'));
      const currentRowIndex = Number(getDataFromElem(cellEl, 'rowindex'));
      const autoPageSize = apiRef.current!.getContainerPropsState()!.viewportPageSize;
      const pageSize =
        options.pagination && options.paginationPageSize != null ? options.paginationPageSize : autoPageSize;
      const rowCount = options.pagination ? pageSize : apiRef.current!.getRowsCount();
      const colCount = apiRef.current!.getVisibleColumns().length;

      let nextCellIndexes: CellIndexCoordinates;
      if (isArrowKeys(code)) {
        nextCellIndexes = getNextCellIndexes(code, { colIndex: currentColIndex, rowIndex: currentRowIndex });
      } else if (isHomeOrEndKeys(code)) {
        const colIdx = code === 'Home' ? 0 : colCount - 1;

        if (!isCtrlPressed) {
          //we go to the current row, first col, or last col!
          nextCellIndexes = { colIndex: colIdx, rowIndex: currentRowIndex };
        } else {
          //In that case we go to first row, first col, or last row last col!
          const rowIndex = colIdx === 0 ? 0 : rowCount - 1;
          nextCellIndexes = { colIndex: colIdx, rowIndex };
        }
      } else if (isPageKeys(code) || isSpaceKey(code)) {
        const nextRowIndex =
          currentRowIndex + (code.indexOf('Down') > -1 || isSpaceKey(code) ? autoPageSize : -1 * autoPageSize);
        nextCellIndexes = { colIndex: currentColIndex, rowIndex: nextRowIndex };
      } else {
        throw new Error('Key not mapped to navigation behaviour');
      }

      nextCellIndexes.rowIndex = nextCellIndexes.rowIndex <= 0 ? 0 : nextCellIndexes.rowIndex;
      nextCellIndexes.rowIndex = nextCellIndexes.rowIndex >= rowCount ? rowCount - 1 : nextCellIndexes.rowIndex;
      nextCellIndexes.colIndex = nextCellIndexes.colIndex <= 0 ? 0 : nextCellIndexes.colIndex;
      nextCellIndexes.colIndex = nextCellIndexes.colIndex >= colCount ? colCount - 1 : nextCellIndexes.colIndex;

      apiRef.current!.scrollToIndexes(nextCellIndexes);
      setTimeout(() => {
        const nextCell = getCellElementFromIndexes(root, nextCellIndexes);

        if (nextCell) {
          nextCell.tabIndex = 0;
          (nextCell as HTMLDivElement).focus();
        }
      }, 100);

      return nextCellIndexes;
    },
    [apiRef, options.pagination, options.paginationPageSize],
  );

  const selectActiveRow = useCallback(() => {
    const rowEl = findParentElementFromClassName(
      document.activeElement as HTMLDivElement,
      ROW_CSS_CLASS,
    )! as HTMLElement;

    const rowId = getIdFromRowElem(rowEl);
    if (apiRef.current) {
      apiRef.current.selectRow(rowId);
    }
  }, [apiRef]);

  const expandSelection = useCallback(
    (code: string) => {
      const rowEl = findParentElementFromClassName(
        document.activeElement as HTMLDivElement,
        ROW_CSS_CLASS,
      )! as HTMLElement;

      const currentRowIndex = Number(getDataFromElem(rowEl, 'rowindex'));
      let selectionFromRowIndex = currentRowIndex;
      const selectedRows = apiRef.current!.getSelectedRows();
      if (selectedRows.length > 0) {
        const selectedRowsIndex = selectedRows.map(row => apiRef.current!.getRowIndexFromId(row.id));

        const diffWithCurrentIndex: number[] = selectedRowsIndex.map(idx => Math.abs(currentRowIndex - idx));
        const minIndex = Math.max(...diffWithCurrentIndex);
        selectionFromRowIndex = selectedRowsIndex[diffWithCurrentIndex.indexOf(minIndex)];
      }

      const nextCellIndexes = navigateCells(code, false);
      //We select the rows in between
      const rowIds = Array(Math.abs(nextCellIndexes.rowIndex - selectionFromRowIndex) + 1)
        .fill(nextCellIndexes.rowIndex > selectionFromRowIndex ? selectionFromRowIndex : nextCellIndexes.rowIndex)
        .map((cur, idx) => apiRef.current!.getRowIdFromRowIndex(cur + idx));

      logger.debug('Selecting rows ', rowIds);

      apiRef.current!.selectRows(rowIds, true, true);
    },
    [logger, apiRef, navigateCells],
  );

  const handleCopy = useCallback(() => {
    const rowEl = findParentElementFromClassName(
      document.activeElement as HTMLDivElement,
      ROW_CSS_CLASS,
    )! as HTMLElement;
    const rowId = getIdFromRowElem(rowEl);
    const rowModel = apiRef.current!.getRowFromId(rowId);

    if (rowModel.selected) {
      window?.getSelection()?.selectAllChildren(rowEl);
    } else {
      window?.getSelection()?.selectAllChildren(document.activeElement!);
    }
    document.execCommand('copy');
  }, [apiRef]);

  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key pressed');
        onMultipleKeyChange(true);
        return;
      }

      if (!isCell(document.activeElement)) {
        return;
      }

      if (!isTabKey(event.code)) {
        //WE prevent default behaviour for all key shortcut except tab when the current active element is a cell
        event.preventDefault();
        event.stopPropagation();
      }

      if (isSpaceKey(event.code) && event.shiftKey) {
        selectActiveRow();
        return;
      }

      if (isNavigationKey(event.code) && !event.shiftKey) {
        navigateCells(event.code, event.ctrlKey || event.metaKey);
        return;
      }
      if (isNavigationKey(event.code) && event.shiftKey) {
        expandSelection(event.code);
        return;
      }

      if (event.key.toLowerCase() === 'c' && (event.ctrlKey || event.metaKey)) {
        handleCopy();
        return;
      }

      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        apiRef.current!.selectRows(apiRef.current!.getAllRowIds(), true);
        return;
      }
    },
    [apiRef, logger, onMultipleKeyChange, expandSelection, handleCopy, navigateCells, selectActiveRow],
  );

  const onKeyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key released');
        onMultipleKeyChange(false);
      }
    },
    [logger, onMultipleKeyChange],
  );

  useApiEventHandler(apiRef, KEYDOWN_EVENT, onKeyDownHandler);
  useApiEventHandler(apiRef, KEYUP_EVENT, onKeyUpHandler);
};
