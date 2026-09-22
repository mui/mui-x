'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDragKind } from '../internals/utils/schedulerDrag';
import { buildIsValidDropTarget } from '../build-is-valid-drop-target/buildIsValidDropTarget';

// Only event drags should autoscroll the grid; other element drags (e.g. the dialog) carry no `source`.
// Exported for unit testing (the effect itself is a no-op under `NODE_ENV === 'test'`).
export const canAutoScrollForDrag = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'StandaloneEvent',
]);

export function useAutoScrollForTimeGrid(ref: React.RefObject<HTMLElement | null>): void {
  const manager = Draggable.useDragDropManager();
  React.useEffect(() => {
    const element = ref.current;
    if (!element || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    return manager.registerAutoScroller(element, () => ({
      accept: schedulerDragKind,
      onDragScroll: ({ source, direction }, details) => {
        if (direction === 'horizontal' || !canAutoScrollForDrag(source.payload)) {
          details.cancel();
        }
      },
    }));
  }, [manager, ref]);
}
