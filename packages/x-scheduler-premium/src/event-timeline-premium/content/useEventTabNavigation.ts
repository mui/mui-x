'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type {
  SchedulerEventOccurrence,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  computeElementPositionInCollection,
  getTimelineAxisDurationMs,
} from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';

type ResourceWithOccurrences = {
  resource: SchedulerResource;
  occurrences: SchedulerEventOccurrence[];
};

/**
 * Tab/Shift+Tab interceptor that makes virtualized-out events reachable.
 *
 * For each Tab on an event: resolves the focused occurrence (via `data-occurrence-key`
 * + the row's `data-resource-id`), finds its neighbor in the full occurrence list,
 * scrolls the virtualizer so it's in view, and focuses it with `preventScroll: true`
 * — directly if mounted, or via a layout-effect retry once the scroll-driven re-render
 * mounts it. Returns `false` at row boundaries so default Tab moves to the next row.
 */
export function useEventTabNavigation(params: {
  adapter: Adapter;
  /**
   * The visible resources with the occurrences that occupy space on the axis, in row
   * render order. Occurrences hidden by the hour window must already be excluded:
   * they never mount, so navigating to one would swallow Tab forever.
   */
  resources: readonly ResourceWithOccurrences[];
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  axis: TimelineAxis;
  tickCount: number;
  tickWidth: number;
  titleColumnWidth: number;
}) {
  const { adapter, resources, scrollerRef, axis, tickCount, tickWidth, titleColumnWidth } = params;

  const pendingFocusRef = React.useRef<{ key: string; resourceId: string } | null>(null);

  // Map an axis offset into [0, 1] of the events area, matching the rendered
  // geometry (a trimmed hour window compresses the days).
  const totalMs = React.useMemo(() => getTimelineAxisDurationMs(adapter, axis), [adapter, axis]);

  const eventsTotalWidth = tickCount * tickWidth;

  const computeFractionRange = useStableCallback((occurrence: SchedulerEventOccurrence) => {
    const { position, duration } = computeElementPositionInCollection(adapter, {
      start: occurrence.displayTimezone.start,
      end: occurrence.displayTimezone.end,
      collection: axis,
      durationMs: totalMs,
    });
    return { fractionStart: position, fractionEnd: position + duration };
  });

  // Scoped by `data-resource-id`: occurrence keys are event-scoped, not unique
  // across rows, so an unscoped lookup could match a same-key copy rendered in
  // a different row instead of the one being navigated to.
  const focusEventInDom = (key: string, resourceId: string): boolean => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return false;
    }
    const el = scroller.querySelector<HTMLElement>(
      `[data-resource-id="${CSS.escape(resourceId)}"] [data-occurrence-key="${CSS.escape(key)}"]`,
    );
    if (el) {
      el.focus({ preventScroll: true });
      return true;
    }
    return false;
  };

  const scrollEventIntoView = useStableCallback((occurrence: SchedulerEventOccurrence) => {
    if (!scrollerRef.current) {
      return;
    }
    const { fractionStart, fractionEnd } = computeFractionRange(occurrence);
    const eventLeft = fractionStart * eventsTotalWidth;
    const eventRight = fractionEnd * eventsTotalWidth;
    const eventsViewportWidth = scrollerRef.current.clientWidth - titleColumnWidth;
    // scrollLeft is measured from the start of scrollerContent; the events area
    // begins after the pinned title column, so the visible events window is
    // [scrollLeft, scrollLeft + clientWidth - titleColumnWidth) in event coords.
    const viewportLeft = scrollerRef.current.scrollLeft;
    const viewportRight = viewportLeft + eventsViewportWidth;
    // Small breathing room so the target doesn't land flush against the edge,
    // which can re-trigger browser scroll-into-view on focus.
    const PADDING = 32;
    if (eventLeft < viewportLeft) {
      // eslint-disable-next-line react-compiler/react-compiler -- intentional DOM scroll mutation
      scrollerRef.current.scrollLeft = Math.max(0, eventLeft - PADDING);
    } else if (eventRight > viewportRight) {
      scrollerRef.current.scrollLeft = Math.max(0, eventRight - eventsViewportWidth + PADDING);
    }
  });

  const navigate = (direction: 1 | -1): boolean => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) {
      return false;
    }
    const scroller = scrollerRef.current;
    if (!scroller || !scroller.contains(active)) {
      return false;
    }
    const currentKey = active.getAttribute('data-occurrence-key');
    if (!currentKey) {
      // Focus isn't on an event; let the default Tab behavior handle row/cell moves.
      return false;
    }
    const resourceId = active
      .closest<HTMLElement>('[data-resource-id]')
      ?.getAttribute('data-resource-id');
    if (!resourceId) {
      return false;
    }
    const resource = resources.find((r) => String(r.resource.id) === resourceId);
    if (!resource) {
      return false;
    }
    const currentIndex = resource.occurrences.findIndex((o) => o.key === currentKey);
    if (currentIndex === -1) {
      return false;
    }
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= resource.occurrences.length) {
      // Row boundary: hand off to default Tab so focus moves to the adjacent row.
      return false;
    }
    const next = resource.occurrences[nextIndex];

    // Scroll first so the target is in/near the viewport. If it's already mounted,
    // we focus directly; otherwise we queue the focus and the layout effect picks
    // it up once the virtualizer re-renders with the new column range.
    // `next` comes from this same row's occurrence list, so it always belongs to
    // `resourceId`.
    scrollEventIntoView(next);
    if (focusEventInDom(next.key, resourceId)) {
      pendingFocusRef.current = null;
    } else {
      pendingFocusRef.current = { key: next.key, resourceId };
    }
    return true;
  };

  // Runs after every commit. If a pending focus is queued, attempt it; this is
  // how virtualized-out events get focused once the scroll-driven re-render mounts
  // them. Stays a no-op when no focus is queued.
  React.useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (pending && focusEventInDom(pending.key, pending.resourceId)) {
      pendingFocusRef.current = null;
    }
  });

  const handleKeyDown = useStableCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (navigate(event.shiftKey ? -1 : 1)) {
      event.preventDefault();
    }
  });

  return { handleKeyDown };
}
