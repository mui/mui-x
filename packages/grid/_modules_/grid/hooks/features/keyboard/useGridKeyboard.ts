import * as React from 'react';
import { gridClasses } from '../../../gridClasses';
import { GridEvents, GridEventListener } from '../../../models/events';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { findParentElementFromClassName, isGridCellRoot } from '../../../utils/domUtils';
import { isNavigationKey } from '../../../utils/keyboardUtils';
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

      if (event.key === ' ' && event.shiftKey) {
        // This is a select event, so it's handled by the selection hook
        return;
      }

      if (isNavigationKey(event.key) && !event.shiftKey) {
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, cellParams, event);
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        event.preventDefault();
        expandSelection(cellParams, event);
      }
    },
    [apiRef, expandSelection],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
