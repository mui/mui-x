import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from '../utils/optionsSelector';
import { useLogger } from '../utils/useLogger';
import {
  GRID_CELL_CLICK,
  GRID_COL_RESIZE_START,
  GRID_COL_RESIZE_STOP,
  GRID_COLUMN_HEADER_CLICK,
  GRID_UNMOUNT,
  GRID_KEYDOWN,
  GRID_KEYUP,
  GRID_RESIZE,
  GRID_ROW_CLICK,
  GRID_CELL_OVER,
  GRID_ROW_OVER,
  GRID_FOCUS_OUT,
  GRID_ELEMENT_FOCUS_OUT,
  GRID_COMPONENT_ERROR,
  GRID_STATE_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_ROW_DOUBLE_CLICK,
  GRID_CELL_ENTER,
  GRID_CELL_LEAVE,
  GRID_CELL_OUT,
  GRID_ROW_ENTER,
  GRID_ROW_LEAVE,
  GRID_ROW_OUT,
  GRID_COLUMN_HEADER_LEAVE,
  GRID_COLUMN_HEADER_ENTER,
  GRID_COLUMN_HEADER_DOUBLE_CLICK,
  GRID_COLUMN_HEADER_OVER,
  GRID_COLUMN_HEADER_OUT,
} from '../../constants/eventsConstants';
import { useGridApiMethod } from './useGridApiMethod';
import { useGridApiEventHandler } from './useGridApiEventHandler';
import { GridEventsApi } from '../../models/api/gridEventsApi';

export function useEvents(gridRootRef: React.RefObject<HTMLDivElement>, apiRef: GridApiRef): void {
  //  We use the isResizingRef to prevent the click on column header when the user is resizing the column
  const isResizingRef = React.useRef(false);
  const logger = useLogger('useEvents');
  const options = useGridSelector(apiRef, optionsSelector);

  const getHandler = React.useCallback(
    (name: string) => (...args: any[]) => apiRef.current.publishEvent(name, ...args),
    [apiRef],
  );

  const onFocusOutHandler = React.useCallback(
    (event: FocusEvent) => {
      apiRef.current.publishEvent(GRID_FOCUS_OUT, event);
      if (event.relatedTarget === null) {
        apiRef.current.publishEvent(GRID_ELEMENT_FOCUS_OUT, event);
      }
    },
    [apiRef],
  );

  const onUnmount = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_UNMOUNT, handler);
    },
    [apiRef],
  );
  const onResize = React.useCallback(
    (handler: (param: any) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_RESIZE, handler);
    },
    [apiRef],
  );

  const handleResizeStart = React.useCallback(() => {
    isResizingRef.current = true;
  }, []);

  const handleResizeStop = React.useCallback(() => {
    isResizingRef.current = false;
  }, []);

  const resize = React.useCallback(() => apiRef.current.publishEvent(GRID_RESIZE), [apiRef]);
  const eventsApi: GridEventsApi = { resize, onUnmount, onResize };
  useGridApiMethod(apiRef, eventsApi, 'GridEventsApi');

  useGridApiEventHandler(apiRef, GRID_COL_RESIZE_START, handleResizeStart);
  useGridApiEventHandler(apiRef, GRID_COL_RESIZE_STOP, handleResizeStop);

  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_CLICK, options.onColumnHeaderClick);
  useGridApiEventHandler(
    apiRef,
    GRID_COLUMN_HEADER_DOUBLE_CLICK,
    options.onColumnHeaderDoubleClick,
  );
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_OVER, options.onColumnHeaderOver);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_OUT, options.onColumnHeaderOut);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_ENTER, options.onColumnHeaderEnter);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_LEAVE, options.onColumnHeaderLeave);

  useGridApiEventHandler(apiRef, GRID_CELL_CLICK, options.onCellClick);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, options.onCellDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_OVER, options.onCellOver);
  useGridApiEventHandler(apiRef, GRID_CELL_OUT, options.onCellOut);
  useGridApiEventHandler(apiRef, GRID_CELL_ENTER, options.onCellEnter);
  useGridApiEventHandler(apiRef, GRID_CELL_LEAVE, options.onCellLeave);

  useGridApiEventHandler(apiRef, GRID_ROW_DOUBLE_CLICK, options.onRowDoubleClick);
  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, options.onRowClick);
  useGridApiEventHandler(apiRef, GRID_ROW_OVER, options.onRowOver);
  useGridApiEventHandler(apiRef, GRID_ROW_OUT, options.onRowOut);
  useGridApiEventHandler(apiRef, GRID_ROW_ENTER, options.onRowEnter);
  useGridApiEventHandler(apiRef, GRID_ROW_LEAVE, options.onRowLeave);

  useGridApiEventHandler(apiRef, GRID_COMPONENT_ERROR, options.onError);
  useGridApiEventHandler(apiRef, GRID_STATE_CHANGE, options.onStateChange);

  React.useEffect(() => {
    if (gridRootRef && gridRootRef.current && apiRef.current?.isInitialised) {
      logger.debug('Binding events listeners');
      const keyDownHandler = getHandler(GRID_KEYDOWN);
      const keyUpHandler = getHandler(GRID_KEYUP);
      const gridRootElem = gridRootRef.current;

      gridRootElem.addEventListener(GRID_FOCUS_OUT, onFocusOutHandler);
      gridRootElem.addEventListener(GRID_KEYDOWN, keyDownHandler);
      gridRootElem.addEventListener(GRID_KEYUP, keyUpHandler);
      apiRef.current.isInitialised = true;
      const api = apiRef.current;

      return () => {
        logger.debug('Clearing all events listeners');
        api.publishEvent(GRID_UNMOUNT);
        gridRootElem.removeEventListener(GRID_FOCUS_OUT, onFocusOutHandler);
        gridRootElem.removeEventListener(GRID_KEYDOWN, keyDownHandler);
        gridRootElem.removeEventListener(GRID_KEYUP, keyUpHandler);
        api.removeAllListeners();
      };
    }
    return undefined;
  }, [gridRootRef, apiRef.current?.isInitialised, getHandler, logger, onFocusOutHandler, apiRef]);
}
