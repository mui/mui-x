import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridEvents, GridEventListener } from '../../../models/events';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridFocusApi } from '../../../models/api/gridFocusApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridFocusCellSelector } from './gridFocusStateSelector';

/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */
export const useGridFocus = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'rows'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFocus');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    focus: { cell: null, columnHeader: null },
    tabIndex: { cell: null, columnHeader: null },
  }));
  const lastClickedCell = React.useRef<GridCellParams | null>(null);

  const setCellFocus = React.useCallback(
    (id: GridRowId, field: string) => {
      // The row might have been deleted
      if (!apiRef.current.getRow(id)) {
        return;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (focusedCell?.id === id && focusedCell.field === field) {
        return;
      }

      apiRef.current.setState((state) => {
        logger.debug(`Focusing on cell with id=${id} and field=${field}`);
        return {
          ...state,
          tabIndex: { cell: { id, field }, columnHeader: null },
          focus: { cell: { id, field }, columnHeader: null },
        };
      });
      apiRef.current.forceUpdate();
      apiRef.current.publishEvent(GridEvents.cellFocusIn, apiRef.current.getCellParams(id, field));
    },
    [apiRef, logger],
  );

  const setColumnHeaderFocus = React.useCallback<GridFocusApi['setColumnHeaderFocus']>(
    (field, event = {}) => {
      const cell = gridFocusCellSelector(apiRef);
      if (cell) {
        apiRef.current.publishEvent(
          GridEvents.cellFocusOut,
          apiRef.current.getCellParams(cell.id, cell.field),
          event,
        );
      }

      apiRef.current.setState((state) => {
        logger.debug(`Focusing on column header with colIndex=${field}`);

        return {
          ...state,
          tabIndex: { columnHeader: { field }, cell: null },
          focus: { columnHeader: { field }, cell: null },
        };
      });

      apiRef.current.forceUpdate();
    },
    [apiRef, logger],
  );

  const handleCellDoubleClick = React.useCallback<GridEventListener<GridEvents.cellDoubleClick>>(
    ({ id, field }) => {
      apiRef.current.setCellFocus(id, field);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
      if (event.key === 'Enter' || event.key === 'Tab' || isNavigationKey(event.key)) {
        return;
      }
      apiRef.current.setCellFocus(params.id, params.field);
    },
    [apiRef],
  );

  const handleColumnHeaderFocus = React.useCallback<
    GridEventListener<GridEvents.columnHeaderFocus>
  >(
    ({ field }, event) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef],
  );

  const handleBlur = React.useCallback<GridEventListener<GridEvents.columnHeaderBlur>>(() => {
    logger.debug(`Clearing focus`);
    apiRef.current.setState((state) => ({
      ...state,
      focus: { cell: null, columnHeader: null },
    }));
  }, [logger, apiRef]);

  const handleCellMouseUp = React.useCallback<GridEventListener<GridEvents.cellMouseUp>>(
    (params) => {
      lastClickedCell.current = params;
    },
    [],
  );

  const handleDocumentClick = React.useCallback(
    (event: MouseEvent) => {
      const cellParams = lastClickedCell.current;
      lastClickedCell.current = null;

      const focusedCell = gridFocusCellSelector(apiRef);

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

      // The row might have been deleted during the click
      if (!apiRef.current.getRow(focusedCell.id)) {
        return;
      }

      // There's a focused cell but another cell was clicked
      // Publishes an event to notify that the focus was lost
      apiRef.current.publishEvent(
        GridEvents.cellFocusOut,
        apiRef.current.getCellParams(focusedCell.id, focusedCell.field),
        event,
      );

      if (cellParams) {
        apiRef.current.setCellFocus(cellParams.id, cellParams.field);
      } else {
        apiRef.current.setState((state) => ({
          ...state,
          focus: { cell: null, columnHeader: null },
        }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef],
  );

  const handleCellModeChange = React.useCallback<GridEventListener<GridEvents.cellModeChange>>(
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

  useGridApiMethod(
    apiRef,
    {
      setCellFocus,
      setColumnHeaderFocus,
    },
    'GridFocusApi',
  );

  React.useEffect(() => {
    const cell = gridFocusCellSelector(apiRef);

    if (cell) {
      const updatedRow = apiRef.current.getRow(cell.id);

      if (!updatedRow) {
        apiRef.current.setState((state) => ({
          ...state,
          focus: { cell: null, columnHeader: null },
        }));
      }
    }
  }, [apiRef, props.rows]);

  React.useEffect(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
    doc.addEventListener('click', handleDocumentClick);

    return () => {
      doc.removeEventListener('click', handleDocumentClick);
    };
  }, [apiRef, handleDocumentClick]);

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderBlur, handleBlur);
  useGridApiEventHandler(apiRef, GridEvents.cellDoubleClick, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GridEvents.cellMouseUp, handleCellMouseUp);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellModeChange, handleCellModeChange);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderFocus, handleColumnHeaderFocus);
};
