'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useStore } from '@base-ui-components/utils/store';
import { useSchedulerStoreContext } from '../use-scheduler-store-context';
import { selectors } from './SchedulerStore';
import { CalendarEventId, SchedulerValidDate } from '../models';
import { useDragPreview } from './useDragPreview';
import { useEvent } from './useEvent';
import { useAdapter } from '../use-adapter';

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
    collectionStart,
    collectionEnd,
    isDraggable = false,
  } = parameters;

  // Context hooks
  const adapter = useAdapter();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isDragging = useStore(store, selectors.isOccurrenceMatchingThePlaceholder, occurrenceKey);
  const event = useStore(store, selectors.event, eventId)!;

  // State hooks
  const [isResizing, setIsResizing] = React.useState(false);

  // Feature hooks
  const { state: eventState } = useEvent({ start, end });

  const preview = useDragPreview({
    type: 'internal-event',
    data: event,
    renderDragPreview,
    showPreviewOnDragStart: false,
  });

  const state = React.useMemo(
    () => ({
      ...eventState,
      dragging: isDragging,
      resizing: isResizing,
    }),
    [eventState, isDragging, isResizing],
  );

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

  const contextValue: useDraggableEvent.ContextValue = React.useMemo(
    () => ({
      setIsResizing,
      doesEventStartBeforeCollectionStart: adapter.isBefore(start, collectionStart),
      doesEventEndAfterCollectionEnd: adapter.isAfter(end, collectionEnd),
    }),
    [adapter, start, end, collectionStart, collectionEnd],
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
    extends useEvent.Parameters,
      Pick<useDragPreview.Parameters, 'renderDragPreview'> {
    /**
     * Whether the event can be dragged to change its start and end dates or times without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
    /**
     * The unique identifier of the event.
     */
    eventId: CalendarEventId;
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
     * The start date of the collection the event belongs to.
     */
    collectionStart: SchedulerValidDate;
    /**
     * The end date of the collection the event belongs to.
     */
    collectionEnd: SchedulerValidDate;
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
     * Sets whether the event is being resized.
     */
    setIsResizing: (isResizing: boolean) => void;
    /**
     * Whether the event starts before the collection starts.
     */
    doesEventStartBeforeCollectionStart: boolean;
    /**
     * Whether the event ends after the collection ends.
     */
    doesEventEndAfterCollectionEnd: boolean;
  }
}
