'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEvent } from '../../utils/useEvent';
import { CalendarEventId, SchedulerValidDate } from '../../models';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { diffIn } from '../../utils/date-utils';
import { useDayGridRowContext } from '../row/DayGridRowContext';
import { selectors } from '../../use-event-calendar/EventCalendarStore.selectors';
import { DayGridEventContext } from './DayGridEventContext';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';

const EVENT_PROPS_WHILE_DRAGGING = { style: { pointerEvents: 'none' as const } };

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  componentProps: DayGridEvent.Props,
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
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();
  const { state: eventState } = useEvent({ start, end });
  const store = useEventCalendarStoreContext();
  const hasPlaceholder = useStore(store, selectors.hasOccurrencePlaceholder);
  const isDragging = useStore(store, selectors.isOccurrenceMatchingThePlaceholder, occurrenceKey);
  const [isResizing, setIsResizing] = React.useState(false);

  const props = hasPlaceholder ? EVENT_PROPS_WHILE_DRAGGING : undefined;

  const state: DayGridEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging, resizing: isResizing }),
    [eventState, isDragging, isResizing],
  );

  const getDraggedDay = useEventCallback((input: { clientX: number }) => {
    if (!ref.current) {
      return start;
    }

    const eventStartInRow = adapter.isBefore(start, rowStart) ? rowStart : start;
    const eventEndInRow = adapter.isAfter(end, rowEnd) ? rowEnd : end;
    const eventDayLengthInRow = diffIn(adapter, eventEndInRow, eventStartInRow, 'days') + 1;
    const clientX = input.clientX;
    const elementPosition = ref.current.getBoundingClientRect();
    const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

    return adapter.addDays(eventStartInRow, Math.ceil(positionX * eventDayLengthInRow) - 1);
  });

  const getSharedDragData: DayGridEventContext['getSharedDragData'] = useEventCallback(() => ({
    eventId,
    occurrenceKey,
    start,
    end,
  }));

  const doesEventStartBeforeRowStart = React.useMemo(
    () => adapter.isBefore(start, rowStart),
    [adapter, start, rowStart],
  );

  const doesEventEndAfterRowEnd = React.useMemo(
    () => adapter.isAfter(end, rowEnd),
    [adapter, end, rowEnd],
  );

  const contextValue: DayGridEventContext = React.useMemo(
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
        source: 'DayGridEvent',
        draggedDay: getDraggedDay(input),
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDrop: () => store.setOccurrencePlaceholder(null),
    });
  }, [isDraggable, getDraggedDay, getSharedDragData, store]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <DayGridEventContext.Provider value={contextValue}>{element}</DayGridEventContext.Provider>
  );
});

export namespace DayGridEvent {
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
     * Whether the event can be dragged to change its start and end dates without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
  }

  export interface SharedDragData {
    eventId: CalendarEventId;
    occurrenceKey: string;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export interface DragData extends SharedDragData {
    source: 'DayGridEvent';
    draggedDay: SchedulerValidDate;
  }
}
