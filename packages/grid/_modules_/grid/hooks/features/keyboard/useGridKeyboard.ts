import * as React from 'react';
import { GRID_ROW_CSS_CLASS } from '../../../constants/cssClassesConstants';
import {
  GRID_CELL_KEYDOWN,
  GRID_CELL_NAVIGATION_KEYDOWN,
  GRID_COLUMN_HEADER_KEYDOWN,
  GRID_COLUMN_HEADER_NAVIGATION_KEY_DOWN,
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
import { isEnterKey, isNavigationKey, isSpaceKey } from '../../../utils/keyboardUtils';
import { useGridSelector } from '../core/useGridSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { gridSelectionStateSelector } from '../selection/gridSelectionSelector';

export const useGridKeyboard = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridKeyboard');
  const selectionState = useGridSelector(apiRef, gridSelectionStateSelector);

  const expandSelection = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      const rowEl = findParentElementFromClassName(
        event.target as HTMLElement as HTMLDivElement,
        GRID_ROW_CSS_CLASS,
      )! as HTMLElement;

      const currentRowIndex = Number(rowEl.getAttribute('data-rowindex'));
      let selectionFromRowIndex = currentRowIndex;

      // TODO Refactor here to not use api call
      const selectedRowsIds = [...apiRef.current.getSelectedRows().keys()];
      if (selectedRowsIds.length > 0) {
        const selectedRowsIndex = selectedRowsIds.map((id) => apiRef.current.getRowIndex(id));

        const diffWithCurrentIndex: number[] = selectedRowsIndex.map((idx) =>
          Math.abs(currentRowIndex - idx),
        );
        const minIndex = Math.max(...diffWithCurrentIndex);
        selectionFromRowIndex = selectedRowsIndex[diffWithCurrentIndex.indexOf(minIndex)];
      }

      apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEYDOWN, params, event);

      const focusCell = apiRef.current.getState().focus.cell!;
      const rowIndex = apiRef.current.getRowIndex(focusCell.id);
      // We select the rows in between
      const rowIds = Array(Math.abs(rowIndex - selectionFromRowIndex) + 1).fill(
        rowIndex > selectionFromRowIndex ? selectionFromRowIndex : rowIndex,
      );

      logger.debug('Selecting rows ');

      apiRef.current.selectRows(rowIds, true, true);
    },
    [logger, apiRef],
  );

  const handleCopy = React.useCallback(
    (target: HTMLElement) => {
      const rowEl = getRowEl(target)!;
      const rowId = getIdFromRowElem(rowEl);
      const isRowSelected = selectionState[rowId];

      if (isRowSelected) {
        window?.getSelection()?.selectAllChildren(rowEl);
      } else {
        window?.getSelection()?.selectAllChildren(target);
      }
      document.execCommand('copy');
    },
    [selectionState],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (!isGridCellRoot(event.target as HTMLElement)) {
        return;
      }
      if (event.isPropagationStopped()) {
        return;
      }
      const isEditMode = params.cellMode === 'edit';
      if (isEditMode) {
        return;
      }

      if (isSpaceKey(event.key) && event.shiftKey) {
        event.preventDefault();
        apiRef.current.selectRow(params.id);
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
        handleCopy(event.target as HTMLElement);
        return;
      }

      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        apiRef.current.selectRows(apiRef.current.getAllRowIds(), true);
      }
    },
    [apiRef, expandSelection, handleCopy],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (!isGridHeaderCellRoot(event.target as HTMLElement)) {
        return;
      }
      if (event.isPropagationStopped()) {
        return;
      }
      if (isSpaceKey(event.key) && isGridHeaderCellRoot(event.target as HTMLElement)) {
        event.preventDefault();
      }

      if (isNavigationKey(event.key) && !isSpaceKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GRID_COLUMN_HEADER_NAVIGATION_KEY_DOWN, params, event);
        return;
      }

      if (isEnterKey(event.key) && (event.ctrlKey || event.metaKey)) {
        apiRef!.current.toggleColumnMenu(params.field);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEYDOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_KEYDOWN, handleColumnHeaderKeyDown);
};
