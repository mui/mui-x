import * as React from 'react';
import { gridClasses } from '../../../gridClasses';
import { GridEvents, GridEventListener } from '../../../models/events';
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
import { gridVisibleSortedRowIdsSelector } from '../filter/gridFilterSelector';

/**
 * @requires useGridSelection (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridParamsApi (method)
 * @requires useGridColumnMenu (method)
 */
export const useGridKeyboard = (apiRef: GridApiRef): void => {
  const expandSelection = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent<HTMLElement>) => {
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
      const startId = gridVisibleSortedRowIdsSelector(apiRef.current.state)[startRowIndex];

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

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      // Ignore portal
      // Do not apply shortcuts if the focus is not on the cell root component
      // TODO replace with !event.currentTarget.contains(event.target as Element)
      if (!isGridCellRoot(event.target as Element)) {
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

  const handleColumnHeaderKeyDown = React.useCallback<
    GridEventListener<GridEvents.columnHeaderKeyDown>
  >(
    (params, event) => {
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
