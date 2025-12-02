import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridEventPriority } from '../../utils/useGridEvent';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';

/**
 * @requires useGridFocus (event) - can be after, async only
 * @requires useGridColumns (event) - can be after, async only
 */
export function useGridEvents(
  apiRef: RefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'onColumnHeaderClick'
    | 'onColumnHeaderDoubleClick'
    | 'onColumnHeaderContextMenu'
    | 'onColumnHeaderOver'
    | 'onColumnHeaderOut'
    | 'onColumnHeaderEnter'
    | 'onColumnHeaderLeave'
    | 'onCellClick'
    | 'onCellDoubleClick'
    | 'onCellKeyDown'
    | 'onPreferencePanelClose'
    | 'onPreferencePanelOpen'
    | 'onRowDoubleClick'
    | 'onRowClick'
    | 'onStateChange'
    | 'onMenuOpen'
    | 'onMenuClose'
  >,
): void {
  useGridEventPriority(apiRef, 'columnHeaderClick', props.onColumnHeaderClick);
  useGridEventPriority(apiRef, 'columnHeaderContextMenu', props.onColumnHeaderContextMenu);
  useGridEventPriority(apiRef, 'columnHeaderDoubleClick', props.onColumnHeaderDoubleClick);
  useGridEventPriority(apiRef, 'columnHeaderOver', props.onColumnHeaderOver);
  useGridEventPriority(apiRef, 'columnHeaderOut', props.onColumnHeaderOut);
  useGridEventPriority(apiRef, 'columnHeaderEnter', props.onColumnHeaderEnter);
  useGridEventPriority(apiRef, 'columnHeaderLeave', props.onColumnHeaderLeave);

  useGridEventPriority(apiRef, 'cellClick', props.onCellClick);
  useGridEventPriority(apiRef, 'cellDoubleClick', props.onCellDoubleClick);
  useGridEventPriority(apiRef, 'cellKeyDown', props.onCellKeyDown);

  useGridEventPriority(apiRef, 'preferencePanelClose', props.onPreferencePanelClose);
  useGridEventPriority(apiRef, 'preferencePanelOpen', props.onPreferencePanelOpen);

  useGridEventPriority(apiRef, 'menuOpen', props.onMenuOpen);
  useGridEventPriority(apiRef, 'menuClose', props.onMenuClose);

  useGridEventPriority(apiRef, 'rowDoubleClick', props.onRowDoubleClick);
  useGridEventPriority(apiRef, 'rowClick', props.onRowClick);

  useGridEventPriority(apiRef, 'stateChange', props.onStateChange);
}
