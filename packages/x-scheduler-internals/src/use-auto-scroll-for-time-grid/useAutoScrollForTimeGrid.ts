'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerEventDragKinds } from '../internals/utils/schedulerDrag';
import { buildIsValidDropTarget } from '../build-is-valid-drop-target/buildIsValidDropTarget';

// Only event drags should autoscroll the grid; other element drags (e.g. the dialog) carry no `source`.
// Exported for testing the accepted drag sources.
export const canAutoScrollForDrag = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'StandaloneEvent',
]);

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  const manager = Draggable.useDragDropManager();
  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    return manager.registerAutoScroller(element, () => ({
      accept: schedulerEventDragKinds,
      overflowMargin: { top: 160, bottom: 160 },
      onDragScroll: ({ source, direction }, details) => {
        if (direction === 'horizontal' || !canAutoScrollForDrag(source.payload)) {
          details.cancel();
        }
      },
    }));
  }, [manager, ref]);
}
