'use client';
import * as React from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';

/**
 * Calls `onCursorMove` with the client coordinates on every frame of this timeline's
 * create-dependency drag, without touching the state: the caller drives the DOM
 * directly, so the cursor never causes a render. Registered through `useLayoutEffect`
 * so a caller closing over layout-derived values re-registers before paint.
 */
export function useDependencyDragCursor(
  enabled: boolean,
  onCursorMove: (clientX: number, clientY: number) => void,
) {
  const store = useEventTimelinePremiumStoreContext();

  React.useLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }
    return monitorForElements({
      // No typed guard: the callback only reads the pointer position, never the
      // payload, so the raw discriminator comparison is enough.
      canMonitor: ({ source }) =>
        source.data.source === 'TimelineGridEventDependencyHandle' &&
        source.data.storeContext === store,
      onDrag: ({ location }) => {
        onCursorMove(location.current.input.clientX, location.current.input.clientY);
      },
    });
  }, [enabled, onCursorMove, store]);
}
