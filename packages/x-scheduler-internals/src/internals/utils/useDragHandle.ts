'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { registerSchedulerDraggable } from './schedulerDrag';

/**
 * Registers a drag-handle element: a draggable that only carries drag data, with the
 * preview disabled. For handles whose gesture is handled elsewhere (a monitor,
 * a drop target) — draggables with their own lifecycle keep registering directly.
 */
export function useDragHandle(parameters: {
  ref: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  preventTouchScroll?: boolean;
  getDragData: (input: { clientX: number; clientY: number }) => Record<string, unknown>;
}) {
  const { ref, enabled, getDragData, preventTouchScroll = false } = parameters;

  const manager = Draggable.useDragDropManager();

  React.useEffect(() => {
    if (!ref.current || !enabled) {
      return undefined;
    }

    const element = ref.current;
    const cleanup = registerSchedulerDraggable(manager, element, { getDragData });
    if (!preventTouchScroll) {
      return cleanup;
    }

    // Resize handles must not pan the page, including the direct touch-resize
    // gesture that takes over before Base UI's long-press activation.
    const previousTouchAction = element.style.touchAction;
    element.style.setProperty('touch-action', 'none');
    return () => {
      element.style.setProperty('touch-action', previousTouchAction);
      cleanup();
    };
  }, [manager, ref, enabled, getDragData, preventTouchScroll]);
}
