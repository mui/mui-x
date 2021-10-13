import * as React from 'react';
import { gridClasses } from '../../../gridClasses';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  findParentElementFromClassName,
  isGridCellRoot,
  isGridHeaderCellRoot,
} from '../../../utils/domUtils';
import { isEnterKey, isNavigationKey, isSpaceKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { gridSortedVisibleRowEntriesSelector } from '../filter';

/**
 * @requires useGridSelection (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridParamsApi (method)
 * @requires useGridColumnMenu (method)
 */
export const useGridKeyboard = (apiRef: GridApiRef): void => {
  const expandSelection = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, params, event);

      const focusCell = apiRef.current.state.focus.cell;

      if (!focusCell) {
        return;
      }

      const rowEl = findParentElementFromClassName(
        event.target as HTMLDivElement,
        gridClasses.row,
      )! as HTMLElement;

      const startRowIndex = Number(rowEl.getAttribute('data-rowindex'));
      const startId = gridSortedVisibleRowEntriesSelector(apiRef.current.state)[startRowIndex].id;

      if (startId === focusCell.id) {
        return;
      }

      apiRef.current.selectRowRange(
        { startId, endId: focusCell.id },
        !apiRef.current.isRowSelected(focusCell.id),
      );
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if ((event.target as any).nodeType === 1 && !isGridCellRoot(event.target as Element)) {
        return;
      }

      // Get the most recent params because the cell mode may have changed by another listener
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      const isEditMode = cellParams.cellMode === GridCellModes.Edit;
      if (isEditMode) {
        return;
      }

      if (isSpaceKey(event.key) && event.shiftKey) {
        event.preventDefault();
        apiRef.current.selectRow(
          cellParams.id,
          !apiRef.current.isRowSelected(cellParams.id),
          false,
        );
        return;
      }

      if (isNavigationKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, cellParams, event);
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        event.preventDefault();
        expandSelection(cellParams, event);
        return;
      }

      if (event.key.toLowerCase() === 'c' && (event.ctrlKey || event.metaKey)) {
        return;
      }

      if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        apiRef.current.selectRows(apiRef.current.getAllRowIds(), true);
      }
    },
    [apiRef, expandSelection],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      if (!isGridHeaderCellRoot(event.target as HTMLElement)) {
        return;
      }
      if (isSpaceKey(event.key) && isGridHeaderCellRoot(event.target as HTMLElement)) {
        event.preventDefault();
      }

      if (isNavigationKey(event.key) && !isSpaceKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GridEvents.columnHeaderNavigationKeyDown, params, event);
        return;
      }

      if (isEnterKey(event.key) && (event.ctrlKey || event.metaKey)) {
        apiRef.current.toggleColumnMenu(params.field);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
};
