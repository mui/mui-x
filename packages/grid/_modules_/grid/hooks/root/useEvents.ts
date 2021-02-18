import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridCellParams } from '../../models/params/gridCellParams';
import { GridColParams } from '../../models/params/gridColParams';
import { GridRowParams } from '../../models/params/gridRowParams';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from '../utils/optionsSelector';
import { useLogger } from '../utils/useLogger';
import {
  GRID_CELL_CLICK,
  GRID_CLICK,
  GRID_COL_RESIZE_START,
  GRID_COL_RESIZE_STOP,
  GRID_COLUMN_HEADER_CLICK,
  GRID_UNMOUNT,
  GRID_KEYDOWN,
  GRID_KEYUP,
  GRID_RESIZE,
  GRID_ROW_CLICK,
  GRID_MOUSE_HOVER,
  GRID_CELL_HOVER,
  GRID_ROW_HOVER,
  GRID_COLUMN_HEADER_HOVER,
  GRID_FOCUS_OUT,
  GRID_ELEMENT_FOCUS_OUT,
  GRID_COMPONENT_ERROR,
  GRID_STATE_CHANGE,
} from '../../constants/eventsConstants';
import { GRID_CELL_CSS_CLASS, GRID_ROW_CSS_CLASS } from '../../constants/cssClassesConstants';
import { findParentElementFromClassName, getIdFromRowElem, isGridCell } from '../../utils/domUtils';
import { useGridApiMethod } from './useGridApiMethod';
import { useGridApiEventHandler } from './useGridApiEventHandler';
import { buildGridCellParams, buildGridRowParams } from '../../utils/paramsUtils';
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

  const getEventParams = React.useCallback(
    (event: MouseEvent) => {
      if (event.target == null) {
        throw new Error(
          `Event target null - Target has been removed or component might already be unmounted.`,
        );
      }

      const elem = event.target as HTMLElement;
      const eventParams: {
        cell?: GridCellParams;
        row?: GridRowParams;
        header?: GridColParams;
      } = {};

      if (isGridCell(elem)) {
        const cellEl = findParentElementFromClassName(elem, GRID_CELL_CSS_CLASS)! as HTMLElement;
        const rowEl = findParentElementFromClassName(elem, GRID_ROW_CSS_CLASS)! as HTMLElement;
        if (rowEl == null) {
          return null;
        }
        const id = getIdFromRowElem(rowEl);
        const rowModel = apiRef.current.getRowFromId(id);
        const rowIndex = apiRef.current.getRowIndexFromId(id);
        const field = cellEl.getAttribute('data-field') as string;
        const value = cellEl.getAttribute('data-value');
        const column = apiRef.current.getColumnFromField(field);
        if (!column || !column.disableClickEventBubbling) {
          const commonParams = {
            data: rowModel,
            rowIndex,
            colDef: column,
            rowModel,
            api: apiRef.current,
          };
          eventParams.cell = buildGridCellParams({
            ...commonParams,
            element: cellEl,
            value,
          });
          eventParams.row = buildGridRowParams({
            ...commonParams,
            element: rowEl,
          });
        }
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
        apiRef.current.publishEvent(GRID_CELL_CLICK, eventParams.cell);
      }
      if (eventParams.row) {
        apiRef.current.publishEvent(GRID_ROW_CLICK, eventParams.row);
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
        apiRef.current.publishEvent(GRID_CELL_HOVER, eventParams.cell);
      }
      if (eventParams.row) {
        apiRef.current.publishEvent(GRID_ROW_HOVER, eventParams.row);
      }
      if (eventParams.header) {
        apiRef.current.publishEvent(GRID_COLUMN_HEADER_HOVER, eventParams.header);
      }
    },
    [apiRef, getEventParams],
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
  useGridApiEventHandler(apiRef, GRID_CELL_CLICK, options.onCellClick);
  useGridApiEventHandler(apiRef, GRID_ROW_CLICK, options.onRowClick);
  useGridApiEventHandler(apiRef, GRID_CELL_HOVER, options.onCellHover);
  useGridApiEventHandler(apiRef, GRID_ROW_HOVER, options.onRowHover);
  useGridApiEventHandler(apiRef, GRID_COMPONENT_ERROR, options.onError);
  useGridApiEventHandler(apiRef, GRID_STATE_CHANGE, options.onStateChange);

  React.useEffect(() => {
    if (gridRootRef && gridRootRef.current && apiRef.current?.isInitialised) {
      logger.debug('Binding events listeners');
      const keyDownHandler = getHandler(GRID_KEYDOWN);
      const keyUpHandler = getHandler(GRID_KEYUP);
      const gridRootElem = gridRootRef.current;

      gridRootElem.addEventListener(GRID_CLICK, onClickHandler, { capture: true });
      gridRootElem.addEventListener(GRID_MOUSE_HOVER, onHoverHandler, { capture: true });
      gridRootElem.addEventListener(GRID_FOCUS_OUT, onFocusOutHandler);

      gridRootElem.addEventListener(GRID_KEYDOWN, keyDownHandler);
      gridRootElem.addEventListener(GRID_KEYUP, keyUpHandler);
      apiRef.current.isInitialised = true;
      const api = apiRef.current;

      return () => {
        logger.debug('Clearing all events listeners');
        api.publishEvent(GRID_UNMOUNT);
        gridRootElem.removeEventListener(GRID_CLICK, onClickHandler, { capture: true });
        gridRootElem.removeEventListener(GRID_MOUSE_HOVER, onHoverHandler, { capture: true });
        gridRootElem.removeEventListener(GRID_FOCUS_OUT, onFocusOutHandler);
        gridRootElem.removeEventListener(GRID_KEYDOWN, keyDownHandler);
        gridRootElem.removeEventListener(GRID_KEYUP, keyUpHandler);
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
