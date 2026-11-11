'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerExternalEventKind } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
} from './schedulerTimelineDrag';

/**
 * Scrolls the timeline scroller while a timeline event, a resize handle, an external event or a
 * dependency link is dragged near its edges, with the inline-start hitbox shifted to start after
 * the pinned title column.
 * It registers the scroller with the drag engine, so it needs a `Draggable.Provider` above the
 * component that calls it.
 *
 * The scroller spans the entire content width — the title column is overlaid via
 * `position: absolute` — so the autoscroller's default inline-start hitbox sits over
 * the title column instead of the visual edge of the events area. We work around
 * this by overriding the scroller's `getBoundingClientRect` to report the events
 * subrect (`width -= pinnedLeftWidth`, and `left += pinnedLeftWidth` in LTR). The library
 * reads this each frame to derive its edge hitboxes; `scrollLeft`, `clientWidth`,
 * etc. are read separately and stay intact, so scroll math is unaffected.
 */
export function useTimelineDragAutoScroll(params: {
  scrollerRef: React.RefObject<HTMLElement | null>;
  pinnedLeftWidth: number;
  isRtl: boolean;
}): void {
  const { scrollerRef, pinnedLeftWidth, isRtl } = params;
  const store = useEventTimelinePremiumStoreContext();
  const manager = Draggable.useManager();

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    const nativeGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    scroller.getBoundingClientRect = function shiftedGetBoundingClientRect() {
      const rect = nativeGetBoundingClientRect.call(this);
      // In RTL, the title column is on the right, so the events area keeps the left edge.
      return DOMRect.fromRect({
        x: isRtl ? rect.x : rect.x + pinnedLeftWidth,
        y: rect.y,
        width: Math.max(0, rect.width - pinnedLeftWidth),
        height: rect.height,
      });
    };

    const viewportOptions = {
      accept: [
        schedulerTimelineEventMoveKind,
        schedulerTimelineEventResizeKind,
        schedulerExternalEventKind,
        store.dependencyDragKind,
      ],
    };
    const unregister = manager.registerViewport(scroller, () => viewportOptions);

    return () => {
      unregister();
      delete (scroller as Partial<HTMLElement>).getBoundingClientRect;
    };
  }, [manager, scrollerRef, pinnedLeftWidth, isRtl, store]);
}
