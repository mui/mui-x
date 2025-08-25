"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridEvents = useGridEvents;
var useGridEvent_1 = require("../../utils/useGridEvent");
/**
 * @requires useGridFocus (event) - can be after, async only
 * @requires useGridColumns (event) - can be after, async only
 */
function useGridEvents(apiRef, props) {
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderClick', props.onColumnHeaderClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderContextMenu', props.onColumnHeaderContextMenu);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderDoubleClick', props.onColumnHeaderDoubleClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderOver', props.onColumnHeaderOver);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderOut', props.onColumnHeaderOut);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderEnter', props.onColumnHeaderEnter);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'columnHeaderLeave', props.onColumnHeaderLeave);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'cellClick', props.onCellClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'cellDoubleClick', props.onCellDoubleClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'cellKeyDown', props.onCellKeyDown);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'preferencePanelClose', props.onPreferencePanelClose);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'preferencePanelOpen', props.onPreferencePanelOpen);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'menuOpen', props.onMenuOpen);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'menuClose', props.onMenuClose);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rowDoubleClick', props.onRowDoubleClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rowClick', props.onRowClick);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'stateChange', props.onStateChange);
}
