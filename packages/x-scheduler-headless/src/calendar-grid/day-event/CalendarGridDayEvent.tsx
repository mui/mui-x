'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store/useStore';
import { useId } from '@base-ui/utils/useId';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { SchedulerEventId, SchedulerEventOccurrence, TemporalSupportedObject } from '../../models';
import { useAdapter } from '../../use-adapter';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../../scheduler-selectors';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { CalendarGridDayEventContext } from './CalendarGridDayEventContext';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayCellContext } from '../day-cell/CalendarGridDayCellContext';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { generateOccurrenceFromEvent } from '../../internals/utils/event-utils';

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
  const hasPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.isDefined);

  // State hooks
  const id = useId(idProp);

  // Feature hooks
  const getDraggedDay = useStableCallback((input: { clientX: number }) => {
    if (!ref.current) {
      return start.value;
    }

    const eventStartInRow = adapter.isBefore(start.value, rowStart) ? rowStart : start.value;
    const eventEndInRow = adapter.isAfter(end.value, rowEnd) ? rowEnd : end.value;
    const eventDayLengthInRow = adapter.differenceInDays(eventEndInRow, eventStartInRow) + 1;
    const clientX = input.clientX;
    const elementPosition = ref.current.getBoundingClientRect();
    const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

    return adapter.startOfDay(
      adapter.addDays(eventStartInRow, Math.ceil(positionX * eventDayLengthInRow) - 1),
    );
  });

  const firstEventOfSeries = schedulerEventSelectors.processedEvent(store.state, eventId)!;

  const originalOccurrence = generateOccurrenceFromEvent({
    event: firstEventOfSeries,
    eventId,
    occurrenceKey,
    start,
    end,
  });

  const getSharedDragData: CalendarGridDayEventContext['getSharedDragData'] = useStableCallback(
    () => ({
      eventId,
      occurrenceKey,
      originalOccurrence,
      start: start.value,
      end: end.value,
    }),
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'CalendarGridDayEvent',
    draggedDay: getDraggedDay(input),
  }));

  const {
    state,
    preview,
    contextValue: draggableEventContextValue,
  } = useDraggableEvent({
    ref,
    start,
    end,
    occurrenceKey,
    eventId,
    isDraggable,
    renderDragPreview,
    getDragData,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  // Rendering hooks

  const columnHeaderId = getCalendarGridHeaderCellId(rootId, cellIndex);

  const props = {
    id,
    'aria-labelledby': `${columnHeaderId} ${id}`,
    style: hasPlaceholder ? { pointerEvents: 'none' as const } : undefined,
  };

  const contextValue: CalendarGridDayEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

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
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters {}

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridDayEvent';
    draggedDay: TemporalSupportedObject;
  }
}
