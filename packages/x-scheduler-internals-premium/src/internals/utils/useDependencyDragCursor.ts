'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { isDependencyTerminalDrag } from '../../timeline-grid/event-dependency-terminal/TimelineGridEventDependencyTerminal';

/**
 * Calls `onCursorMove` with the client coordinates on every frame of this timeline's
 * create-dependency drag, without touching the state: the caller drives the DOM
 * directly, so the cursor never causes a render. Registered through a layout effect
 * so a caller closing over layout-derived values re-registers before paint.
 */
export function useDependencyDragCursor(
  enabled: boolean,
  onCursorMove: (clientX: number, clientY: number) => void,
) {
  const store = useEventTimelinePremiumStoreContext();

  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }
    return monitorForElements({
      canMonitor: ({ source }) =>
        isDependencyTerminalDrag(source.data) && source.data.storeContext === store,
      onDrag: ({ location }) => {
        onCursorMove(location.current.input.clientX, location.current.input.clientY);
      },
    });
  }, [enabled, onCursorMove, store]);
}
