'use client';
import * as React from 'react';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { useAdapterContext } from '../../use-adapter-context';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import { applyInternalDragOrResizeOccurrencePlaceholder } from '../../internals/utils/useDropTarget';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';
import { SchedulerEventSide, SchedulerOccurrencePlaceholder } from '../../models';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useCalendarGridTimeEventContext } from '../time-event/CalendarGridTimeEventContext';

// Time grid events are always non all-day events; resizing them must keep that property.
function addPropertiesToResizedEvent() {
  return { allDay: false };
}

/**
 * Pointer-based resize for time grid events.
 *
 * Unlike {@link useEventResizeHandler}, which relies on the native HTML drag-and-drop API
 * (and therefore requires the browser's own long-press to start a drag on touch devices),
 * this hook drives the resize directly from pointer events. That lets the handle respond to a
 * plain touch + drag — the gesture mobile users expect once an event has been lifted.
 */
export function useTouchEventResizeHandler(parameters: useTouchEventResizeHandler.Parameters) {
  const { ref, side, enabled } = parameters;

  const store = useSchedulerStoreContext();
  const adapter = useAdapterContext();
  const { start: columnStart, end: columnEnd } = useCalendarGridTimeColumnContext();
  const eventContext = useCalendarGridTimeEventContext();
  const { getSharedDragData, rootRef } = eventContext;

  React.useEffect(() => {
    const handle = ref.current;
    if (!handle || !enabled) {
      return undefined;
    }

    let activePointerId: number | null = null;
    let session: ReturnType<typeof getSharedDragData> | null = null;
    // Set instead of `session` when resizing a creation placeholder: it has no underlying
    // event, so the gesture updates the creation placeholder in place rather than committing
    // a drag/resize to an existing event.
    let creationAnchor: {
      start: SchedulerOccurrencePlaceholder['start'];
      end: SchedulerOccurrencePlaceholder['end'];
      surfaceType: SchedulerOccurrencePlaceholder['surfaceType'];
      resourceId: SchedulerOccurrencePlaceholder['resourceId'];
    } | null = null;

    // Maps a vertical pointer position to a precision-rounded date within the column.
    const getDateAtPointer = (clientY: number) => {
      const columnElement = rootRef.current?.offsetParent as HTMLElement | null;
      if (!columnElement) {
        return null;
      }
      const rect = columnElement.getBoundingClientRect();
      if (rect.height === 0) {
        return null;
      }
      const columnDurationMs = adapter.getTime(columnEnd) - adapter.getTime(columnStart);
      const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const rawOffsetMs = ratio * columnDurationMs;
      const roundedOffsetMs =
        Math.round(rawOffsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;
      return adapter.addMilliseconds(columnStart, roundedOffsetMs);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId || (session === null && creationAnchor === null)) {
        return;
      }
      event.preventDefault();

      const cursorDate = getDateAtPointer(event.clientY);
      if (!cursorDate) {
        return;
      }

      // Resizing a creation placeholder: update it in place, keeping its `creation` type.
      if (creationAnchor !== null) {
        let newStart = creationAnchor.start;
        let newEnd = creationAnchor.end;
        if (side === 'start') {
          const maxStartDate = adapter.addMinutes(creationAnchor.end, -EVENT_DRAG_PRECISION_MINUTE);
          newStart = adapter.isBefore(cursorDate, maxStartDate) ? cursorDate : maxStartDate;
        } else {
          const minEndDate = adapter.addMinutes(creationAnchor.start, EVENT_DRAG_PRECISION_MINUTE);
          newEnd = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
        }

        store.setOccurrencePlaceholder({
          type: 'creation',
          surfaceType: creationAnchor.surfaceType,
          start: newStart,
          end: newEnd,
          resourceId: creationAnchor.resourceId,
        });
        return;
      }

      let newStart = session!.start;
      let newEnd = session!.end;
      if (side === 'start') {
        // Keep at least one precision step between the new start and the fixed end.
        const maxStartDate = adapter.addMinutes(session!.end, -EVENT_DRAG_PRECISION_MINUTE);
        newStart = adapter.isBefore(cursorDate, maxStartDate) ? cursorDate : maxStartDate;
      } else {
        // Keep at least one precision step between the fixed start and the new end.
        const minEndDate = adapter.addMinutes(session!.start, EVENT_DRAG_PRECISION_MINUTE);
        newEnd = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
      }

      store.setOccurrencePlaceholder({
        type: 'internal-resize',
        surfaceType: 'time-grid',
        start: newStart,
        end: newEnd,
        eventId: session!.eventId,
        occurrenceKey: session!.occurrenceKey,
        originalOccurrence: session!.originalOccurrence,
        resourceId: session!.originalOccurrence.resource ?? null,
      });
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return;
      }
      if (handle.hasPointerCapture(activePointerId)) {
        handle.releasePointerCapture(activePointerId);
      }
      activePointerId = null;

      const wasResizingCreation = creationAnchor !== null;
      const wasResizing = session !== null;
      session = null;
      creationAnchor = null;

      // A resized creation placeholder stays as-is — the user keeps editing the new event in
      // the drawer; there is no existing event to commit the resize to.
      if (wasResizingCreation || !wasResizing) {
        return;
      }

      const placeholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
      if (isInternalDragOrResizePlaceholder(placeholder)) {
        applyInternalDragOrResizeOccurrencePlaceholder(
          store,
          placeholder,
          addPropertiesToResizedEvent,
        );
      } else {
        store.setOccurrencePlaceholder(null);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Ignore secondary mouse buttons; touch and pen always report button 0.
      if (event.button !== 0 || activePointerId !== null) {
        return;
      }
      // Stop the event from reaching the root, which would arm long-press detection and let
      // the native drag-and-drop adapter try to move the whole event instead of resizing it.
      event.stopPropagation();
      event.preventDefault();

      const placeholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
      if (placeholder?.type === 'creation') {
        // The placeholder has no underlying event, so `getSharedDragData` can't be used.
        creationAnchor = {
          start: placeholder.start,
          end: placeholder.end,
          surfaceType: placeholder.surfaceType,
          resourceId: placeholder.resourceId,
        };
      } else {
        session = getSharedDragData({ clientY: event.clientY });
      }
      activePointerId = event.pointerId;
      handle.setPointerCapture(event.pointerId);
    };

    handle.addEventListener('pointerdown', onPointerDown, { passive: false });
    handle.addEventListener('pointermove', onPointerMove, { passive: false });
    handle.addEventListener('pointerup', onPointerEnd);
    handle.addEventListener('pointercancel', onPointerEnd);

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerEnd);
      handle.removeEventListener('pointercancel', onPointerEnd);
      if (activePointerId !== null && handle.hasPointerCapture(activePointerId)) {
        handle.releasePointerCapture(activePointerId);
      }
    };
  }, [ref, side, enabled, store, adapter, columnStart, columnEnd, getSharedDragData, rootRef]);
}

export namespace useTouchEventResizeHandler {
  export interface Parameters {
    /**
     * The ref to the resize handler root element.
     */
    ref: React.RefObject<HTMLDivElement | null>;
    /**
     * The side of the event the handler resizes.
     */
    side: SchedulerEventSide;
    /**
     * Whether the pointer-based resize is active. When `false`, no listeners are attached.
     */
    enabled: boolean;
  }
}
