'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarOccurrencePlaceholder, SchedulerValidDate } from '../../models';
import {
  addRoundedOffsetToDate,
  EVENT_DRAG_PRECISION_MINUTE,
  isDraggingTimeGridEvent,
  isDraggingTimeGridEventResizeHandler,
} from '../../utils/drag-utils';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';

export function useTimeGridColumnDropTarget(parameters: useTimeGridColumnDropTarget.Parameters) {
  const { start, end } = parameters;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);
  const store = useEventCalendarStoreContext();

  // TODO: Avoid JS date conversion
  const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();
  const collectionStartTimestamp = getTimestamp(start);
  const collectionEndTimestamp = getTimestamp(end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: TimeGridColumnContext['getCursorPositionInElementMs'] =
    useEventCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientY = input.clientY;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionY = (clientY - elementPosition.y) / ref.current.offsetHeight;

      return Math.round(collectionDurationMs * positionY);
    });

  const getEventDropData = useEventCallback(
    (
      data: Record<string, unknown>,
      input: { clientY: number },
    ): CalendarOccurrencePlaceholder | undefined => {
      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      // Move event
      if (isDraggingTimeGridEvent(data)) {
        // TODO: Avoid JS Date conversion
        const eventDurationMinute =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const newStartDate = addRoundedOffsetToDate({
          adapter,
          date: start,
          offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs,
        });

        const newEndDate = adapter.addMinutes(newStartDate, eventDurationMinute);

        return {
          start: newStartDate,
          end: newEndDate,
          eventId: data.eventId,
          occurrenceKey: data.occurrenceKey,
          surfaceType: 'time-grid',
          originalStart: data.start,
        };
      }

      // Resize event
      if (isDraggingTimeGridEventResizeHandler(data)) {
        if (data.side === 'start') {
          const cursorDate = addRoundedOffsetToDate({
            adapter,
            date: start,
            offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs,
          });

          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return {
            start: newStartDate,
            end: data.end,
            eventId: data.eventId,
            occurrenceKey: data.occurrenceKey,
            surfaceType: 'time-grid',
            originalStart: data.start,
          };
        }

        // TODO: Avoid JS Date conversion
        const eventDurationMs =
          adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime();

        const cursorDate = addRoundedOffsetToDate({
          adapter,
          date: start,
          offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs + eventDurationMs,
        });

        // Ensure the new end date is not before or too close to the start date.
        const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
        const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

        return {
          start: data.start,
          end: newEndDate,
          eventId: data.eventId,
          occurrenceKey: data.occurrenceKey,
          surfaceType: 'time-grid',
          originalStart: data.start,
        };
      }

      return undefined;
    },
  );

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) =>
        isDraggingTimeGridEvent(arg.source.data) ||
        isDraggingTimeGridEventResizeHandler(arg.source.data),
      onDrag: ({ source: { data }, location }) => {
        const newPlaceholder = getEventDropData(data, location.current.input);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingTimeGridEvent(data) || isDraggingTimeGridEventResizeHandler(data)) {
          store.setOccurrencePlaceholder({
            eventId: data.eventId,
            occurrenceKey: data.occurrenceKey,
            surfaceType: 'time-grid',
            start: data.start,
            end: data.end,
            originalStart: data.start,
          });
        }
      },
      onDrop: ({ source: { data }, location }) => {
        const newEvent =
          getEventDropData(data, location.current.input) ??
          selectors.occurrencePlaceholder(store.state);
        if (newEvent) {
          store.applyOccurrencePlaceholder(newEvent);
        }
      },
    });
  }, [adapter, getEventDropData, store]);

  return { getCursorPositionInElementMs, ref };
}

export namespace useTimeGridColumnDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the column starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the column ends.
     */
    end: SchedulerValidDate;
  }

  export interface ReturnValue
    extends Pick<TimeGridColumnContext, 'getCursorPositionInElementMs'> {}
}
