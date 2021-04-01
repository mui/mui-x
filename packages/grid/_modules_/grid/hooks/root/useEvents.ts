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
  GRID_COLUMN_ORDER_CHANGE,
  GRID_CELL_KEYDOWN,
  GRID_CELL_BLUR,
} from '../../constants/eventsConstants';
import { useGridApiMethod } from './useGridApiMethod';
import { useGridApiEventHandler, useGridApiOptionHandler } from './useGridApiEventHandler';
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

  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_CLICK, options.onColumnHeaderClick);
  useGridApiOptionHandler(
    apiRef,
    GRID_COLUMN_HEADER_DOUBLE_CLICK,
    options.onColumnHeaderDoubleClick,
  );
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OVER, options.onColumnHeaderOver);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OUT, options.onColumnHeaderOut);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_ENTER, options.onColumnHeaderEnter);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_LEAVE, options.onColumnHeaderLeave);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_ORDER_CHANGE, options.onColumnOrderChange);

  useGridApiOptionHandler(apiRef, GRID_CELL_CLICK, options.onCellClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_DOUBLE_CLICK, options.onCellDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_OVER, options.onCellOver);
  useGridApiOptionHandler(apiRef, GRID_CELL_OUT, options.onCellOut);
  useGridApiOptionHandler(apiRef, GRID_CELL_ENTER, options.onCellEnter);
  useGridApiOptionHandler(apiRef, GRID_CELL_LEAVE, options.onCellLeave);
  useGridApiOptionHandler(apiRef, GRID_CELL_KEYDOWN, options.onCellKeyDown);
  useGridApiOptionHandler(apiRef, GRID_CELL_BLUR, options.onCellBlur);

  useGridApiOptionHandler(apiRef, GRID_ROW_DOUBLE_CLICK, options.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_CLICK, options.onRowClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_OVER, options.onRowOver);
  useGridApiOptionHandler(apiRef, GRID_ROW_OUT, options.onRowOut);
  useGridApiOptionHandler(apiRef, GRID_ROW_ENTER, options.onRowEnter);
  useGridApiOptionHandler(apiRef, GRID_ROW_LEAVE, options.onRowLeave);

  useGridApiOptionHandler(apiRef, GRID_COMPONENT_ERROR, options.onError);
  useGridApiOptionHandler(apiRef, GRID_STATE_CHANGE, options.onStateChange);

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
