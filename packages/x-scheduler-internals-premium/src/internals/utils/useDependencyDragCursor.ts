'use client';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDragKind } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { isDependencyTerminalDrag } from '../../timeline-grid/event-dependency-terminal/dependencyTerminalDragData';

/**
 * Calls `onCursorMove` with the client coordinates on every frame of this timeline's
 * create-dependency drag, without touching the state: the caller drives the DOM
 * directly, so the cursor never causes a render. The monitor reads the latest callback before paint.
 */
export function useDependencyDragCursor(
  enabled: boolean,
  onCursorMove: (clientX: number, clientY: number) => void,
) {
  const store = useEventTimelinePremiumStoreContext();

  Draggable.useDragMonitor({
    accept: schedulerDragKind,
    onMove: ({ location, source }) => {
      if (
        !enabled ||
        !isDependencyTerminalDrag(source.payload) ||
        source.payload.storeContext !== store
      ) {
        return;
      }
      onCursorMove(location.current.input.clientX, location.current.input.clientY);
    },
  });
}
