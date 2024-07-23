import * as React from 'react';
import {
  unstable_ownerDocument as ownerDocument,
  unstable_useEventCallback as useEventcallback,
} from '@mui/utils';
import { gridClasses } from '../../../constants/gridClasses';
import { GridEventListener, GridEventLookup } from '../../../models/events';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridFocusApi, GridFocusPrivateApi } from '../../../models/api/gridFocusApi';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import {
  gridFocusCellSelector,
  gridFocusColumnGroupHeaderSelector,
} from './gridFocusStateSelector';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { clamp } from '../../../utils/utils';
import { GridCellCoordinates } from '../../../models/gridCell';
import { GridRowEntry } from '../../../models/gridRows';
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
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFocus');

  const lastClickedCell = React.useRef<GridCellParams | null>(null);

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
      apiRef.current.forceUpdate();

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

      apiRef.current.forceUpdate();
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

      apiRef.current.forceUpdate();
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

      apiRef.current.forceUpdate();
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
      // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
      if (
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
        apiRef.current.forceUpdate();

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

  const handleRowSet = React.useCallback<GridEventListener<'rowsSet'>>(() => {
    const cell = gridFocusCellSelector(apiRef);

    // If the focused cell is in a row which does not exist anymore, then remove the focus
    if (cell && !apiRef.current.getRow(cell.id)) {
      apiRef.current.setState((state) => ({
        ...state,
        focus: {
          cell: null,
          columnHeader: null,
          columnHeaderFilter: null,
          columnGroupHeader: null,
        },
      }));
    }
  }, [apiRef]);

  const handlePaginationModelChange = useEventcallback(() => {
    const currentFocusedCell = gridFocusCellSelector(apiRef);
    if (!currentFocusedCell) {
      return;
    }

    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode,
    });

    const rowIsInCurrentPage = currentPage.rows.find((row) => row.id === currentFocusedCell.id);
    if (rowIsInCurrentPage) {
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
  }, [apiRef, handleDocumentClick]);

  useGridApiEventHandler(apiRef, 'columnHeaderBlur', handleBlur);
  useGridApiEventHandler(apiRef, 'cellDoubleClick', handleCellDoubleClick);
  useGridApiEventHandler(apiRef, 'cellMouseDown', handleCellMouseDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridApiEventHandler(apiRef, 'cellModeChange', handleCellModeChange);
  useGridApiEventHandler(apiRef, 'columnHeaderFocus', handleColumnHeaderFocus);
  useGridApiEventHandler(apiRef, 'columnGroupHeaderFocus', handleColumnGroupHeaderFocus);
  useGridApiEventHandler(apiRef, 'rowsSet', handleRowSet);
  useGridApiEventHandler(apiRef, 'paginationModelChange', handlePaginationModelChange);
};
