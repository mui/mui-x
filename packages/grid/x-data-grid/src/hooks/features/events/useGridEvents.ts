import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
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
    | 'onPreferencePanelClose'
    | 'onPreferencePanelOpen'
    | 'onRowDoubleClick'
    | 'onRowClick'
    | 'onError'
    | 'onStateChange'
  >,
): void {
  useGridApiOptionHandler(apiRef, 'columnHeaderClick', props.onColumnHeaderClick);
  useGridApiOptionHandler(apiRef, 'columnHeaderDoubleClick', props.onColumnHeaderDoubleClick);
  useGridApiOptionHandler(apiRef, 'columnHeaderOver', props.onColumnHeaderOver);
  useGridApiOptionHandler(apiRef, 'columnHeaderOut', props.onColumnHeaderOut);
  useGridApiOptionHandler(apiRef, 'columnHeaderEnter', props.onColumnHeaderEnter);
  useGridApiOptionHandler(apiRef, 'columnHeaderLeave', props.onColumnHeaderLeave);
  useGridApiOptionHandler(apiRef, 'columnOrderChange', props.onColumnOrderChange);

  useGridApiOptionHandler(apiRef, 'cellClick', props.onCellClick);
  useGridApiOptionHandler(apiRef, 'cellDoubleClick', props.onCellDoubleClick);
  useGridApiOptionHandler(apiRef, 'cellKeyDown', props.onCellKeyDown);
  useGridApiOptionHandler(apiRef, 'cellFocusOut', props.onCellFocusOut);

  useGridApiOptionHandler(apiRef, 'preferencePanelClose', props.onPreferencePanelClose);
  useGridApiOptionHandler(apiRef, 'preferencePanelOpen', props.onPreferencePanelOpen);

  useGridApiOptionHandler(apiRef, 'rowDoubleClick', props.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, 'rowClick', props.onRowClick);

  useGridApiOptionHandler(apiRef, 'componentError', props.onError);
  useGridApiOptionHandler(apiRef, 'stateChange', props.onStateChange);
}
