import * as React from 'react';
import { GRID_ROW_CSS_CLASS } from '../../../constants/cssClassesConstants';
import {
  GRID_CELL_KEYDOWN,
  GRID_CELL_NAVIGATION_KEYDOWN,
  GRID_COLUMN_HEADER_CLICK,
  GRID_COLUMN_HEADER_KEYDOWN,
  GRID_ELEMENT_FOCUS_OUT,
  GRID_KEYDOWN,
  GRID_KEYUP,
  GRID_MULTIPLE_KEY_PRESS_CHANGED,
  GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  findParentElementFromClassName,
  getIdFromRowElem,
  getRowEl,
  isGridCellRoot,
  isGridHeaderCellRoot,
} from '../../../utils/domUtils';
import {
  isEnterKey,
  isMultipleKey,
  isNavigationKey,
  isSpaceKey,
} from '../../../utils/keyboardUtils';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { gridSelectionStateSelector } from '../selection/gridSelectionSelector';
import { GridKeyboardState } from './gridKeyboardState';

export const useGridKeyboard = (
  gridRootRef: React.RefObject<HTMLDivElement>,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useGridKeyboard');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const selectionState = useGridSelector(apiRef, gridSelectionStateSelector);

  const setMultipleKeyState = React.useCallback(
    (isPressed: boolean) => {
      const hasChanged = setGridState((state) => {
        if (state.keyboard.isMultipleKeyPressed === isPressed) {
          return state;
        }

        logger.debug(`Toggling keyboard multiple key pressed to ${isPressed}`);
        const keyboardState: GridKeyboardState = {
          ...state.keyboard,
          isMultipleKeyPressed: isPressed,
        };
        return { ...state, keyboard: keyboardState };
      });

      if (!hasChanged) {
        return;
      }

      forceUpdate();
      apiRef.current.publishEvent(GRID_MULTIPLE_KEY_PRESS_CHANGED, isPressed);
    },
    [apiRef, forceUpdate, logger, setGridState],
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
    (params: GridCellParams, event: React.KeyboardEvent) => {
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

      apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEYDOWN, params, event);

      const nextCellIndexes = apiRef.current.getState().keyboard.cell!;
      // We select the rows in between
      const rowIds = Array(Math.abs(nextCellIndexes.rowIndex - selectionFromRowIndex) + 1).fill(
        nextCellIndexes.rowIndex > selectionFromRowIndex
          ? selectionFromRowIndex
          : nextCellIndexes.rowIndex,
      );

      logger.debug('Selecting rows ');

      apiRef.current.selectRows(rowIds, true, true);
    },
    [logger, apiRef],
  );

  const handleCopy = React.useCallback(() => {
    const rowEl = getRowEl(document.activeElement)!;
    const rowId = getIdFromRowElem(rowEl);
    const isRowSelected = selectionState[rowId];

    if (isRowSelected) {
      window?.getSelection()?.selectAllChildren(rowEl);
    } else {
      window?.getSelection()?.selectAllChildren(document.activeElement!);
    }
    document.execCommand('copy');
  }, [selectionState]);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key pressed');
        setMultipleKeyState(true);
      }
    },
    [logger, setMultipleKeyState],
  );

  const handleKeyUp = React.useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key released');
        setMultipleKeyState(false);
      }
    },
    [logger, setMultipleKeyState],
  );

  const handleFocusOut = React.useCallback(
    (args) => {
      logger.debug('Grid lost focus, releasing key press', args);
      setMultipleKeyState(false);
    },
    [logger, setMultipleKeyState],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (!isGridCellRoot(document.activeElement)) {
        return;
      }

      if (isSpaceKey(event.key) && event.shiftKey) {
        event.preventDefault();
        selectActiveRow();
        return;
      }

      if (isNavigationKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEYDOWN, params, event);
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        event.preventDefault();
        expandSelection(params, event);
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
    [apiRef, expandSelection, handleCopy, selectActiveRow],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (!isGridHeaderCellRoot(document.activeElement)) {
        return;
      }

      if (isSpaceKey(event.key)) {
        event.preventDefault();
      }

      if (isNavigationKey(event.key) && !isSpaceKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GRID_COLUMN_HEADER_NAVIGATION_KEYDOWN, params, event);
        return;
      }

      if (isEnterKey(event.key) && (event.ctrlKey || event.metaKey)) {
        apiRef!.current.toggleColumnMenu(params.field);
        return;
      }

      if (isEnterKey(event.key) || isSpaceKey(event.key)) {
        apiRef.current.publishEvent(
          GRID_COLUMN_HEADER_CLICK,
          apiRef!.current.getColumnHeaderParams(params.field),
          event,
        );
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_KEYDOWN, handleKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_KEYDOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_KEYDOWN, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GRID_KEYUP, handleKeyUp);
  useGridApiEventHandler(apiRef, GRID_ELEMENT_FOCUS_OUT, handleFocusOut);
};
