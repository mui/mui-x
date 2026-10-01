'use client';
import * as React from 'react';
import type { SchedulerEventDragData } from './schedulerDrag';
import type { useDraggableEvent } from './useDraggableEvent';
import type { SchedulerEventSide } from '../../models';

/**
 * Base UI drag-and-drop resize for calendar events, for any pointer type.
 * `TEventData` is the drag data of the event whose edge the handler resizes.
 */
export function useEventResizeHandler<TEventData extends SchedulerEventDragData>(
  parameters: useEventResizeHandler.Parameters<TEventData>,
): useEventResizeHandler.ReturnValue<TEventData> {
  const { context, side } = parameters;

  // A side clipped by the collection boundary does not render at its real position, and the drop
  // math reconstructs positions from the rendered edges.
  const enabled = !(side === 'start' ? context.isEventStartClipped : context.isEventEndClipped);

  const state: useEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
  );

  // Read again when the drag is about to start, so it always sees the latest event.
  const getDragData = (input: { clientX: number; clientY: number }) => ({
    ...context.getDragData(input),
    side,
  });

  return { state, enabled, getDragData };
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
    context: useDraggableEvent.ContextValue<TEventData>;
  }

  export interface ReturnValue<TEventData extends SchedulerEventDragData> {
    /**
     * Gets the drag data of the resize: the one of the event, with the side of the handler.
     * @param {{ clientX: number, clientY: number }} input The pointer position that starts the drag.
     * @returns {TEventData & { side: SchedulerEventSide }} The drag data.
     */
    getDragData: (input: {
      clientX: number;
      clientY: number;
    }) => TEventData & { side: SchedulerEventSide };
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
