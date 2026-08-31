'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/utils/disable-native-drag-preview';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../../scheduler-selectors';
import type { SchedulerEventId, SchedulerProcessedDate } from '../../models';
import type { useElementPositionInCollection } from './useElementPositionInCollection';
import { useDragPreview } from './useDragPreview';
import { useEvent } from './useEvent';

export function useDraggableEvent(
  parameters: useDraggableEvent.Parameters,
): useDraggableEvent.ReturnValue {
  const {
    ref,
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
    showPreviewOnDragStart: false,
  });

  const state = {
    ...eventState,
    dragging: placeholderAction === 'internal-drag',
    resizing: placeholderAction === 'internal-resize',
  };

  React.useEffect(() => {
    if (!isDraggable || !ref.current) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current,
      getInitialData: ({ input }) => getDragData(input),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: ({ location }) => {
        preview.actions.onDragStart(location);
      },
      onDrag: ({ location }) => {
        preview.actions.onDrag(location);
      },
      onDrop: () => {
        store.setOccurrencePlaceholder(null);
        preview.actions.onDrop();
      },
    });
  }, [ref, getDragData, isDraggable, store, preview.actions]);

  // A bound clipped by the collection range or hidden by the daily hour window does not
  // render at its real position, so it must not expose a resize handle: the drop math
  // reconstructs positions from the rendered edges. Taken from the position the caller
  // already rendered with, so "clipped" and "rendered somewhere else" cannot drift apart
  // — notably an end at the exact midnight closing the collection renders at its real
  // position.
  const contextValue: useDraggableEvent.ContextValue = React.useMemo(
    () => ({
      isEventStartClipped: position.startingBeforeEdge,
      isEventEndClipped: position.endingAfterEdge,
    }),
    [position.startingBeforeEdge, position.endingAfterEdge],
  );

  return { state, preview, contextValue };
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
    /**
     * The occurrence bounds in the data timezone, used as the occurrence identity for
     * recurring drag updates. Default to `start`/`end` (the rendered display bounds),
     * which sit on a different day for a cross-timezone all-day occurrence.
     */
    dataStart?: SchedulerProcessedDate;
    dataEnd?: SchedulerProcessedDate;
  }

  export interface Parameters extends PublicParameters {
    /**
     * Gets the drag data.
     * @param {{ clientX: number, clientY: number }} input The input object provided by the drag and drop library for the current event.
     * @returns {any} The shared drag data.
     */
    getDragData: (input: { clientX: number; clientY: number }) => any;
    /**
     * The ref to the event's root element.
     */
    ref: React.RefObject<HTMLDivElement | null>;
    /**
     * The position the caller renders the event at. The clipping flags come from it, so a
     * single pass of the positioning arithmetic serves both rendering and resizing.
     */
    position: useElementPositionInCollection.ReturnValue;
  }

  export interface ReturnValue {
    /**
     * The state to pass to the useRenderElement hook.
     */
    state: State;
    /**
     * The context to access in useEventResizeHandler.
     */
    contextValue: ContextValue;
    /**
     * The drag preview to render when the dragged event is not over a valid drop target.
     */
    preview: useDragPreview.ReturnValue;
  }

  export interface ContextValue {
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
