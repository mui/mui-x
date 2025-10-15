'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useId } from '@base-ui-components/utils/useId';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { useDraggableEvent } from '../../utils/useDraggableEvent';
import { CalendarEvent, CalendarEventId, SchedulerValidDate } from '../../models';
import { useAdapter, diffIn } from '../../use-adapter';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import { selectors } from '../../use-event-calendar/EventCalendarStore.selectors';
import { getCalendarGridHeaderCellId } from '../../utils/accessibility-utils';
import { CalendarGridDayEventContext } from './CalendarGridDayEventContext';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayCellContext } from '../day-cell/CalendarGridDayCellContext';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';

const EVENT_STYLE_WHILE_DRAGGING = { pointerEvents: 'none' as const };

export const CalendarGridDayEvent = React.forwardRef(function CalendarGridDayEvent(
  componentProps: CalendarGridDayEvent.Props,
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
    id: idProp,
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
  const store = useEventCalendarStoreContext();
  const { id: rootId } = useCalendarGridRootContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();
  const { index: cellIndex } = useCalendarGridDayCellContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const hasPlaceholder = useStore(store, selectors.hasOccurrencePlaceholder);

  // State hooks
  const id = useId(idProp);

  // Feature hooks
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

  const getSharedDragData: CalendarGridDayEventContext['getSharedDragData'] = useEventCallback(
    () => ({
      eventId,
      occurrenceKey,
      event: selectors.event(store.state, eventId)!,
      start,
      end,
    }),
  );

  const getDragData = useEventCallback((input) => ({
    ...getSharedDragData(input),
    source: 'CalendarGridDayEvent',
    draggedDay: getDraggedDay(input),
  }));

  const { state, preview, setIsResizing } = useDraggableEvent({
    ref,
    start,
    end,
    occurrenceKey,
    eventId,
    isDraggable,
    renderDragPreview,
    getDragData,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  // Rendering hooks

  const columnHeaderId = getCalendarGridHeaderCellId(rootId, cellIndex);

  const props = React.useMemo(
    () => ({
      id,
      'aria-labelledby': `${columnHeaderId} ${id}`,
      style: hasPlaceholder ? EVENT_STYLE_WHILE_DRAGGING : undefined,
    }),
    [hasPlaceholder, columnHeaderId, id],
  );

  const doesEventStartBeforeRowStart = React.useMemo(
    () => adapter.isBefore(start, rowStart),
    [adapter, start, rowStart],
  );

  const doesEventEndAfterRowEnd = React.useMemo(
    () => adapter.isAfter(end, rowEnd),
    [adapter, end, rowEnd],
  );

  const contextValue: CalendarGridDayEventContext = React.useMemo(
    () => ({
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeRowStart,
      doesEventEndAfterRowEnd,
    }),
    [setIsResizing, getSharedDragData, doesEventStartBeforeRowStart, doesEventEndAfterRowEnd],
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
        source: 'CalendarGridDayEvent',
        draggedDay: getDraggedDay(input),
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
  }, [isDraggable, getDraggedDay, getSharedDragData, store, preview.actions]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <CalendarGridDayEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </CalendarGridDayEventContext.Provider>
  );
});

export namespace CalendarGridDayEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      Omit<useDraggableEvent.Parameters, 'ref' | 'getDragData'> {}

  export interface SharedDragData {
    eventId: CalendarEventId;
    occurrenceKey: string;
    event: CalendarEvent;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridDayEvent';
    draggedDay: SchedulerValidDate;
  }
}
