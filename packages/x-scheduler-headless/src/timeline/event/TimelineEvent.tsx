'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { CalendarEvent, CalendarEventId, SchedulerValidDate } from '../../models';
import { useAdapter } from '../../use-adapter';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { selectors } from '../../use-timeline';
import { useDragPreview } from '../../utils/useDragPreview';
import { useTimelineEventRowContext } from '../event-row/TimelineEventRowContext';
import { useEvent } from '../../utils/useEvent';
import { TimelineEventCssVars } from './TimelineEventCssVars';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { TimelineEventContext } from './TimelineEventContext';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  componentProps: TimelineEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    eventId,
    occurrenceKey,
    renderDragPreview,
    isDraggable = false,
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const {
    start: rowStart,
    end: rowEnd,
    getCursorPositionInElementMs,
  } = useTimelineEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

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

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [TimelineEventCssVars.xPosition]: `${position * 100}%`,
        [TimelineEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const state: TimelineEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging, resizing: isResizing }),
    [eventState, isDragging, isResizing],
  );

  const getSharedDragData: TimelineEventContext['getSharedDragData'] = useEventCallback((input) => {
    const offsetBeforeRowStart = Math.max(
      adapter.toJsDate(rowStart).getTime() - adapter.toJsDate(start).getTime(),
      0,
    );
    const offsetInsideRow = getCursorPositionInElementMs({ input, elementRef: ref });
    return {
      eventId,
      occurrenceKey,
      event: selectors.event(store.state, eventId)!,
      start,
      end,
      initialCursorPositionInEventMs: offsetBeforeRowStart + offsetInsideRow,
    };
  });

  const doesEventStartBeforeRowStart = React.useMemo(
    () => adapter.isBefore(start, rowStart),
    [adapter, start, rowStart],
  );

  const doesEventEndAfterRowEnd = React.useMemo(
    () => adapter.isAfter(end, rowEnd),
    [adapter, end, rowEnd],
  );

  const contextValue: TimelineEventContext = React.useMemo(
    () => ({
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeRowStart,
      doesEventEndAfterRowEnd,
    }),
    [getSharedDragData, doesEventStartBeforeRowStart, doesEventEndAfterRowEnd],
  );

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: ({ input }) => ({
        ...getSharedDragData(input),
        source: 'TimelineEvent',
      }),
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
  }, [getSharedDragData, isDraggable, store, preview.actions]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref, buttonRef],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <TimelineEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </TimelineEventContext.Provider>
  );
});

export namespace TimelineEvent {
  export interface State extends useEvent.State {
    /**
     * Whether the event is being dragged.
     */
    dragging: boolean;
    /**
     * Whether the event is being resized.
     */
    resizing: boolean;
  }

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useEvent.Parameters,
      Pick<useDragPreview.Parameters, 'renderDragPreview'> {
    /**
     * The unique identifier of the event.
     */
    eventId: string | number;
    /**
     * The unique identifier of the event occurrence.
     */
    occurrenceKey: string;
    /**
     * Whether the event can be dragged to change its start and end dates or times without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
  }

  export interface SharedDragData {
    eventId: CalendarEventId;
    occurrenceKey: string;
    event: CalendarEvent;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'TimelineEvent';
  }
}
