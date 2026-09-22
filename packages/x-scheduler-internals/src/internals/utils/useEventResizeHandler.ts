'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { schedulerEventResizeKind } from './schedulerDrag';
import type { SchedulerEventDragPayload, SchedulerEventResizeData } from './schedulerDrag';
import type { SchedulerDraggable } from './SchedulerDraggable';
import type { SchedulerEventSide } from '../../models';

/**
 * Base UI drag-and-drop resize for calendar events. This hook and the pointer-based resize
 * ({@link useEventPointerResizeHandler}) run together on the same handle and share one `enabled`
 * (the edge is inside the collection). The mouse is served here; touch and pen are served by the
 * pointer hook, which bails on `pointerType === 'mouse'`.
 */
export function useEventResizeHandler(
  parameters: useEventResizeHandler.Parameters,
): useEventResizeHandler.ReturnValue {
  const {
    ref,
    side,
    enabled,
    getDragData,
    source,
    eventId,
    occurrenceKey,
    directPointerResize = false,
  } = parameters;

  const state: useEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
  );

  const payload = React.useMemo(
    () => ({ source, eventId, occurrenceKey }),
    [source, eventId, occurrenceKey],
  );

  const draggableProps: Omit<SchedulerDraggable.Props<SchedulerEventResizeData>, 'render'> = {
    kind: schedulerEventResizeKind,
    payload,
    disabled: !enabled,
    getDragData,
    // Veto during pointer-down, before the direct handler captures the pointer.
    // Waiting for a hold or movement would let pending-gesture cleanup release it.
    activation: directPointerResize
      ? { touch: { type: 'immediate' }, pen: { type: 'immediate' } }
      : undefined,
    onBeforeMoveStart: (context, details) => {
      // The direct resize handler owns touch and pen on time-grid events.
      if (directPointerResize && context.input.pointerType !== 'mouse') {
        details.cancel();
      }
    },
  };

  useIsoLayoutEffect(() => {
    // Base UI sets touch-action: manipulation when its ref registers the source.
    // Resize handles must keep the page from panning during the direct gesture.
    if (enabled) {
      ref.current?.style.setProperty('touch-action', 'none');
    }
  }, [ref, enabled]);

  return { state, draggableProps };
}

export namespace useEventResizeHandler {
  export interface State {
    /**
     * Whether the resize handler is targeting the start date of the event.
     */
    start: boolean;
    /**
     * Whether the resize handler is targeting the end date of the event.
     */
    end: boolean;
  }

  export interface PublicParameters {
    /**
     * The date to edit when dragging the resize handler.
     */
    side: SchedulerEventSide;
  }

  export interface Parameters
    extends PublicParameters, SchedulerEventDragPayload<SchedulerEventResizeData> {
    /** Whether a separate pointer handler owns touch and pen resize gestures. */
    directPointerResize?: boolean;
    /**
     * The ref to the event's resize handler root element.
     */
    ref: React.RefObject<HTMLDivElement | null>;
    /**
     * Whether to register the Base UI drag handler (false when the side is clipped by the
     * collection boundary). Shared with {@link useEventPointerResizeHandler} — it is never turned
     * off "because the pointer interaction is active".
     */
    enabled: boolean;
    /**
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: SchedulerDraggable.Props<SchedulerEventResizeData>['getDragData'];
  }

  export interface ReturnValue {
    draggableProps: Omit<SchedulerDraggable.Props<SchedulerEventResizeData>, 'render'>;
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
  }
}
