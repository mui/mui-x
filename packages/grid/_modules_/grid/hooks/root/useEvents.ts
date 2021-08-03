import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridEvents } from '../../constants/eventsConstants';
import { useGridApiOptionHandler } from './useGridApiEventHandler';
import { useNativeEventListener } from './useNativeEventListener';
import { GridComponentProps } from '../../GridComponentProps';

export function useEvents(
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
  useGridApiOptionHandler(apiRef, GridEvents.columnHeaderClick, props.onColumnHeaderClick);
  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnHeaderDoubleClick,
    props.onColumnHeaderDoubleClick,
  );
  useGridApiOptionHandler(apiRef, GridEvents.columnHeaderOver, props.onColumnHeaderOver);
  useGridApiOptionHandler(apiRef, GridEvents.columnHeaderOut, props.onColumnHeaderOut);
  useGridApiOptionHandler(apiRef, GridEvents.columnHeaderEnter, props.onColumnHeaderEnter);
  useGridApiOptionHandler(apiRef, GridEvents.columnHeaderLeave, props.onColumnHeaderLeave);
  useGridApiOptionHandler(apiRef, GridEvents.columnOrderChange, props.onColumnOrderChange);

  useGridApiOptionHandler(apiRef, GridEvents.cellClick, props.onCellClick);
  useGridApiOptionHandler(apiRef, GridEvents.cellDoubleClick, props.onCellDoubleClick);
  useGridApiOptionHandler(apiRef, GridEvents.cellOver, props.onCellOver);
  useGridApiOptionHandler(apiRef, GridEvents.cellOut, props.onCellOut);
  useGridApiOptionHandler(apiRef, GridEvents.cellEnter, props.onCellEnter);
  useGridApiOptionHandler(apiRef, GridEvents.cellLeave, props.onCellLeave);
  useGridApiOptionHandler(apiRef, GridEvents.cellKeyDown, props.onCellKeyDown);
  useGridApiOptionHandler(apiRef, GridEvents.cellBlur, props.onCellBlur);
  useGridApiOptionHandler(apiRef, GridEvents.cellFocusOut, props.onCellFocusOut);

  useGridApiOptionHandler(apiRef, GridEvents.rowDoubleClick, props.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, GridEvents.rowClick, props.onRowClick);
  useGridApiOptionHandler(apiRef, GridEvents.rowOver, props.onRowOver);
  useGridApiOptionHandler(apiRef, GridEvents.rowOut, props.onRowOut);
  useGridApiOptionHandler(apiRef, GridEvents.rowEnter, props.onRowEnter);
  useGridApiOptionHandler(apiRef, GridEvents.rowLeave, props.onRowLeave);

  useGridApiOptionHandler(apiRef, GridEvents.componentError, props.onError);
  useGridApiOptionHandler(apiRef, GridEvents.stateChange, props.onStateChange);

  const getHandler = React.useCallback(
    (name: string) =>
      (...args: any[]) =>
        apiRef.current.publishEvent(name, ...args),
    [apiRef],
  );

  useNativeEventListener(
    apiRef,
    apiRef.current.rootElementRef!,
    GridEvents.keydown,
    getHandler(GridEvents.keydown),
  );
}
