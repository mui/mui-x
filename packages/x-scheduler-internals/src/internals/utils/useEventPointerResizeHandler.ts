'use client';
import * as React from 'react';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { useAdapterContext } from '../../use-adapter-context';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import { EVENT_DRAG_PRECISION_MINUTE } from '../../constants';
import { applyInternalDragOrResizeOccurrencePlaceholder } from './useDropTarget';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { clampResizedEventEdge } from './resize-utils';
import {
  EventSurfaceType,
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerEventSide,
  SchedulerResourceId,
  TemporalSupportedObject,
} from '../../models';

/**
 * Pointer-based resize for calendar events. Unlike {@link useEventResizeHandler} (native
 * drag-and-drop, which needs a long-press on touch), this responds to a plain touch + drag.
 *
 * Surface-agnostic: the axis/geometry come from `getDateAtPointer` and the surface semantics
 * from `surfaceType`/`getResizeSession`, so the same hook can drive any surface with a
 * different resolver.
 */
export function useEventPointerResizeHandler(parameters: useEventPointerResizeHandler.Parameters) {
  const {
    ref,
    side,
    enabled,
    surfaceType,
    getDateAtPointer,
    getResizeSession,
    addPropertiesToResizedEvent,
    precisionMinute = EVENT_DRAG_PRECISION_MINUTE,
  } = parameters;

  const store = useSchedulerStoreContext();
  const adapter = useAdapterContext();

  React.useEffect(() => {
    const handle = ref.current;
    if (!handle || !enabled) {
      return undefined;
    }

    let activePointerId: number | null = null;
    let session: useEventPointerResizeHandler.ResizeSession | null = null;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId || session === null) {
        return;
      }
      event.preventDefault();

      const cursorDate = getDateAtPointer({ clientX: event.clientX, clientY: event.clientY });
      if (!cursorDate) {
        return;
      }

      const { start, end } = clampResizedEventEdge({
        adapter,
        side,
        start: session.start,
        end: session.end,
        cursorDate,
        precisionMinute,
      });

      if (session.kind === 'creation') {
        // A creation placeholder has no underlying event: keep its `creation` type so the user
        // keeps sizing the new event before saving it.
        store.setOccurrencePlaceholder({
          type: 'creation',
          surfaceType,
          start,
          end,
          resourceId: session.resourceId,
        });
        return;
      }

      store.setOccurrencePlaceholder({
        type: 'internal-resize',
        surfaceType,
        start,
        end,
        eventId: session.eventId,
        occurrenceKey: session.occurrenceKey,
        originalOccurrence: session.originalOccurrence,
        resourceId: session.resourceId,
      });
    };

    // Releases the pointer capture, clears the gesture and returns the session in progress (or
    // `null`) so the caller can decide whether to commit it.
    const finishGesture = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return undefined;
      }
      if (handle.hasPointerCapture(activePointerId)) {
        handle.releasePointerCapture(activePointerId);
      }
      activePointerId = null;
      const endedSession = session;
      session = null;
      return endedSession;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return;
      }
      const endedSession = finishGesture(event);

      // A creation placeholder stays as-is — there is no existing event to commit to.
      if (!endedSession || endedSession.kind === 'creation') {
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

    // The gesture was aborted by the system (e.g. a scroll took over): discard the resize preview
    // so an interrupted gesture never edits the event.
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return;
      }
      const endedSession = finishGesture(event);
      // Keep a creation placeholder for further editing; drop a resize preview to revert the event.
      if (endedSession && endedSession.kind !== 'creation') {
        store.setOccurrencePlaceholder(null);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Ignore secondary mouse buttons; touch and pen always report button 0.
      if (event.button !== 0 || activePointerId !== null) {
        return;
      }
      // Stop the event from reaching the root, where it would arm long-press detection and let the
      // native drag-and-drop adapter move the whole event instead of resizing it.
      event.stopPropagation();
      event.preventDefault();

      session = getResizeSession({ clientX: event.clientX, clientY: event.clientY });
      if (session === null) {
        return;
      }
      activePointerId = event.pointerId;
      handle.setPointerCapture(event.pointerId);
    };

    handle.addEventListener('pointerdown', onPointerDown, { passive: false });
    handle.addEventListener('pointermove', onPointerMove, { passive: false });
    handle.addEventListener('pointerup', onPointerUp);
    handle.addEventListener('pointercancel', onPointerCancel);

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerUp);
      handle.removeEventListener('pointercancel', onPointerCancel);
      if (activePointerId !== null && handle.hasPointerCapture(activePointerId)) {
        handle.releasePointerCapture(activePointerId);
      }
    };
  }, [
    ref,
    side,
    enabled,
    surfaceType,
    precisionMinute,
    store,
    adapter,
    getDateAtPointer,
    getResizeSession,
    addPropertiesToResizedEvent,
  ]);
}

export namespace useEventPointerResizeHandler {
  /**
   * A resize gesture targeting an existing event. The resize is committed on pointer-up.
   */
  export interface EventResizeSession {
    kind: 'event';
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    resourceId: SchedulerResourceId | null;
  }

  /**
   * A resize gesture targeting a not-yet-saved creation placeholder. Nothing is committed; the
   * placeholder is updated in place so the surface can keep editing the new event.
   */
  export interface CreationResizeSession {
    kind: 'creation';
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    resourceId: SchedulerResourceId | null;
  }

  export type ResizeSession = EventResizeSession | CreationResizeSession;

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
    /**
     * The surface the resized placeholder belongs to.
     */
    surfaceType: EventSurfaceType;
    /**
     * Maps a pointer position to a precision-rounded date on the surface. Should be stable.
     */
    getDateAtPointer: (input: {
      clientX: number;
      clientY: number;
    }) => TemporalSupportedObject | null;
    /**
     * Resolves the session to start when the pointer goes down, or `null` to ignore the gesture.
     * Should be stable.
     */
    getResizeSession: (input: { clientX: number; clientY: number }) => ResizeSession | null;
    /**
     * Extra properties applied to the event when a resize of an existing event is committed.
     */
    addPropertiesToResizedEvent?: () => Partial<SchedulerEvent>;
    /**
     * The minimum duration, in minutes, the event must keep.
     * @default EVENT_DRAG_PRECISION_MINUTE
     */
    precisionMinute?: number;
  }
}
