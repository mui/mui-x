'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { SchedulerEventDragData } from './schedulerDrag';
import type { SchedulerDraggable } from './SchedulerDraggable';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../../scheduler-selectors';
import type { RenderDragPreviewParameters, SchedulerEventId } from '../../models';
import type { useElementPositionInCollection } from './useElementPositionInCollection';
import { SchedulerDragPreview } from './SchedulerDragPreview';
import { useEvent } from './useEvent';
import { useOriginalOccurrence } from './useOriginalOccurrence';

export function useDraggableEvent<TData extends SchedulerEventDragData>(
  parameters: useDraggableEvent.Parameters<TData>,
): useDraggableEvent.ReturnValue<TData> {
  const {
    kind,
    start,
    end,
    occurrenceKey,
    eventId,
    dataTimezone,
    renderDragPreview,
    getExtraDragData,
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
  const canDropOutside = useStore(store, schedulerEventSelectors.canDropEventsToTheOutside);

  // Feature hooks
  const { state: eventState } = useEvent({ start, end, occurrenceKey });
  const getOriginalOccurrence = useOriginalOccurrence({
    eventId,
    occurrenceKey,
    start,
    end,
    dataTimezone,
  });

  // Read when the drag is about to start, so it always sees the latest event.
  const getDragData = useStableCallback(
    (input: { clientX: number; clientY: number }) =>
      ({
        originalOccurrence: getOriginalOccurrence(),
        start: start.value,
        end: end.value,
        ...getExtraDragData(input),
      }) as TData,
  );

  const state = {
    ...eventState,
    dragging: placeholderAction === 'internal-drag',
    resizing: placeholderAction === 'internal-resize',
  };

  const draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'> = {
    kind,
    disabled: !isDraggable,
    getDragData,
    preview: (
      <SchedulerDragPreview disabled={!canDropOutside}>
        {() => renderDragPreview({ type: 'internal-event', data: event })}
      </SchedulerDragPreview>
    ),
  };

  // A bound clipped by the collection range or hidden by the daily hour window does not
  // render at its real position, so it must not expose a resize handle: the drop math
  // reconstructs positions from the rendered edges. Taken from the position the caller
  // already rendered with, so "clipped" and "rendered somewhere else" cannot drift apart
  // — notably an end at the exact midnight closing the collection renders at its real
  // position.
  const contextValue: useDraggableEvent.ContextValue<TData> = React.useMemo(
    () => ({
      isEventStartClipped: position.startingBeforeEdge,
      isEventEndClipped: position.endingAfterEdge,
      getDragData,
    }),
    [position.startingBeforeEdge, position.endingAfterEdge, getDragData],
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

  export interface PublicParameters extends useEvent.Parameters {
    /**
     * Renders the preview that follows the pointer outside the Scheduler.
     * @param {RenderDragPreviewParameters} parameters The dragged event.
     * @returns {React.ReactNode} The content of the preview.
     */
    renderDragPreview: (parameters: RenderDragPreviewParameters) => React.ReactNode;
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

  export interface Parameters<TData extends SchedulerEventDragData>
    extends PublicParameters, Pick<useOriginalOccurrence.Parameters, 'dataTimezone'> {
    kind: SchedulerDraggable.Props<TData>['kind'];
    /**
     * Gets the fields the surface adds to the drag data of the occurrence, such as the grab offset.
     * @param {{ clientX: number, clientY: number }} input The pointer position that starts the drag.
     * @returns {object} The fields to add.
     */
    getExtraDragData: (input: {
      clientX: number;
      clientY: number;
    }) => Omit<TData, keyof SchedulerEventDragData>;
    /**
     * The position the caller renders the event at. The clipping flags come from it, so a
     * single pass of the positioning arithmetic serves both rendering and resizing.
     */
    position: useElementPositionInCollection.ReturnValue;
  }

  export interface ReturnValue<TData extends SchedulerEventDragData> {
    draggableProps: Omit<SchedulerDraggable.Props<TData>, 'render'>;
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
    /**
     * The context to access in useEventResizeHandler.
     */
    contextValue: ContextValue<TData>;
  }

  export interface ContextValue<TData extends SchedulerEventDragData = SchedulerEventDragData> {
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
    /**
     * Gets the drag data of the event, which its resize handlers extend with their side.
     * @param {{ clientX: number, clientY: number }} input The pointer position that starts the drag.
     * @returns {TData} The drag data.
     */
    getDragData: (input: { clientX: number; clientY: number }) => TData;
  }
}
