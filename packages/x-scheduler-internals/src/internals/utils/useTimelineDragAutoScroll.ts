'use client';
import * as React from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

/**
 * Registers pragmatic-drag-and-drop autoscroll on the timeline scroller, with the
 * left-edge hitbox shifted to start at the right of the pinned title column.
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

  const pinnedLeftWidthRef = React.useRef(pinnedLeftWidth);
  pinnedLeftWidthRef.current = pinnedLeftWidth;

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    // The library warns when attached to a non-scrollable element, which is what
    // jsdom reports because it doesn't lay out. Matches CalendarGridTimeScrollableContent.
    if (!scroller || process.env.NODE_ENV === 'test') {
      return undefined;
    }

    const nativeGetBoundingClientRect =
      Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect')?.value ??
      Element.prototype.getBoundingClientRect;
    scroller.getBoundingClientRect = function shiftedGetBoundingClientRect() {
      const rect = nativeGetBoundingClientRect.call(this);
      const shift = pinnedLeftWidthRef.current;
      return DOMRect.fromRect({
        x: rect.x + shift,
        y: rect.y,
        width: Math.max(0, rect.width - shift),
        height: rect.height,
      });
    };

    const cleanupAutoScroll = autoScrollForElements({ element: scroller });

    return () => {
      cleanupAutoScroll();
      delete (scroller as Partial<HTMLElement>).getBoundingClientRect;
    };
  }, [scrollerRef]);
}
