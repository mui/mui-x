import * as React from 'react';
import { gridContainerSizesSelector } from '../../../components/GridViewport';
import { GRID_CELL_CSS_CLASS, GRID_ROW_CSS_CLASS } from '../../../constants/cssClassesConstants';
import {
  GRID_ELEMENT_FOCUS_OUT,
  GRID_KEYDOWN,
  GRID_KEYUP,
  GRID_MULTIPLE_KEY_PRESS_CHANGED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import {
  findParentElementFromClassName,
  getIdFromRowElem,
  isGridCellRoot,
} from '../../../utils/domUtils';
import {
  isArrowKeys,
  isHomeOrEndKeys,
  isMultipleKey,
  isNavigationKey,
  isPageKeys,
  isSpaceKey,
} from '../../../utils/keyboardUtils';
import { optionsSelector } from '../../utils/optionsSelector';
import { visibleGridColumnsLengthSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { gridSelectionStateSelector } from '../selection/gridSelectionSelector';
import { KeyboardState } from './keyboardState';

const getNextCellIndexes = (code: string, indexes: GridCellIndexCoordinates) => {
  if (!isArrowKeys(code)) {
    throw new Error('Material-UI: The first argument (code) should be an arrow key code.');
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

export const useGridKeyboard = (
  gridRootRef: React.RefObject<HTMLDivElement>,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useGridKeyboard');
  const options = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const colCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const selectionState = useGridSelector(apiRef, gridSelectionStateSelector);

  const onMultipleKeyChange = React.useCallback(
    (isPressed: boolean) => {
      setGridState((state) => {
        logger.debug(`Toggling keyboard multiple key pressed to ${isPressed}`);
        const keyboardState: KeyboardState = { ...state.keyboard, isMultipleKeyPressed: isPressed };
        return { ...state, keyboard: keyboardState };
      });
      forceUpdate();

      apiRef.current.publishEvent(GRID_MULTIPLE_KEY_PRESS_CHANGED, isPressed);
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const navigateCells = React.useCallback(
    (key: string, isCtrlPressed: boolean) => {
      const cellEl = findParentElementFromClassName(
        document.activeElement as HTMLDivElement,
        GRID_CELL_CSS_CLASS,
      )! as HTMLElement;
      cellEl.tabIndex = -1;

      const currentColIndex = Number(cellEl.getAttribute('aria-colindex'));
      const currentRowIndex = Number(cellEl.getAttribute('data-rowindex'));
      const rowCount = options.pagination
        ? paginationState.pageSize * (paginationState.page + 1)
        : totalRowCount;

      let nextCellIndexes: GridCellIndexCoordinates;
      if (isArrowKeys(key)) {
        nextCellIndexes = getNextCellIndexes(key, {
          colIndex: currentColIndex,
          rowIndex: currentRowIndex,
        });
      } else if (isHomeOrEndKeys(key)) {
        const colIdx = key === 'Home' ? 0 : colCount - 1;

        if (!isCtrlPressed) {
          // we go to the current row, first col, or last col!
          nextCellIndexes = { colIndex: colIdx, rowIndex: currentRowIndex };
        } else {
          // In that case we go to first row, first col, or last row last col!
          let rowIndex = 0;
          if (colIdx === 0) {
            rowIndex = options.pagination ? rowCount - paginationState.pageSize : 0;
          } else {
            rowIndex = rowCount - 1;
          }
          nextCellIndexes = { colIndex: colIdx, rowIndex };
        }
      } else if (isPageKeys(key) || isSpaceKey(key)) {
        const nextRowIndex =
          currentRowIndex +
          (key.indexOf('Down') > -1 || isSpaceKey(key)
            ? containerSizes!.viewportPageSize
            : -1 * containerSizes!.viewportPageSize);
        nextCellIndexes = { colIndex: currentColIndex, rowIndex: nextRowIndex };
      } else {
        throw new Error('Material-UI. Key not mapped to navigation behavior.');
      }

      nextCellIndexes.rowIndex = nextCellIndexes.rowIndex <= 0 ? 0 : nextCellIndexes.rowIndex;
      nextCellIndexes.rowIndex =
        nextCellIndexes.rowIndex >= rowCount && rowCount > 0
          ? rowCount - 1
          : nextCellIndexes.rowIndex;

      nextCellIndexes.colIndex = nextCellIndexes.colIndex <= 0 ? 0 : nextCellIndexes.colIndex;
      nextCellIndexes.colIndex =
        nextCellIndexes.colIndex >= colCount ? colCount - 1 : nextCellIndexes.colIndex;

      apiRef.current.scrollToIndexes(nextCellIndexes);

      setGridState((state) => {
        logger.debug(`Setting keyboard state, cell focus to ${JSON.stringify(nextCellIndexes)}`);
        return { ...state, keyboard: { ...state.keyboard, cell: nextCellIndexes } };
      });
      forceUpdate();

      return nextCellIndexes;
    },
    [
      options.pagination,
      paginationState.pageSize,
      paginationState.page,
      totalRowCount,
      colCount,
      apiRef,
      setGridState,
      forceUpdate,
      containerSizes,
      logger,
    ],
  );

  const selectActiveRow = React.useCallback(() => {
    const rowEl = findParentElementFromClassName(
      document.activeElement as HTMLDivElement,
      GRID_ROW_CSS_CLASS,
    )! as HTMLElement;

    const rowId = getIdFromRowElem(rowEl);
    apiRef.current.selectRow(rowId);
  }, [apiRef]);

  const expandSelection = React.useCallback(
    (key: string) => {
      const rowEl = findParentElementFromClassName(
        document.activeElement as HTMLDivElement,
        GRID_ROW_CSS_CLASS,
      )! as HTMLElement;

      const currentRowIndex = Number(rowEl.getAttribute('data-rowindex'));
      let selectionFromRowIndex = currentRowIndex;

      // TODO Refactor here to not use api call
      const selectedRows = apiRef.current.getSelectedRows();
      if (selectedRows.length > 0) {
        const selectedRowsIndex = selectedRows.map((row) =>
          apiRef.current.getRowIndexFromId(row.id),
        );

        const diffWithCurrentIndex: number[] = selectedRowsIndex.map((idx) =>
          Math.abs(currentRowIndex - idx),
        );
        const minIndex = Math.max(...diffWithCurrentIndex);
        selectionFromRowIndex = selectedRowsIndex[diffWithCurrentIndex.indexOf(minIndex)];
      }

      const nextCellIndexes = navigateCells(key, false);
      // We select the rows in between
      const rowIds = Array(Math.abs(nextCellIndexes.rowIndex - selectionFromRowIndex) + 1)
        .fill(
          nextCellIndexes.rowIndex > selectionFromRowIndex
            ? selectionFromRowIndex
            : nextCellIndexes.rowIndex,
        )
        .map((cur, idx) => apiRef.current.getRowIdFromRowIndex(cur + idx));

      logger.debug('Selecting rows ');

      apiRef.current.selectRows(rowIds, true, true);
    },
    [logger, apiRef, navigateCells],
  );

  const handleCopy = React.useCallback(() => {
    const rowEl = findParentElementFromClassName(
      document.activeElement as HTMLDivElement,
      GRID_ROW_CSS_CLASS,
    )! as HTMLElement;
    const rowId = getIdFromRowElem(rowEl);
    const isRowSelected = selectionState[rowId];

    if (isRowSelected) {
      window?.getSelection()?.selectAllChildren(rowEl);
    } else {
      window?.getSelection()?.selectAllChildren(document.activeElement!);
    }
    document.execCommand('copy');
  }, [selectionState]);

  const onKeyDownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key pressed');
        onMultipleKeyChange(true);
      }

      if (!isGridCellRoot(document.activeElement)) {
        return;
      }

      if (isSpaceKey(event.key) && event.shiftKey) {
        event.preventDefault();
        selectActiveRow();
        return;
      }

      if (isNavigationKey(event.key) && !event.shiftKey) {
        event.preventDefault();
        navigateCells(event.key, event.ctrlKey || event.metaKey);
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        event.preventDefault();
        expandSelection(event.key);
        return;
      }

      if (event.key.toLowerCase() === 'c' && (event.ctrlKey || event.metaKey)) {
        handleCopy();
        return;
      }

      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        apiRef.current.selectRows(apiRef.current.getAllRowIds(), true);
      }
    },
    [
      apiRef,
      logger,
      onMultipleKeyChange,
      expandSelection,
      handleCopy,
      navigateCells,
      selectActiveRow,
    ],
  );

  const onKeyUpHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key released');
        onMultipleKeyChange(false);
      }
    },
    [logger, onMultipleKeyChange],
  );

  const onFocusOutHandler = React.useCallback(
    (args) => {
      logger.debug('Grid lost focus, releasing key press', args);
      if (apiRef.current.getState().keyboard.isMultipleKeyPressed) {
        onMultipleKeyChange(false);
      }
    },
    [apiRef, logger, onMultipleKeyChange],
  );

  useGridApiEventHandler(apiRef, GRID_KEYDOWN, onKeyDownHandler);
  useGridApiEventHandler(apiRef, GRID_KEYUP, onKeyUpHandler);
  useGridApiEventHandler(apiRef, GRID_ELEMENT_FOCUS_OUT, onFocusOutHandler);
};
