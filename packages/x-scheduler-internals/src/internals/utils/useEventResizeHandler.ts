'use client';
import * as React from 'react';
import type { SchedulerEventDragPayload, SchedulerEventResizeDragData } from './schedulerDrag';
import type { SchedulerDraggable } from './SchedulerDraggable';
import type { SchedulerEventSide } from '../../models';

/**
 * Base UI drag-and-drop resize for calendar events, for any pointer type.
 */
export function useEventResizeHandler<TData extends SchedulerEventResizeDragData>(
  parameters: useEventResizeHandler.Parameters<TData>,
): useEventResizeHandler.ReturnValue<TData> {
  const {
    side,
    enabled,
    getDragData,
    kind,
    eventId,
    occurrenceKey,
    activation,
    modifiers,
    dragCursor,
  } = parameters;

  const state: useEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
  );

  const payload = React.useMemo(() => ({ eventId, occurrenceKey }), [eventId, occurrenceKey]);

  const draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'> = {
    kind,
    payload,
    disabled: !enabled,
    getDragData,
    activation,
    modifiers,
    dragCursor,
  };

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

  export interface Parameters<TData extends SchedulerEventResizeDragData>
    extends PublicParameters, SchedulerEventDragPayload {
    kind: SchedulerDraggable.Props<TData>['kind'];
    /**
     * Whether to register the Base UI drag handler (false when the side is clipped by the
     * collection boundary).
     */
    enabled: boolean;
    /**
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: SchedulerDraggable.Props<TData>['getDragData'];
    /**
     * When a press on the handle starts a resize.
     */
    activation?: SchedulerDraggable.Props<TData>['activation'];
    /**
     * Constrains the pointer position the resize reads.
     */
    modifiers?: SchedulerDraggable.Props<TData>['modifiers'];
    /**
     * The cursor shown over the page while the mouse or pen resizes.
     */
    dragCursor?: SchedulerDraggable.Props<TData>['dragCursor'];
  }

  export interface ReturnValue<TData extends SchedulerEventResizeDragData> {
    draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'>;
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
  }
}
