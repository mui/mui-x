import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLogger } from '../utils/useLogger';
import { EventEmitter } from 'events';
import {
  CELL_CLICKED,
  CLICK_EVENT,
  COL_RESIZE_START,
  COL_RESIZE_STOP,
  COLUMN_HEADER_CLICKED,
  COLUMNS_SORTED,
  UNMOUNT,
  KEYDOWN_EVENT,
  KEYUP_EVENT,
  RESIZE,
  ROW_CLICKED,
  ROW_SELECTED_EVENT,
  SELECTION_CHANGED_EVENT,
} from '../../constants/eventsConstants';
import { CellClickedParam, GridOptions, RowClickedParam } from '../../models';
import { GridApi } from '../../models/gridApi';
import { CELL_CSS_CLASS, HEADER_CELL_CSS_CLASS, ROW_CSS_CLASS } from '../../constants/cssClassesConstants';
import {
  findParentElementFromClassName,
  getDataFromElem,
  getFieldFromHeaderElem,
  getIdFromRowElem,
  isCell,
  isHeaderCell,
} from '../../utils/domUtils';
import { useApiMethod } from './useApiMethod';
import { useApiEventHandler } from './useApiEventHandler';
import { GridApiRef } from '../../models';

//TODO Split this effect in useEvents and UseApi
export const useApi = (
  gridRootRef: React.RefObject<HTMLDivElement>,
  windowRef: React.RefObject<HTMLDivElement>,
  options: GridOptions,
  apiRef: GridApiRef,
): boolean => {
  const [isApiInitialised, setApiInitialised] = useState(false);
  const [initialised, setInit] = useState(false);
  const isResizingRef = useRef(false);
  const logger = useLogger('useApi');

  const initApi = useCallback(() => {
    logger.debug('Initialising grid api.');
    const api = new EventEmitter();
    apiRef.current = api as GridApi;
    setApiInitialised(true);
  }, [apiRef, logger, setApiInitialised]);

  useEffect(() => {
    if (apiRef) {
      initApi();
    }
  }, [apiRef, initApi]);

  const emitEvent = useCallback(
    (name: string, ...args: any[]) => {
      if (apiRef && apiRef.current && isApiInitialised) {
        apiRef.current.emit(name, ...args);
      }
    },
    [apiRef, isApiInitialised],
  );

  const getHandler = useCallback((name: string) => (...args: any[]) => emitEvent(name, ...args), [emitEvent]);

  const handleResizeStart = useCallback(() => (isResizingRef.current = true), [isResizingRef]);
  const handleResizeStop = useCallback(() => (isResizingRef.current = false), [isResizingRef]);

  const onClickHandler = useCallback(
    (e: MouseEvent) => {
      if (e.target == null) {
        return;
      }
      const elem = e.target as HTMLElement;

      if (isCell(elem)) {
        const cellEl = findParentElementFromClassName(elem, CELL_CSS_CLASS)! as HTMLElement;
        const rowEl = findParentElementFromClassName(elem, ROW_CSS_CLASS)! as HTMLElement;
        const id = getIdFromRowElem(rowEl);
        const rowModel = apiRef!.current!.getRowFromId(id);
        const rowIndex = apiRef!.current!.getRowIndexFromId(id);
        const field = getDataFromElem(cellEl, 'field');
        const value = getDataFromElem(cellEl, 'value');
        const column = apiRef.current!.getColumnFromField(field);
        if (!column || !column.disableClickEventBubbling) {
          const commonParams = { data: rowModel.data, rowIndex, colDef: column };
          const cellParams: CellClickedParam = {
            element: cellEl,
            field,
            value,
            ...commonParams,
          };
          const rowParams: RowClickedParam = {
            element: rowEl,
            rowModel,
            ...commonParams,
          };
          emitEvent(CELL_CLICKED, cellParams);
          emitEvent(ROW_CLICKED, rowParams);
        }
      } else if (isHeaderCell(elem) && !isResizingRef.current) {
        const headerCell = findParentElementFromClassName(elem, HEADER_CELL_CSS_CLASS)!;
        const field = getFieldFromHeaderElem(headerCell);
        const column = apiRef.current!.getColumnFromField(field);
        const colHeaderParams = { field, column };
        emitEvent(COLUMN_HEADER_CLICKED, colHeaderParams);
      }
    },
    [emitEvent, apiRef],
  );

  const registerEvent = useCallback(
    (event: string, handler: (param: any) => void): (() => void) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current!.on(event, handler);
      const api = apiRef.current!;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.removeListener(event, handler);
      };
    },
    [apiRef, logger],
  );
  const onUnmount = useCallback(
    (handler: (param: any) => void): (() => void) => {
      return registerEvent(UNMOUNT, handler);
    },
    [registerEvent],
  );
  const onResize = useCallback(
    (handler: (param: any) => void): (() => void) => {
      return registerEvent(RESIZE, handler);
    },
    [registerEvent],
  );
  const resize = useCallback(() => apiRef.current?.emit(RESIZE), [apiRef]);
  useApiMethod(apiRef, { registerEvent, onUnmount, onResize, resize }, 'CoreApi');

  useEffect(() => {
    if (gridRootRef && gridRootRef.current && isApiInitialised) {
      logger.debug('Binding events listeners');
      const keyDownHandler = getHandler(KEYDOWN_EVENT);
      const keyUpHandler = getHandler(KEYUP_EVENT);
      const gridRootElem = gridRootRef.current;

      gridRootRef.current.addEventListener(CLICK_EVENT, onClickHandler, { capture: true });
      document.addEventListener(KEYDOWN_EVENT, keyDownHandler);
      document.addEventListener(KEYUP_EVENT, keyUpHandler);

      apiRef.current!.isInitialised = true;
      setInit(true);
      const api = apiRef.current!;

      return () => {
        logger.debug('Clearing all events listeners');
        api.emit(UNMOUNT);
        gridRootElem.removeEventListener(CLICK_EVENT, onClickHandler, { capture: true });
        document.removeEventListener(KEYDOWN_EVENT, keyDownHandler);
        document.removeEventListener(KEYUP_EVENT, keyUpHandler);
        api.removeAllListeners();
      };
    }
  }, [gridRootRef, isApiInitialised, getHandler, logger, onClickHandler, apiRef]);

  useApiEventHandler(apiRef, COL_RESIZE_START, handleResizeStart);
  useApiEventHandler(apiRef, COL_RESIZE_STOP, handleResizeStop);
  useApiEventHandler(apiRef, CELL_CLICKED, options.onCellClicked);
  useApiEventHandler(apiRef, ROW_CLICKED, options.onRowClicked);
  useApiEventHandler(apiRef, ROW_SELECTED_EVENT, options.onRowSelected);
  useApiEventHandler(apiRef, SELECTION_CHANGED_EVENT, options.onSelectionChanged);
  useApiEventHandler(apiRef, COLUMN_HEADER_CLICKED, options.onColumnHeaderClicked);
  useApiEventHandler(apiRef, COLUMNS_SORTED, options.onColumnsSorted);

  return initialised;
};
