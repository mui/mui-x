'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useEvent } from '../../utils/useEvent';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import { useAdapter } from '../../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { selectors } from '../../use-event-calendar';
import { CalendarEvent, SchedulerValidDate } from '../../models';
import { useDragPreview } from '../../utils/useDragPreview';

export const CalendarGridTimeEvent = React.forwardRef(function CalendarGridTimeEvent(
  componentProps: CalendarGridTimeEvent.Props,
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
    isDraggable = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);
  const store = useEventCalendarStoreContext();
  const isDragging = useStore(store, selectors.isOccurrenceMatchingThePlaceholder, occurrenceKey);
  const [isResizing, setIsResizing] = React.useState(false);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const preview = useDragPreview({
    elementProps,
    componentProps,
    showPreviewOnDragStart: false,
  });

  const {
    start: columnStart,
    end: columnEnd,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
        [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const { state: eventState } = useEvent({ start, end });

  const state: CalendarGridTimeEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging, resizing: isResizing }),
    [eventState, isDragging, isResizing],
  );

  const getSharedDragData: CalendarGridTimeEventContext['getSharedDragData'] = useEventCallback(
    (input) => {
      const offsetBeforeColumnStart = Math.max(
        adapter.toJsDate(columnStart).getTime() - adapter.toJsDate(start).getTime(),
        0,
      );
      const offsetInsideColumn = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        event: selectors.event(store.state, eventId)!,
        start,
        end,
        initialCursorPositionInEventMs: offsetBeforeColumnStart + offsetInsideColumn,
      };
    },
  );

  const doesEventStartBeforeColumnStart = React.useMemo(
    () => adapter.isBefore(start, columnStart),
    [adapter, start, columnStart],
  );

  const doesEventEndAfterColumnEnd = React.useMemo(
    () => adapter.isAfter(end, columnEnd),
    [adapter, end, columnEnd],
  );

  const contextValue: CalendarGridTimeEventContext = React.useMemo(
    () => ({
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeColumnStart,
      doesEventEndAfterColumnEnd,
    }),
    [getSharedDragData, doesEventStartBeforeColumnStart, doesEventEndAfterColumnEnd],
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
        source: 'CalendarGridTimeEvent',
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
    ref: [forwardedRef, buttonRef, ref],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <CalendarGridTimeEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </CalendarGridTimeEventContext.Provider>
  );
});

export namespace CalendarGridTimeEvent {
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

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {
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
    eventId: string | number;
    occurrenceKey: string;
    event: CalendarEvent;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridTimeEvent';
  }
}
