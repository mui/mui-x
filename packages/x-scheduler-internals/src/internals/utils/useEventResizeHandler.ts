'use client';
import * as React from 'react';
import type { Draggable } from '@base-ui/react/draggable';
import type { SchedulerEventDragData, SchedulerEventDragPayload } from './schedulerDrag';
import type { SchedulerDraggable } from './SchedulerDraggable';
import type { useDraggableEvent } from './useDraggableEvent';
import { isResizeHandlerEnabled } from './resize-utils';
import type { SchedulerEventSide } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';

/**
 * Base UI drag-and-drop resize for calendar events, for any pointer type.
 * `TEventData` is the drag data of the event whose edge the handler resizes.
 */
export function useEventResizeHandler<TEventData extends SchedulerEventDragData>(
  parameters: useEventResizeHandler.Parameters<TEventData>,
): useEventResizeHandler.ReturnValue<TEventData> {
  const { context, getEventDragData, kind, side, activation, modifiers, dragCursor } = parameters;

  // A side clipped by the collection boundary does not render at its real position.
  const enabled = isResizeHandlerEnabled({
    side,
    isEventStartClipped: context.isEventStartClipped,
    isEventEndClipped: context.isEventEndClipped,
  });

  const state: useEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
  );

  const store = useSchedulerStoreContext();
  const { eventId, occurrenceKey } = context;
  const payload = React.useMemo(
    () => ({ eventId, occurrenceKey, store }),
    [eventId, occurrenceKey, store],
  );

  // Read again when the drag is about to start, so it always sees the latest event.
  const getDragData = (input: { clientX: number; clientY: number }) => ({
    ...getEventDragData(input),
    side,
  });

  const draggableProps: Omit<
    SchedulerDraggable.Props<TEventData & { side: SchedulerEventSide }>,
    'render'
  > = {
    kind,
    payload,
    disabled: !enabled,
    getDragData,
    activation,
    modifiers,
    dragCursor,
  };

  return { state, enabled, draggableProps };
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

  export interface Parameters<TEventData extends SchedulerEventDragData> extends PublicParameters {
    /**
     * The context of the event the handler belongs to.
     */
    context: useDraggableEvent.ContextValue;
    /**
     * Gets the drag data of the event. The handler adds its `side`.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The drag data of the event.
     */
    getEventDragData: (input: { clientX: number; clientY: number }) => TEventData;
    kind: Draggable.Kind<SchedulerEventDragPayload, TEventData & { side: SchedulerEventSide }>;
    /**
     * When a press on the handle starts a resize.
     */
    activation?: SchedulerDraggable.Props<TEventData & { side: SchedulerEventSide }>['activation'];
    /**
     * Constrains the pointer position the resize reads.
     */
    modifiers?: SchedulerDraggable.Props<TEventData & { side: SchedulerEventSide }>['modifiers'];
    /**
     * The cursor shown over the page while the mouse or pen resizes.
     */
    dragCursor?: SchedulerDraggable.Props<TEventData & { side: SchedulerEventSide }>['dragCursor'];
  }

  export interface ReturnValue<TEventData extends SchedulerEventDragData> {
    draggableProps: Omit<
      SchedulerDraggable.Props<TEventData & { side: SchedulerEventSide }>,
      'render'
    >;
    /**
     * Whether the handler renders and can start a resize.
     */
    enabled: boolean;
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
  }
}
