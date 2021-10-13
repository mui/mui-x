import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFocusApi } from '../../../models/api/gridFocusApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridState } from '../../utils/useGridState';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { useGridStateInit } from '../../utils/useGridStateInit';

/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditRows (event)
 */
export const useGridFocus = (apiRef: GridApiRef, props: Pick<GridComponentProps, 'rows'>): void => {
  const logger = useGridLogger(apiRef, 'useGridFocus');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    focus: { cell: null, columnHeader: null },
    tabIndex: { cell: null, columnHeader: null },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const lastClickedCell = React.useRef<GridCellParams | null>(null);

  const setCellFocus = React.useCallback(
    (id: GridRowId, field: string) => {
      // The row might have been deleted
      if (!apiRef.current.getRow(id)) {
        return;
      }
      setGridState((state) => {
        logger.debug(`Focusing on cell with id=${id} and field=${field}`);
        return {
          ...state,
          tabIndex: { cell: { id, field }, columnHeader: null },
          focus: { cell: { id, field }, columnHeader: null },
        };
      });
      forceUpdate();
      apiRef.current.publishEvent(GridEvents.cellFocusIn, apiRef.current.getCellParams(id, field));
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const setColumnHeaderFocus = React.useCallback(
    (field: string, event?: React.SyntheticEvent) => {
      const { cell } = apiRef.current.state.focus;
      if (cell) {
        apiRef.current.publishEvent(
          GridEvents.cellFocusOut,
          apiRef.current.getCellParams(cell.id, cell.field),
          event,
        );
      }

      setGridState((state) => {
        logger.debug(`Focusing on column header with colIndex=${field}`);

        return {
          ...state,
          tabIndex: { columnHeader: { field }, cell: null },
          focus: { columnHeader: { field }, cell: null },
        };
      });

      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const handleCellDoubleClick = React.useCallback(
    ({ id, field }: GridCellParams) => {
      apiRef.current.setCellFocus(id, field);
    },
    [apiRef],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
      if (event.key === 'Enter' || event.key === 'Tab' || isNavigationKey(event.key)) {
        return;
      }
      apiRef.current.setCellFocus(params.id, params.field);
    },
    [apiRef],
  );

  const handleColumnHeaderFocus = React.useCallback(
    ({ field }: GridCellParams, event: React.FocusEvent) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef],
  );

  const handleBlur = React.useCallback(() => {
    logger.debug(`Clearing focus`);
    setGridState((state) => ({
      ...state,
      focus: { cell: null, columnHeader: null },
    }));
  }, [logger, setGridState]);

  const handleCellMouseUp = React.useCallback((params: GridCellParams) => {
    lastClickedCell.current = params;
  }, []);

  const handleDocumentClick = React.useCallback(
    (event: MouseEvent) => {
      const cellParams = lastClickedCell.current;
      lastClickedCell.current = null;

      const { cell: focusedCell } = apiRef.current.state.focus;

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
        setGridState((state) => ({
          ...state,
          focus: { cell: null, columnHeader: null },
        }));
        forceUpdate();
      }
    },
    [apiRef, forceUpdate, setGridState],
  );

  const handleCellModeChange = React.useCallback(
    (params: GridCellParams) => {
      if (params.cellMode === 'view') {
        return;
      }
      const { cell } = apiRef.current.state.focus;
      if (cell?.id !== params.id || cell?.field !== params.field) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef],
  );

  useGridApiMethod<GridFocusApi>(
    apiRef,
    {
      setCellFocus,
      setColumnHeaderFocus,
    },
    'GridFocusApi',
  );

  React.useEffect(() => {
    const { cell } = apiRef.current.state.focus;

    if (cell) {
      const updatedRow = apiRef.current.getRow(cell.id);

      if (!updatedRow) {
        setGridState((state) => ({
          ...state,
          focus: { cell: null, columnHeader: null },
        }));
      }
    }
  }, [apiRef, setGridState, props.rows]);

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
