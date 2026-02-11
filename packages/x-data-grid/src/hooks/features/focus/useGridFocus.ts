'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import type { RefObject } from '@mui/x-internals/types';
import { clamp } from '@mui/x-internals/math';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerDocument from '@mui/utils/ownerDocument';
import { gridClasses } from '../../../constants/gridClasses';
import type { GridEventListener, GridEventLookup } from '../../../models/events';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridFocusApi, GridFocusPrivateApi } from '../../../models/api/gridFocusApi';
import type { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridEvent } from '../../utils/useGridEvent';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { isNavigationKey, isPasteShortcut } from '../../../utils/keyboardUtils';
import {
  gridFocusCellSelector,
  gridFocusColumnGroupHeaderSelector,
} from './gridFocusStateSelector';
import { doesSupportPreventScroll } from '../../../utils/doesSupportPreventScroll';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import type { GridCellCoordinates } from '../../../models/gridCell';
import type { GridRowEntry, GridRowId } from '../../../models/gridRows';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';

export const focusStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  focus: { cell: null, columnHeader: null, columnHeaderFilter: null, columnGroupHeader: null },
  tabIndex: { cell: null, columnHeader: null, columnHeaderFilter: null, columnGroupHeader: null },
});

/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */
export const useGridFocus = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFocus');

  const lastClickedCell = React.useRef<GridCellParams | null>(null);
  const hasRootReference = apiRef.current.rootElementRef.current !== null;

  const publishCellFocusOut = React.useCallback(
    (cell: GridCellCoordinates | null, event: GridEventLookup['cellFocusOut']['event']) => {
      if (cell) {
        // The row might have been deleted
        if (apiRef.current.getRow(cell.id)) {
          apiRef.current.publishEvent(
            'cellFocusOut',
            apiRef.current.getCellParams(cell.id, cell.field),
            event,
          );
        }
      }
    },
    [apiRef],
  );

  const setCellFocus = React.useCallback<GridFocusApi['setCellFocus']>(
    (id, field) => {
      const focusedCell = gridFocusCellSelector(apiRef);
      if (focusedCell?.id === id && focusedCell?.field === field) {
        /**
         * Check if the state matches the actual DOM focus. They can get out of sync after `updateRows()` remounts the cell.
         */
        if (apiRef.current.getCellMode(id, field) !== 'view') {
          return;
        }

        const cellElement = apiRef.current.getCellElement(id, field);
        if (!cellElement) {
          return;
        }

        const gridRoot = apiRef.current.rootElementRef!.current;
        const doc = ownerDocument(gridRoot);
        const activeElement = doc.activeElement;

        // We can take focus if:
        // - Focus is inside the grid, OR
        // - Focus is "lost" (on body/documentElement/null, e.g., after cell remount during undo/redo)
        // We should NOT take focus if it's intentionally outside the grid (e.g., in a Portal/Dialog).
        // React synthetic events bubble through the React component tree, not the DOM tree,
        // so events from Portal content can trigger this code even though focus is elsewhere.
        // This avoids https://github.com/mui/mui-x/issues/21063
        const allowTakingFocus =
          !activeElement ||
          activeElement === doc.body ||
          activeElement === doc.documentElement ||
          gridRoot?.contains(activeElement);

        if (!allowTakingFocus) {
          return;
        }

        if (cellElement.contains(doc.activeElement!)) {
          return;
        }

        if (doesSupportPreventScroll()) {
          cellElement.focus({ preventScroll: true });
        } else {
          const scrollPosition = apiRef.current.getScrollPosition();
          cellElement.focus();
          apiRef.current.scroll(scrollPosition);
        }

        return;
      }

      apiRef.current.setState((state) => {
        logger.debug(`Focusing on cell with id=${id} and field=${field}`);
        return {
          ...state,
          tabIndex: {
            cell: { id, field },
            columnHeader: null,
            columnHeaderFilter: null,
            columnGroupHeader: null,
          },
          focus: {
            cell: { id, field },
            columnHeader: null,
            columnHeaderFilter: null,
            columnGroupHeader: null,
          },
        };
      });

      // The row might have been deleted
      if (!apiRef.current.getRow(id)) {
        return;
      }

      if (focusedCell) {
        // There's a focused cell but another cell was clicked
        // Publishes an event to notify that the focus was lost
        publishCellFocusOut(focusedCell, {});
      }

      apiRef.current.publishEvent('cellFocusIn', apiRef.current.getCellParams(id, field));
    },
    [apiRef, logger, publishCellFocusOut],
  );

  const setColumnHeaderFocus = React.useCallback<GridFocusApi['setColumnHeaderFocus']>(
    (field, event = {}) => {
      const cell = gridFocusCellSelector(apiRef);
      publishCellFocusOut(cell, event);

      apiRef.current.setState((state) => {
        logger.debug(`Focusing on column header with colIndex=${field}`);

        return {
          ...state,
          tabIndex: {
            columnHeader: { field },
            columnHeaderFilter: null,
            cell: null,
            columnGroupHeader: null,
          },
          focus: {
            columnHeader: { field },
            columnHeaderFilter: null,
            cell: null,
            columnGroupHeader: null,
          },
        };
      });
    },
    [apiRef, logger, publishCellFocusOut],
  );

  const setColumnHeaderFilterFocus = React.useCallback<GridFocusApi['setColumnHeaderFilterFocus']>(
    (field, event = {}) => {
      const cell = gridFocusCellSelector(apiRef);
      publishCellFocusOut(cell, event);

      apiRef.current.setState((state) => {
        logger.debug(`Focusing on column header filter with colIndex=${field}`);

        return {
          ...state,
          tabIndex: {
            columnHeader: null,
            columnHeaderFilter: { field },
            cell: null,
            columnGroupHeader: null,
          },
          focus: {
            columnHeader: null,
            columnHeaderFilter: { field },
            cell: null,
            columnGroupHeader: null,
          },
        };
      });
    },
    [apiRef, logger, publishCellFocusOut],
  );

  const setColumnGroupHeaderFocus = React.useCallback<
    GridFocusPrivateApi['setColumnGroupHeaderFocus']
  >(
    (field, depth, event = {}) => {
      const cell = gridFocusCellSelector(apiRef);
      if (cell) {
        apiRef.current.publishEvent(
          'cellFocusOut',
          apiRef.current.getCellParams(cell.id, cell.field),
          event,
        );
      }

      apiRef.current.setState((state) => {
        return {
          ...state,
          tabIndex: {
            columnGroupHeader: { field, depth },
            columnHeader: null,
            columnHeaderFilter: null,
            cell: null,
          },
          focus: {
            columnGroupHeader: { field, depth },
            columnHeader: null,
            columnHeaderFilter: null,
            cell: null,
          },
        };
      });
    },
    [apiRef],
  );

  const getColumnGroupHeaderFocus = React.useCallback<
    GridFocusPrivateApi['getColumnGroupHeaderFocus']
  >(() => gridFocusColumnGroupHeaderSelector(apiRef), [apiRef]);

  const moveFocusToRelativeCell = React.useCallback<GridFocusPrivateApi['moveFocusToRelativeCell']>(
    (id, field, direction) => {
      let columnIndexToFocus = apiRef.current.getColumnIndex(field);
      const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);

      const currentPage = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });
      const pinnedRows = gridPinnedRowsSelector(apiRef);

      // Include pinned rows as well
      const currentPageRows = ([] as GridRowEntry[]).concat(
        pinnedRows.top || [],
        currentPage.rows,
        pinnedRows.bottom || [],
      );

      let rowIndexToFocus = currentPageRows.findIndex((row) => row.id === id);

      if (direction === 'right') {
        columnIndexToFocus += 1;
      } else if (direction === 'left') {
        columnIndexToFocus -= 1;
      } else {
        rowIndexToFocus += 1;
      }

      if (columnIndexToFocus >= visibleColumns.length) {
        // Go to next row if we are after the last column
        rowIndexToFocus += 1;

        if (rowIndexToFocus < currentPageRows.length) {
          // Go to first column of the next row if there's one more row
          columnIndexToFocus = 0;
        }
      } else if (columnIndexToFocus < 0) {
        // Go to previous row if we are before the first column
        rowIndexToFocus -= 1;

        if (rowIndexToFocus >= 0) {
          // Go to last column of the previous if there's one more row
          columnIndexToFocus = visibleColumns.length - 1;
        }
      }

      rowIndexToFocus = clamp(rowIndexToFocus, 0, currentPageRows.length - 1);
      const rowToFocus: GridRowEntry | undefined = currentPageRows[rowIndexToFocus];

      if (!rowToFocus) {
        return;
      }

      const colSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
        rowToFocus.id,
        columnIndexToFocus,
      );
      if (colSpanInfo && colSpanInfo.spannedByColSpan) {
        if (direction === 'left' || direction === 'below') {
          columnIndexToFocus = colSpanInfo.leftVisibleCellIndex;
        } else if (direction === 'right') {
          columnIndexToFocus = colSpanInfo.rightVisibleCellIndex;
        }
      }

      columnIndexToFocus = clamp(columnIndexToFocus, 0, visibleColumns.length - 1);
      const columnToFocus = visibleColumns[columnIndexToFocus];
      apiRef.current.setCellFocus(rowToFocus.id, columnToFocus.field);
    },
    [apiRef, props.pagination, props.paginationMode],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<'cellDoubleClick'>>(
    ({ id, field }) => {
      apiRef.current.setCellFocus(id, field);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (
        isPasteShortcut(event) ||
        event.key === 'Enter' ||
        event.key === 'Tab' ||
        event.key === 'Shift' ||
        isNavigationKey(event.key)
      ) {
        return;
      }
      apiRef.current.setCellFocus(params.id, params.field);
    },
    [apiRef],
  );

  const handleColumnHeaderFocus = React.useCallback<GridEventListener<'columnHeaderFocus'>>(
    ({ field }, event) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef],
  );

  const handleColumnGroupHeaderFocus = React.useCallback<
    GridEventListener<'columnGroupHeaderFocus'>
  >(
    ({ fields, depth }, event) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      const focusedColumnGroup = gridFocusColumnGroupHeaderSelector(apiRef);
      if (
        focusedColumnGroup !== null &&
        focusedColumnGroup.depth === depth &&
        fields.includes(focusedColumnGroup.field)
      ) {
        // This group cell has already been focused
        return;
      }
      apiRef.current.setColumnGroupHeaderFocus(fields[0], depth, event);
    },
    [apiRef],
  );

  const handleBlur = React.useCallback<GridEventListener<'columnHeaderBlur'>>(
    (_, event) => {
      if (event.relatedTarget?.getAttribute('class')?.includes(gridClasses.columnHeader)) {
        return;
      }
      logger.debug(`Clearing focus`);
      apiRef.current.setState((state) => ({
        ...state,
        focus: {
          cell: null,
          columnHeader: null,
          columnHeaderFilter: null,
          columnGroupHeader: null,
        },
      }));
    },
    [logger, apiRef],
  );

  const handleCellMouseDown = React.useCallback<GridEventListener<'cellMouseDown'>>((params) => {
    lastClickedCell.current = params;
  }, []);

  const handleDocumentClick = React.useCallback(
    (event: MouseEvent) => {
      const cellParams = lastClickedCell.current;
      lastClickedCell.current = null;

      const focusedCell = gridFocusCellSelector(apiRef);

      const canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
        event,
        cell: cellParams,
      });

      if (!canUpdateFocus) {
        return;
      }

      if (!focusedCell) {
        if (cellParams) {
          apiRef.current.setCellFocus(cellParams.id, cellParams.field);
        }
        return;
      }

      if (cellParams?.id === focusedCell.id && cellParams?.field === focusedCell.field) {
        return;
      }

      const cellElement = apiRef.current.getCellElement(focusedCell.id, focusedCell.field);
      if (cellElement?.contains(event.target as HTMLElement)) {
        return;
      }

      if (cellParams) {
        apiRef.current.setCellFocus(cellParams.id, cellParams.field);
      } else {
        apiRef.current.setState((state) => ({
          ...state,
          focus: {
            cell: null,
            columnHeader: null,
            columnHeaderFilter: null,
            columnGroupHeader: null,
          },
        }));

        // There's a focused cell but another element (not a cell) was clicked
        // Publishes an event to notify that the focus was lost
        publishCellFocusOut(focusedCell, event);
      }
    },
    [apiRef, publishCellFocusOut],
  );

  const handleCellModeChange = React.useCallback<GridEventListener<'cellModeChange'>>(
    (params) => {
      if (params.cellMode === 'view') {
        return;
      }
      const cell = gridFocusCellSelector(apiRef);
      if (cell?.id !== params.id || cell?.field !== params.field) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef],
  );

  const handleRowsSet = React.useCallback<GridEventListener<'rowsSet'>>(() => {
    const cell = gridFocusCellSelector(apiRef);

    // If the focused cell is in a row which does not exist anymore,
    // focus previous row or remove the focus
    if (cell && !apiRef.current.getRow(cell.id)) {
      const lastFocusedRowId = cell.id;

      let nextRowId: GridRowId | null = null;
      if (typeof lastFocusedRowId !== 'undefined') {
        const rowEl = apiRef.current.getRowElement(lastFocusedRowId);
        const lastFocusedRowIndex = rowEl?.dataset.rowindex ? Number(rowEl?.dataset.rowindex) : 0;
        const currentPage = getVisibleRows(apiRef, {
          pagination: props.pagination,
          paginationMode: props.paginationMode,
        });

        const nextRow =
          currentPage.rows[clamp(lastFocusedRowIndex, 0, currentPage.rows.length - 1)];
        nextRowId = nextRow?.id ?? null;
      }

      apiRef.current.setState((state) => ({
        ...state,
        focus: {
          cell: nextRowId === null ? null : { id: nextRowId, field: cell.field },
          columnHeader: null,
          columnHeaderFilter: null,
          columnGroupHeader: null,
        },
      }));
    }
  }, [apiRef, props.pagination, props.paginationMode]);

  const debouncedHandleRowsSet = React.useMemo(() => debounce(handleRowsSet, 0), [handleRowsSet]);

  const handlePaginationModelChange = useEventCallback(() => {
    const currentFocusedCell = gridFocusCellSelector(apiRef);
    if (!currentFocusedCell) {
      return;
    }

    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode,
    });

    const rowIsInCurrentPage = currentPage.rows.find((row) => row.id === currentFocusedCell.id);
    if (rowIsInCurrentPage || currentPage.rows.length === 0) {
      return;
    }

    const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);

    apiRef.current.setState((state) => {
      return {
        ...state,
        tabIndex: {
          cell: { id: currentPage.rows[0].id, field: visibleColumns[0].field },
          columnGroupHeader: null,
          columnHeader: null,
          columnHeaderFilter: null,
        },
      };
    });
  });

  const focusApi: GridFocusApi = {
    setCellFocus,
    setColumnHeaderFocus,
    setColumnHeaderFilterFocus,
  };

  const focusPrivateApi: GridFocusPrivateApi = {
    moveFocusToRelativeCell,
    setColumnGroupHeaderFocus,
    getColumnGroupHeaderFocus,
  };

  useGridApiMethod(apiRef, focusApi, 'public');
  useGridApiMethod(apiRef, focusPrivateApi, 'private');

  React.useEffect(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current);
    doc.addEventListener('mouseup', handleDocumentClick);

    return () => {
      doc.removeEventListener('mouseup', handleDocumentClick);
    };
  }, [apiRef, hasRootReference, handleDocumentClick]);

  useGridEvent(apiRef, 'columnHeaderBlur', handleBlur);
  useGridEvent(apiRef, 'cellDoubleClick', handleCellDoubleClick);
  useGridEvent(apiRef, 'cellMouseDown', handleCellMouseDown);
  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEvent(apiRef, 'cellModeChange', handleCellModeChange);
  useGridEvent(apiRef, 'columnHeaderFocus', handleColumnHeaderFocus);
  useGridEvent(apiRef, 'columnGroupHeaderFocus', handleColumnGroupHeaderFocus);
  useGridEvent(apiRef, 'rowsSet', debouncedHandleRowsSet);
  useGridEvent(apiRef, 'paginationModelChange', handlePaginationModelChange);
};
