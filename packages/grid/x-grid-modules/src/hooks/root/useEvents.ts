import * as React from 'react';
import { useLogger } from '../utils/useLogger';
import {
  CELL_CLICK,
  CLICK,
  COL_RESIZE_START,
  COL_RESIZE_STOP,
  COLUMN_HEADER_CLICK,
  UNMOUNT,
  KEYDOWN,
  KEYUP,
  RESIZE,
  ROW_CLICK,
  MOUSE_HOVER,
  CELL_HOVER,
  ROW_HOVER,
  COLUMN_HEADER_HOVER,
  FOCUS_OUT,
  GRID_FOCUS_OUT,
  COMPONENT_ERROR,
} from '../../constants/eventsConstants';
import { GridOptions, ApiRef, CellParams, ColParams, RowParams } from '../../models';
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
import { EventsApi } from '../../models/api/eventsApi';

export function useEvents(
  gridRootRef: React.RefObject<HTMLDivElement>,
  options: GridOptions,
  apiRef: ApiRef,
): void {
  //  We use the isResizingRef to prevent the click on column header when the user is resizing the column
  const isResizingRef = React.useRef(false);
  const logger = useLogger('useEvents');

  const getHandler = React.useCallback(
    (name: string) => (...args: any[]) => apiRef.current.publishEvent(name, ...args),
    [apiRef],
  );

  const getEventParams = React.useCallback(
    (event: MouseEvent) => {
      if (event.target == null) {
        throw new Error(
          `Event target null - Target has been removed or component might already be unmounted.`,
        );
      }

      const elem = event.target as HTMLElement;
      const eventParams: { cell?: CellParams; row?: RowParams; header?: ColParams } = {};

      if (isCell(elem)) {
        const cellEl = findParentElementFromClassName(elem, CELL_CSS_CLASS)! as HTMLElement;
        const rowEl = findParentElementFromClassName(elem, ROW_CSS_CLASS)! as HTMLElement;
        const id = getIdFromRowElem(rowEl);
        const rowModel = apiRef.current.getRowFromId(id);
        const rowIndex = apiRef.current.getRowIndexFromId(id);
        const field = getDataFromElem(cellEl, 'field');
        const value = getDataFromElem(cellEl, 'value');
        const column = apiRef.current.getColumnFromField(field);
        if (!column || !column.disableClickEventBubbling) {
          const commonParams = {
            data: rowModel.data,
            rowIndex,
            colDef: column,
            rowModel,
            api: apiRef.current,
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
        const column = apiRef.current.getColumnFromField(field);
        const colIndex = apiRef.current.getColumnIndex(field);
        const colHeaderParams: ColParams = {
          field,
          colDef: column,
          colIndex,
          api: apiRef.current,
        };
        eventParams.header = colHeaderParams;
      }
      return eventParams;
    },
    [apiRef],
  );

  const onClickHandler = React.useCallback(
    (event: MouseEvent) => {
      const eventParams = getEventParams(event);

      if (!eventParams) {
        return;
      }

      if (eventParams.cell) {
        apiRef.current.publishEvent(CELL_CLICK, eventParams.cell);
      }
      if (eventParams.row) {
        apiRef.current.publishEvent(ROW_CLICK, eventParams.row);
      }
      if (eventParams.header) {
        apiRef.current.publishEvent(COLUMN_HEADER_CLICK, eventParams.header);
      }
    },
    [apiRef, getEventParams],
  );

  const onHoverHandler = React.useCallback(
    (event: MouseEvent) => {
      const eventParams = getEventParams(event);

      if (!eventParams) {
        return;
      }

      if (eventParams.cell) {
        apiRef.current.publishEvent(CELL_HOVER, eventParams.cell);
      }
      if (eventParams.row) {
        apiRef.current.publishEvent(ROW_HOVER, eventParams.row);
      }
      if (eventParams.header) {
        apiRef.current.publishEvent(COLUMN_HEADER_HOVER, eventParams.header);
      }
    },
    [apiRef, getEventParams],
  );

  const onFocusOutHandler = React.useCallback(
    (event: FocusEvent) => {
      apiRef.current.publishEvent(FOCUS_OUT, event);
      if (event.relatedTarget === null) {
        apiRef.current.publishEvent(GRID_FOCUS_OUT, event);
      }
    },
    [apiRef],
  );

  const onUnmount = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return apiRef.current.subscribeEvent(UNMOUNT, handler);
    },
    [apiRef],
  );
  const onResize = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return apiRef.current.subscribeEvent(RESIZE, handler);
    },
    [apiRef],
  );

  const handleResizeStart = React.useCallback(() => {
    isResizingRef.current = true;
  }, [isResizingRef]);

  const handleResizeStop = React.useCallback(() => {
    isResizingRef.current = false;
  }, [isResizingRef]);

  const resize = React.useCallback(() => apiRef.current.publishEvent(RESIZE), [apiRef]);
  const eventsApi: EventsApi = { resize, onUnmount, onResize };
  useApiMethod(apiRef, eventsApi, 'EventsApi');

  useApiEventHandler(apiRef, COL_RESIZE_START, handleResizeStart);
  useApiEventHandler(apiRef, COL_RESIZE_STOP, handleResizeStop);

  useApiEventHandler(apiRef, COLUMN_HEADER_CLICK, options.onColumnHeaderClick);
  useApiEventHandler(apiRef, CELL_CLICK, options.onCellClick);
  useApiEventHandler(apiRef, ROW_CLICK, options.onRowClick);
  useApiEventHandler(apiRef, CELL_HOVER, options.onCellHover);
  useApiEventHandler(apiRef, ROW_HOVER, options.onRowHover);
  useApiEventHandler(apiRef, COMPONENT_ERROR, options.onError);

  React.useEffect(() => {
    if (gridRootRef && gridRootRef.current && apiRef.current?.isInitialised) {
      logger.debug('Binding events listeners');
      const keyDownHandler = getHandler(KEYDOWN);
      const keyUpHandler = getHandler(KEYUP);
      const gridRootElem = gridRootRef.current;

      gridRootRef.current.addEventListener(CLICK, onClickHandler, { capture: true });
      gridRootRef.current.addEventListener(MOUSE_HOVER, onHoverHandler, { capture: true });
      gridRootRef.current.addEventListener(FOCUS_OUT, onFocusOutHandler);

      document.addEventListener(KEYDOWN, keyDownHandler);
      document.addEventListener(KEYUP, keyUpHandler);

      apiRef.current.isInitialised = true;
      const api = apiRef.current;

      return () => {
        logger.warn('Clearing all events listeners');
        api.publishEvent(UNMOUNT);
        gridRootElem.removeEventListener(CLICK, onClickHandler, { capture: true });
        gridRootElem.removeEventListener(MOUSE_HOVER, onHoverHandler, { capture: true });
        gridRootElem.removeEventListener(FOCUS_OUT, onFocusOutHandler);
        document.removeEventListener(KEYDOWN, keyDownHandler);
        document.removeEventListener(KEYUP, keyUpHandler);
        api.removeAllListeners();
      };
    }
    return undefined;
  }, [
    gridRootRef,
    apiRef.current?.isInitialised,
    getHandler,
    logger,
    onClickHandler,
    onHoverHandler,
    onFocusOutHandler,
    apiRef,
  ]);
}
