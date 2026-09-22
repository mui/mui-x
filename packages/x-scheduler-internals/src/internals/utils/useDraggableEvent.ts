'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventDragPayload, SchedulerEventMoveData } from './schedulerDrag';
import type { SchedulerDraggable } from './SchedulerDraggable';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../../scheduler-selectors';
import type { SchedulerEventId } from '../../models';
import type { useElementPositionInCollection } from './useElementPositionInCollection';
import { useDragPreview } from './useDragPreview';
import { useEvent } from './useEvent';

export function useDraggableEvent<TData extends SchedulerEventMoveData>(
  parameters: useDraggableEvent.Parameters<TData>,
): useDraggableEvent.ReturnValue<TData> {
  const {
    source,
    kind,
    start,
    end,
    occurrenceKey,
    eventId,
    renderDragPreview,
    getDragData,
    position,
    isDraggable = false,
  } = parameters;

  // Context hooks
  const store = useSchedulerStoreContext();

  // Selector hooks
  const placeholderAction = useStore(
    store,
    schedulerOccurrencePlaceholderSelectors.actionForOccurrence,
    occurrenceKey,
  );
  const event = useStore(store, schedulerEventSelectors.processedEvent, eventId)!;

  // Feature hooks
  const { state: eventState } = useEvent({ start, end, occurrenceKey });

  const preview = useDragPreview({
    type: 'internal-event',
    data: event,
    renderDragPreview,
  });

  const state = {
    ...eventState,
    dragging: placeholderAction === 'internal-drag',
    resizing: placeholderAction === 'internal-resize',
  };

  const payload = React.useMemo(
    () => ({ source, eventId, occurrenceKey }),
    [source, eventId, occurrenceKey],
  );

  const draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'> = {
    kind,
    payload,
    disabled: !isDraggable,
    getDragData,
    preview: preview.element,
    onMoveEnd: () => {
      store.setOccurrencePlaceholder(null);
    },
  };

  // A bound clipped by the collection range or hidden by the daily hour window does not
  // render at its real position, so it must not expose a resize handle: the drop math
  // reconstructs positions from the rendered edges. Taken from the position the caller
  // already rendered with, so "clipped" and "rendered somewhere else" cannot drift apart
  // — notably an end at the exact midnight closing the collection renders at its real
  // position.
  const contextValue: useDraggableEvent.ContextValue = React.useMemo(
    () => ({
      eventId,
      occurrenceKey,
      isEventStartClipped: position.startingBeforeEdge,
      isEventEndClipped: position.endingAfterEdge,
    }),
    [eventId, occurrenceKey, position.startingBeforeEdge, position.endingAfterEdge],
  );

  return { state, contextValue, draggableProps };
}

export namespace useDraggableEvent {
  export interface State {
    /**
     * Whether the event is being dragged.
     */
    dragging: boolean;
    /**
     * Whether the event is being resized.
     */
    resizing: boolean;
  }

  export interface PublicParameters
    extends useEvent.Parameters, Pick<useDragPreview.Parameters, 'renderDragPreview'> {
    /**
     * Whether the event can be dragged to change its start and end dates or times without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
    /**
     * The unique identifier of the event.
     */
    eventId: SchedulerEventId;
    /**
     * The unique identifier of the event occurrence.
     */
    occurrenceKey: string;
  }

  export interface Parameters<TData extends SchedulerEventMoveData> extends PublicParameters {
    kind: SchedulerDraggable.Props<TData>['kind'];
    source: SchedulerEventDragPayload<TData>['source'];
    /**
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: SchedulerDraggable.Props<TData>['getDragData'];
    /**
     * The position the caller renders the event at. The clipping flags come from it, so a
     * single pass of the positioning arithmetic serves both rendering and resizing.
     */
    position: useElementPositionInCollection.ReturnValue;
  }

  export interface ReturnValue<TData extends SchedulerEventMoveData> {
    draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'>;
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
    /**
     * The context to access in useEventResizeHandler.
     */
    contextValue: ContextValue;
  }

  export interface ContextValue {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    /**
     * Whether the event's start does not render at its real position: it is before the
     * collection start or hidden by the daily hour window.
     */
    isEventStartClipped: boolean;
    /**
     * Whether the event's end does not render at its real position: it is after the
     * collection end or hidden by the daily hour window.
     */
    isEventEndClipped: boolean;
  }
}
