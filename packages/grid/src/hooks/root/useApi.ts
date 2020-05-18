import React, { useEffect, useRef, useState } from 'react';
import { useLogger } from '../utils/useLogger';
import { EventEmitter } from 'events';
import {
  CELL_CLICKED,
  CLICK_EVENT,
  COL_RESIZE_START,
  COL_RESIZE_STOP,
  COLUMN_HEADER_CLICKED,
  KEYDOWN_EVENT,
  KEYUP_EVENT,
  ROW_CLICKED,
  ROW_SELECTED_EVENT,
  SELECTION_CHANGED_EVENT,
} from '../../constants/eventsConstants';
import { CellClickedParam, CoreApi, GridOptions, RowClickedParam } from '../../models';
import { GridApi } from '../../models/gridApi';
import { GridApiRef } from '../../grid';
import { CELL_CSS_CLASS, HEADER_CELL_CSS_CLASS, ROW_CSS_CLASS } from '../../constants/cssClassesConstants';
import {
  findParentElementFromClassName,
  getDataFromElem,
  getFieldFromHeaderElem,
  getIdFromRowElem,
  isCell,
  isHeaderCell,
} from '../../utils/domUtils';

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

  const initApi = () => {
    logger.debug('Initialising grid api.');
    const api = new EventEmitter();
    apiRef.current = api as GridApi;
    setApiInitialised(true);
  };

  useEffect(() => {
    if (apiRef) {
      initApi();
    }
  }, [apiRef]);

  const emitEvent = (name: string, ...args: any[]) => {
    if (apiRef && apiRef.current && isApiInitialised) {
      apiRef.current.emit(name, ...args);
    }
  };

  const getHandler = (name: string) => (...args: any[]) => emitEvent(name, ...args);

  const handleResizeStart = () => (isResizingRef.current = true);
  const handleResizeStop = () => (isResizingRef.current = false);

  const onClickHandler = (e: MouseEvent) => {
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
      if (!column.disableClickEventBubbling) {
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
  };

  const registerEvent = (event: string, handler: (param: any) => void): (() => void) => {
    apiRef!.current!.on(event, handler);
    return () => {
      apiRef!.current!.removeListener(event, handler);
    };
  };
  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding row selection to api');

      const coreApi: Partial<CoreApi> = { registerEvent };
      apiRef.current = Object.assign(apiRef.current, coreApi) as GridApi;
    }
  }, [apiRef]);

  useEffect(() => {
    if (gridRootRef && gridRootRef.current && isApiInitialised) {
      const keyDownHandler = getHandler(KEYDOWN_EVENT);
      const keyUpHandler = getHandler(KEYUP_EVENT);

      gridRootRef.current.addEventListener(CLICK_EVENT, onClickHandler, { capture: true });
      document.addEventListener(KEYDOWN_EVENT, keyDownHandler);
      document.addEventListener(KEYUP_EVENT, keyUpHandler);

      apiRef.current!.isInitialised = true;
      setInit(true);

      apiRef.current!.on(COL_RESIZE_START, handleResizeStart);
      apiRef.current!.on(COL_RESIZE_STOP, handleResizeStop);

      return () => {
        logger.info('Clearing all events listeners');
        gridRootRef.current!.removeEventListener(CLICK_EVENT, onClickHandler, { capture: true });
        document.removeEventListener(KEYDOWN_EVENT, keyDownHandler);
        document.removeEventListener(KEYUP_EVENT, keyUpHandler);

        apiRef.current?.removeAllListeners();
      };
    }
  }, [gridRootRef, isApiInitialised]);

  useEffect(() => {
    if (!apiRef || !apiRef.current) {
      return;
    }

    const unsubscribeHandlers: Array<() => void> = [];

    if (options.onCellClicked) {
      apiRef.current.on(CELL_CLICKED, options.onCellClicked);
      unsubscribeHandlers.push(() => apiRef.current!.removeListener(CELL_CLICKED, options.onCellClicked!));
    }
    if (options.onRowClicked) {
      apiRef.current.on(ROW_CLICKED, options.onRowClicked);
      unsubscribeHandlers.push(() => apiRef.current!.removeListener(ROW_CLICKED, options.onRowClicked!));
    }
    if (options.onRowSelected) {
      apiRef.current.on(ROW_SELECTED_EVENT, options.onRowSelected);
      unsubscribeHandlers.push(() => apiRef.current!.removeListener(ROW_SELECTED_EVENT, options.onRowSelected!));
    }
    if (options.onSelectionChanged) {
      apiRef.current.on(SELECTION_CHANGED_EVENT, options.onSelectionChanged);
      unsubscribeHandlers.push(() =>
        apiRef.current!.removeListener(SELECTION_CHANGED_EVENT, options.onSelectionChanged!),
      );
    }
    if (options.onColumnHeaderClicked) {
      apiRef.current.on(COLUMN_HEADER_CLICKED, options.onColumnHeaderClicked);
      unsubscribeHandlers.push(() =>
        apiRef.current!.removeListener(COLUMN_HEADER_CLICKED, options.onColumnHeaderClicked!),
      );
    }
    return () => {
      logger.info(`Clearing all subscribed options handlers`);
      unsubscribeHandlers.forEach(unsubscribeHandler => unsubscribeHandler());
    };
  }, [options]);

  return initialised;
};
