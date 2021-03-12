import * as React from 'react';
import { GRID_ROW_CSS_CLASS } from '../../../constants/cssClassesConstants';
import {
  GRID_CELL_CHANGE_COMMITTED,
  GRID_CELL_ENTER_EDIT,
  GRID_CELL_EXIT_EDIT,
  GRID_CELL_KEYDOWN,
  GRID_CELL_NAVIGATION_KEYDOWN,
  GRID_ELEMENT_FOCUS_OUT,
  GRID_KEYDOWN,
  GRID_KEYUP,
  GRID_MULTIPLE_KEY_PRESS_CHANGED,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  findParentElementFromClassName,
  getIdFromRowElem,
  getRowEl,
} from '../../../utils/domUtils';
import {
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isMultipleKey,
  isNavigationKey,
  isSpaceKey,
} from '../../../utils/keyboardUtils';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { gridSelectionStateSelector } from '../selection/gridSelectionSelector';
import { KeyboardState } from './keyboardState';
import { useGridKeyboardNavigation } from './useGridKeyboardNavigation';

export const useGridKeyboard = (
  gridRootRef: React.RefObject<HTMLDivElement>,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useGridKeyboard');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const selectionState = useGridSelector(apiRef, gridSelectionStateSelector);
  useGridKeyboardNavigation(gridRootRef, apiRef);

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

  const onKeyDownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      if (isMultipleKey(event.key)) {
        logger.debug('Multiple Select key pressed');
        onMultipleKeyChange(true);
      }
    },
    [logger, onMultipleKeyChange],
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

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      const isEditMode = params.cellMode === 'edit';

      if (isEditMode) {
        if (isCellEditCommitKeys(event.key)) {
          const cellCommitParams = apiRef.current.getEditCellParams(params.id, params.field);
          apiRef.current.publishEvent(GRID_CELL_CHANGE_COMMITTED, cellCommitParams, event);
        }
        if (!event.isPropagationStopped() && isCellExitEditModeKeys(event.key)) {
          apiRef.current.publishEvent(GRID_CELL_EXIT_EDIT, params, event);
        }
        return;
      }

      if (isCellEnterEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_ENTER_EDIT, params, event);
      }

      if (isSpaceKey(event.key) && event.shiftKey) {
        event.preventDefault();
        selectActiveRow();
        return;
      }

      if (isNavigationKey(event.key) && !event.shiftKey) {
        event.preventDefault();
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

  useGridApiEventHandler(apiRef, GRID_KEYDOWN, onKeyDownHandler);
  useGridApiEventHandler(apiRef, GRID_CELL_KEYDOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_KEYUP, onKeyUpHandler);
  useGridApiEventHandler(apiRef, GRID_ELEMENT_FOCUS_OUT, onFocusOutHandler);
};
