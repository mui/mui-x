'use client';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDependencyKind } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';

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

  Draggable.useMonitor({
    accept: schedulerDependencyKind,
    onMove: ({ source }, { location }) => {
      if (!enabled || source.payload.storeContext !== store) {
        return;
      }
      onCursorMove(location.current.input.clientX, location.current.input.clientY);
    },
  });
}
