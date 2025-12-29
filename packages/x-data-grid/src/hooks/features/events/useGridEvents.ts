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
  const {
    onColumnHeaderClick,
    onColumnHeaderDoubleClick,
    onColumnHeaderContextMenu,
    onColumnHeaderOver,
    onColumnHeaderOut,
    onColumnHeaderEnter,
    onColumnHeaderLeave,
    onCellClick,
    onCellDoubleClick,
    onCellKeyDown,
    onPreferencePanelClose,
    onPreferencePanelOpen,
    onRowDoubleClick,
    onRowClick,
    onStateChange,
    onMenuOpen,
    onMenuClose,
  } = props;

  useGridEventPriority(apiRef, 'columnHeaderClick', onColumnHeaderClick);
  useGridEventPriority(apiRef, 'columnHeaderContextMenu', onColumnHeaderContextMenu);
  useGridEventPriority(apiRef, 'columnHeaderDoubleClick', onColumnHeaderDoubleClick);
  useGridEventPriority(apiRef, 'columnHeaderOver', onColumnHeaderOver);
  useGridEventPriority(apiRef, 'columnHeaderOut', onColumnHeaderOut);
  useGridEventPriority(apiRef, 'columnHeaderEnter', onColumnHeaderEnter);
  useGridEventPriority(apiRef, 'columnHeaderLeave', onColumnHeaderLeave);

  useGridEventPriority(apiRef, 'cellClick', onCellClick);
  useGridEventPriority(apiRef, 'cellDoubleClick', onCellDoubleClick);
  useGridEventPriority(apiRef, 'cellKeyDown', onCellKeyDown);

  useGridEventPriority(apiRef, 'preferencePanelClose', onPreferencePanelClose);
  useGridEventPriority(apiRef, 'preferencePanelOpen', onPreferencePanelOpen);

  useGridEventPriority(apiRef, 'menuOpen', onMenuOpen);
  useGridEventPriority(apiRef, 'menuClose', onMenuClose);

  useGridEventPriority(apiRef, 'rowDoubleClick', onRowDoubleClick);
  useGridEventPriority(apiRef, 'rowClick', onRowClick);

  useGridEventPriority(apiRef, 'stateChange', onStateChange);
}
