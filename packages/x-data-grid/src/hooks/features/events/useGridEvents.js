import { useGridEventPriority } from '../../utils/useGridEvent';
/**
 * @requires useGridFocus (event) - can be after, async only
 * @requires useGridColumns (event) - can be after, async only
 */
export function useGridEvents(apiRef, props) {
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
