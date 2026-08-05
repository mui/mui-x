'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../../scheduler-selectors';
import type { SchedulerEventId } from '../../models';
import { isStartMinuteOutsideAxisWindow, isEndMinuteOutsideAxisWindow } from './timeline-axis';
import type { TimelineAxis } from './timeline-axis';
import { useDragPreview } from './useDragPreview';
import { useEvent } from './useEvent';
import { useAdapterContext } from '../../use-adapter-context';

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
    collection,
    isDraggable = false,
  } = parameters;
  // Deconstructed so an inline collection object stays memoization-friendly.
  const { start: collectionStart, end: collectionEnd, dayStartMinute, dayEndMinute } = collection;

  // Context hooks
  const adapter = useAdapterContext();
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
  // reconstructs positions from the rendered edges.
  const contextValue: useDraggableEvent.ContextValue = React.useMemo(() => {
    const axis = { start: collectionStart, end: collectionEnd, dayStartMinute, dayEndMinute };
    return {
      isEventStartClipped:
        adapter.isBefore(start.value, collectionStart) ||
        isStartMinuteOutsideAxisWindow(axis, start.minutesInDay),
      isEventEndClipped:
        adapter.isAfter(end.value, collectionEnd) ||
        isEndMinuteOutsideAxisWindow(axis, end.minutesInDay),
    };
  }, [adapter, start, end, collectionStart, collectionEnd, dayStartMinute, dayEndMinute]);

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
     * The displayed range and daily hour window of the collection the event belongs to.
     */
    collection: TimelineAxis;
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
