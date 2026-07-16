'use client';
import * as React from 'react';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { useAdapterContext } from '../../use-adapter-context';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import { EVENT_DRAG_PRECISION_MINUTE } from '../../constants';
import { applyInternalDragOrResizeOccurrencePlaceholder } from './useDropTarget';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { clampResizedEventEdge } from './resize-utils';
import type {
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
 * drag-and-drop, needs a long-press on touch), this responds to a plain touch + drag.
 *
 * Surface-agnostic: geometry comes from `getDateAtPointer` and surface semantics from
 * `surfaceType`/`getResizeSession`, so one hook drives any surface.
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

  // Gesture state lives in refs, not effect-local variables, so a mid-gesture effect re-run (a
  // dependency flipping while the finger is down) re-attaches the listeners without dropping the
  // active pointer or silently discarding the resize. Pointer capture stays on the DOM element across
  // the listener churn, so the gesture continues seamlessly.
  const activePointerIdRef = React.useRef<number | null>(null);
  const sessionRef = React.useRef<useEventPointerResizeHandler.ResizeSession | null>(null);

  React.useEffect(() => {
    const handle = ref.current;
    if (!handle) {
      return undefined;
    }

    if (!enabled) {
      // Disabled mid-gesture: release capture and revert any in-progress resize preview.
      const pointerId = activePointerIdRef.current;
      if (pointerId !== null) {
        if (handle.hasPointerCapture(pointerId)) {
          handle.releasePointerCapture(pointerId);
        }
        const abortedSession = sessionRef.current;
        activePointerIdRef.current = null;
        sessionRef.current = null;
        if (abortedSession && abortedSession.kind !== 'creation') {
          store.setOccurrencePlaceholder(null);
        }
      }
      return undefined;
    }

    const onPointerMove = (event: PointerEvent) => {
      const session = sessionRef.current;
      if (event.pointerId !== activePointerIdRef.current || session === null) {
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
        // Creation placeholder has no underlying event: keep its `creation` type so it stays editable.
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

    // Release capture, clear the gesture, return the in-progress session (or `null`) to the caller.
    const finishGesture = (event: PointerEvent) => {
      const activePointerId = activePointerIdRef.current;
      if (activePointerId === null || event.pointerId !== activePointerId) {
        return undefined;
      }
      if (handle.hasPointerCapture(activePointerId)) {
        handle.releasePointerCapture(activePointerId);
      }
      activePointerIdRef.current = null;
      const endedSession = sessionRef.current;
      sessionRef.current = null;
      return endedSession;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointerIdRef.current) {
        return;
      }
      const endedSession = finishGesture(event);

      // Creation placeholder stays as-is — no existing event to commit to.
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

    // Gesture aborted by the system (e.g. scroll took over): discard the resize preview so it never edits the event.
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId !== activePointerIdRef.current) {
        return;
      }
      const endedSession = finishGesture(event);
      // Keep a creation placeholder for further editing; drop a resize preview to revert the event.
      if (endedSession && endedSession.kind !== 'creation') {
        store.setOccurrencePlaceholder(null);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Mouse resizes via the native drag-and-drop handler (sharing this handle), so let it fall
      // through. Touch and pen resize here, since native drag-and-drop doesn't start from a touch.
      if (event.pointerType === 'mouse') {
        return;
      }
      // Ignore secondary mouse buttons; touch and pen always report button 0.
      if (event.button !== 0 || activePointerIdRef.current !== null) {
        return;
      }
      // Stop the event reaching the root, where long-press detection would drag the whole event instead.
      event.stopPropagation();
      event.preventDefault();

      const session = getResizeSession({ clientX: event.clientX, clientY: event.clientY });
      if (session === null) {
        return;
      }
      sessionRef.current = session;
      activePointerIdRef.current = event.pointerId;
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
      // Intentionally leave `activePointerIdRef`/`sessionRef` and the pointer capture untouched: if this
      // cleanup runs mid-gesture because a dependency changed, the re-run re-attaches the listeners and
      // the gesture continues. A true unmount detaches the element, which releases the capture anyway.
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
   * placeholder is updated in place so the surface keeps editing the new event.
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
     * Resolves the session to start on pointer-down, or `null` to ignore the gesture. Should be stable.
     */
    getResizeSession: (input: { clientX: number; clientY: number }) => ResizeSession | null;
    /**
     * Extra properties applied to the event when a resize of an existing event is committed.
     */
    addPropertiesToResizedEvent?: () => Partial<SchedulerEvent>;
    /**
     * The resize granularity, in minutes: both the snap step and the minimum duration the event must
     * keep (intentionally coupled — see {@link clampResizedEventEdge}).
     * @default EVENT_DRAG_PRECISION_MINUTE
     */
    precisionMinute?: number;
  }
}
