'use client';
import * as React from 'react';
import type { Draggable } from '@base-ui/react/draggable';
import { schedulerExternalEventKind } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
} from './schedulerTimelineDrag';

/**
 * Returns props for a Base UI viewport on the timeline scroller, with the
 * left-edge hitbox shifted to start at the right of the pinned title column.
 * Spread the returned props onto the scroller's `Draggable.Viewport`.
 *
 * The scroller spans the entire content width — the title column is overlaid via
 * `position: absolute` — so the autoscroller's default left-edge hitbox sits over
 * the title column instead of the visual edge of the events area. We work around
 * this by overriding the scroller's `getBoundingClientRect` to report the events
 * subrect (`left += pinnedLeftWidth`, `width -= pinnedLeftWidth`). The library
 * reads this each frame to derive its edge hitboxes; `scrollLeft`, `clientWidth`,
 * etc. are read separately and stay intact, so scroll math is unaffected.
 */
export function useTimelineDragAutoScroll(params: {
  scrollerRef: React.RefObject<HTMLElement | null>;
  pinnedLeftWidth: number;
}) {
  const { scrollerRef, pinnedLeftWidth } = params;
  const store = useEventTimelinePremiumStoreContext();

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    const nativeGetBoundingClientRect =
      Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect')?.value ??
      Element.prototype.getBoundingClientRect;
    scroller.getBoundingClientRect = function shiftedGetBoundingClientRect() {
      const rect = nativeGetBoundingClientRect.call(this);
      return DOMRect.fromRect({
        x: rect.x + pinnedLeftWidth,
        y: rect.y,
        width: Math.max(0, rect.width - pinnedLeftWidth),
        height: rect.height,
      });
    };

    return () => {
      delete (scroller as Partial<HTMLElement>).getBoundingClientRect;
    };
  }, [scrollerRef, pinnedLeftWidth]);

  const viewportProps: Draggable.Viewport.Props = {
    accept: [
      schedulerTimelineEventMoveKind,
      schedulerTimelineEventResizeKind,
      schedulerExternalEventKind,
      store.dependencyDragKind,
    ],
  };
  return viewportProps;
}
