import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridEvents } from '../../../models/events';
import { useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';

/**
 * @requires useGridFocus (event) - can be after, async only
 * @requires useGridColumns (event) - can be after, async only
 */
export function useGridEvents(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'onColumnHeaderClick'
    | 'onColumnHeaderDoubleClick'
    | 'onColumnHeaderOver'
    | 'onColumnHeaderOut'
    | 'onColumnHeaderEnter'
    | 'onColumnHeaderLeave'
    | 'onColumnOrderChange'
    | 'onCellClick'
    | 'onCellDoubleClick'
    | 'onCellKeyDown'
    | 'onCellFocusOut'
    | 'onRowDoubleClick'
    | 'onRowClick'
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
  useGridApiOptionHandler(apiRef, GridEvents.cellKeyDown, props.onCellKeyDown);
  useGridApiOptionHandler(apiRef, GridEvents.cellFocusOut, props.onCellFocusOut);

  useGridApiOptionHandler(apiRef, GridEvents.rowDoubleClick, props.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, GridEvents.rowClick, props.onRowClick);

  useGridApiOptionHandler(apiRef, GridEvents.componentError, props.onError);
  useGridApiOptionHandler(apiRef, GridEvents.stateChange, props.onStateChange);
}
