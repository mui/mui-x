import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import {
  GRID_CELL_CLICK,
  GRID_COLUMN_HEADER_CLICK,
  GRID_ROW_CLICK,
  GRID_CELL_OVER,
  GRID_ROW_OVER,
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
  GRID_CELL_KEY_DOWN,
  GRID_CELL_FOCUS_OUT,
  GRID_CELL_BLUR,
  GRID_KEYDOWN,
} from '../../constants/eventsConstants';
import { useGridApiOptionHandler } from './useGridApiEventHandler';
import { useNativeEventListener } from './useNativeEventListener';
import { GridComponentProps } from '../../GridComponentProps';

/**
 * @requires useGridFocus (event)
 * @requires useGridColumns (event)
 */
export function useGridEvents(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'onColumnHeaderClick'
    | 'onColumnHeaderDoubleClick'
    | 'onColumnHeaderOver'
    | 'onColumnHeaderOut'
    | 'onColumnHeaderEnter'
    | 'onColumnHeaderLeave'
    | 'onColumnOrderChange'
    | 'onCellClick'
    | 'onCellDoubleClick'
    | 'onCellOver'
    | 'onCellOut'
    | 'onCellEnter'
    | 'onCellLeave'
    | 'onCellKeyDown'
    | 'onCellBlur'
    | 'onCellFocusOut'
    | 'onRowDoubleClick'
    | 'onRowClick'
    | 'onRowOver'
    | 'onRowOut'
    | 'onRowEnter'
    | 'onRowLeave'
    | 'onError'
    | 'onStateChange'
  >,
): void {
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_CLICK, props.onColumnHeaderClick);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_DOUBLE_CLICK, props.onColumnHeaderDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OVER, props.onColumnHeaderOver);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OUT, props.onColumnHeaderOut);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_ENTER, props.onColumnHeaderEnter);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_LEAVE, props.onColumnHeaderLeave);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_ORDER_CHANGE, props.onColumnOrderChange);

  useGridApiOptionHandler(apiRef, GRID_CELL_CLICK, props.onCellClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_DOUBLE_CLICK, props.onCellDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_OVER, props.onCellOver);
  useGridApiOptionHandler(apiRef, GRID_CELL_OUT, props.onCellOut);
  useGridApiOptionHandler(apiRef, GRID_CELL_ENTER, props.onCellEnter);
  useGridApiOptionHandler(apiRef, GRID_CELL_LEAVE, props.onCellLeave);
  useGridApiOptionHandler(apiRef, GRID_CELL_KEY_DOWN, props.onCellKeyDown);
  useGridApiOptionHandler(apiRef, GRID_CELL_BLUR, props.onCellBlur);
  useGridApiOptionHandler(apiRef, GRID_CELL_FOCUS_OUT, props.onCellFocusOut);

  useGridApiOptionHandler(apiRef, GRID_ROW_DOUBLE_CLICK, props.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_CLICK, props.onRowClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_OVER, props.onRowOver);
  useGridApiOptionHandler(apiRef, GRID_ROW_OUT, props.onRowOut);
  useGridApiOptionHandler(apiRef, GRID_ROW_ENTER, props.onRowEnter);
  useGridApiOptionHandler(apiRef, GRID_ROW_LEAVE, props.onRowLeave);

  useGridApiOptionHandler(apiRef, GRID_COMPONENT_ERROR, props.onError);
  useGridApiOptionHandler(apiRef, GRID_STATE_CHANGE, props.onStateChange);

  const getHandler = React.useCallback(
    (name: string) =>
      (...args: any[]) =>
        apiRef.current.publishEvent(name, ...args),
    [apiRef],
  );

  useNativeEventListener(
    apiRef,
    apiRef.current.rootElementRef!,
    GRID_KEYDOWN,
    getHandler(GRID_KEYDOWN),
  );
}
