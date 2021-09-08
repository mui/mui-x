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
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridCellModes } from '../../../models/gridEditRowModel';

/**
 * @requires useGridSelection (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridParamsApi (method)
 * @requires useGridColumnMenu (method)
 */
export const useGridKeyboard = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboard');

  const expandSelection = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      const rowEl = findParentElementFromClassName(
        event.target as HTMLDivElement,
        gridClasses.row,
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

      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, params, event);

      const focusCell = apiRef.current.state.focus.cell!;
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
        apiRef.current.selectRow(cellParams.id, undefined, false);
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
