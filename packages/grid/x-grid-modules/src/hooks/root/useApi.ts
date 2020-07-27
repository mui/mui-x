import * as React from 'react';
import { useLogger } from '../utils/useLogger';
import {
  CELL_CLICK,
  CLICK_EVENT,
  COL_RESIZE_START,
  COL_RESIZE_STOP,
  COLUMN_HEADER_CLICK,
  COLUMNS_SORTED,
  UNMOUNT,
  KEYDOWN_EVENT,
  KEYUP_EVENT,
  RESIZE,
  ROW_CLICK,
  ROW_SELECTED_EVENT,
  SELECTION_CHANGED_EVENT,
  HOVER_EVENT,
  CELL_HOVER,
  ROW_HOVER,
  COLUMN_HEADER_HOVER,
} from '../../constants/eventsConstants';
import { GridOptions, ApiRef, CellParams, ColParams, RowParams } from '../../models';
import { GridApi } from '../../models/api/gridApi';
import {
  CELL_CSS_CLASS,
  HEADER_CELL_CSS_CLASS,
  ROW_CSS_CLASS,
} from '../../constants/cssClassesConstants';
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
import { buildCellParams, buildRowParams } from '../../utils/paramsUtils';

const EventEmitter = require('events').EventEmitter;

// TODO Split this effect in useEvents and UseApi
export function useApi(
  gridRootRef: React.RefObject<HTMLDivElement>,
  windowRef: React.RefObject<HTMLDivElement>,
  options: GridOptions,
  apiRef: ApiRef,
): boolean {
  const [isApiInitialised, setApiInitialised] = React.useState(false);
  const [initialised, setInit] = React.useState(false);
  const isResizingRef = React.useRef(false);
  const logger = useLogger('useApi');

  const initApi = React.useCallback(() => {
    logger.debug('Initialising grid api.');
    const api = new EventEmitter();
    apiRef.current = api as GridApi;
    setApiInitialised(true);
  }, [apiRef, logger, setApiInitialised]);

  React.useEffect(() => {
    if (apiRef) {
      initApi();
    }
  }, [apiRef, initApi]);

  const emitEvent = React.useCallback(
    (name: string, ...args: any[]) => {
      if (apiRef && apiRef.current && isApiInitialised) {
        apiRef.current.emit(name, ...args);
      }
    },
    [apiRef, isApiInitialised],
  );

  const getHandler = React.useCallback(
    (name: string) => (...args: any[]) => emitEvent(name, ...args),
    [emitEvent],
  );

  const handleResizeStart = React.useCallback(() => {
    isResizingRef.current = true;
  }, [isResizingRef]);

  const handleResizeStop = React.useCallback(() => {
    isResizingRef.current = false;
  }, [isResizingRef]);

  const getEventParams = React.useCallback(
    (event: any) => {
      if (event.target == null) {
        return null;
      }
      const elem = event.target as HTMLElement;
      const eventParams: { cell?: CellParams; row?: RowParams; header?: ColParams } = {};

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
          const commonParams = {
            data: rowModel.data,
            rowIndex,
            colDef: column,
            rowModel,
            api: apiRef.current!,
          };
          eventParams.cell = buildCellParams({
            ...commonParams,
            element: cellEl,
            value,
          });
          eventParams.row = buildRowParams({
            ...commonParams,
            element: rowEl,
          });
        }
      } else if (isHeaderCell(elem) && !isResizingRef.current) {
        const headerCell = findParentElementFromClassName(elem, HEADER_CELL_CSS_CLASS)!;
        const field = getFieldFromHeaderElem(headerCell);
        const column = apiRef.current!.getColumnFromField(field);
        const colIndex = apiRef.current!.getColumnIndex(field);
        const colHeaderParams: ColParams = {
          field,
          colDef: column,
          colIndex,
          api: apiRef.current!,
        };
        eventParams.header = colHeaderParams;
      }
      return eventParams;
    },
    [emitEvent, apiRef],
  );

  const onClickHandler = React.useCallback(
    (event: MouseEvent) => {
      const eventParams = getEventParams(event);

      if (!eventParams) {
        return;
      }

      if (eventParams.cell) {
        emitEvent(CELL_CLICK, eventParams.cell);
      }
      if (eventParams.row) {
        emitEvent(ROW_CLICK, eventParams.row);
      }
      if (eventParams.header) {
        emitEvent(COLUMN_HEADER_CLICK, eventParams.header);
      }
    },
    [emitEvent, apiRef],
  );

  const onHoverHandler = React.useCallback(
    (event: any) => {
      const eventParams = getEventParams(event);

      if (!eventParams) {
        return;
      }

      if (eventParams.cell) {
        emitEvent(CELL_HOVER, eventParams.cell);
      }
      if (eventParams.row) {
        emitEvent(ROW_HOVER, eventParams.row);
      }
      if (eventParams.header) {
        emitEvent(COLUMN_HEADER_HOVER, eventParams.header);
      }
    },
    [emitEvent, apiRef],
  );

  const registerEvent = React.useCallback(
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
  const onUnmount = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return registerEvent(UNMOUNT, handler);
    },
    [registerEvent],
  );
  const onResize = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return registerEvent(RESIZE, handler);
    },
    [registerEvent],
  );
  const resize = React.useCallback(() => apiRef.current?.emit(RESIZE), [apiRef]);
  useApiMethod(apiRef, { registerEvent, onUnmount, onResize, resize }, 'CoreApi');

  React.useEffect(() => {
    if (gridRootRef && gridRootRef.current && isApiInitialised) {
      logger.debug('Binding events listeners');
      const keyDownHandler = getHandler(KEYDOWN_EVENT);
      const keyUpHandler = getHandler(KEYUP_EVENT);
      const gridRootElem = gridRootRef.current;

      gridRootRef.current.addEventListener(CLICK_EVENT, onClickHandler, { capture: true });
      gridRootRef.current.addEventListener(HOVER_EVENT, onHoverHandler, { capture: true });
      document.addEventListener(KEYDOWN_EVENT, keyDownHandler);
      document.addEventListener(KEYUP_EVENT, keyUpHandler);

      apiRef.current!.isInitialised = true;
      setInit(true);
      const api = apiRef.current!;

      return () => {
        logger.debug('Clearing all events listeners');
        api.emit(UNMOUNT);
        gridRootElem.removeEventListener(CLICK_EVENT, onClickHandler, { capture: true });
        gridRootElem.removeEventListener(HOVER_EVENT, onHoverHandler, { capture: true });
        document.removeEventListener(KEYDOWN_EVENT, keyDownHandler);
        document.removeEventListener(KEYUP_EVENT, keyUpHandler);
        api.removeAllListeners();
      };
    }

    return undefined;
  }, [gridRootRef, isApiInitialised, getHandler, logger, onClickHandler, apiRef]);

  useApiEventHandler(apiRef, COL_RESIZE_START, handleResizeStart);
  useApiEventHandler(apiRef, COL_RESIZE_STOP, handleResizeStop);
  useApiEventHandler(apiRef, CELL_CLICK, options.onCellClick);
  useApiEventHandler(apiRef, ROW_CLICK, options.onRowClick);
  useApiEventHandler(apiRef, CELL_HOVER, options.onCellHover);
  useApiEventHandler(apiRef, ROW_HOVER, options.onRowHover);
  useApiEventHandler(apiRef, ROW_SELECTED_EVENT, options.onRowSelected);
  useApiEventHandler(apiRef, SELECTION_CHANGED_EVENT, options.onSelectionChange);
  useApiEventHandler(apiRef, COLUMN_HEADER_CLICK, options.onColumnHeaderClick);
  useApiEventHandler(apiRef, COLUMNS_SORTED, options.onSortedColumns);

  return initialised;
}
