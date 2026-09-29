'use client';
import { Draggable } from '@base-ui/react/draggable';
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
    accept: store.dependencyDragKind,
    onMove: (_, { location }) => {
      if (!enabled) {
        return;
      }
      onCursorMove(location.current.input.clientX, location.current.input.clientY);
    },
  });
}
