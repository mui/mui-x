'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarOccurrencePlaceholder, SchedulerValidDate } from '../../models';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  buildIsValidDropTarget,
  EVENT_DRAG_PRECISION_MS,
} from '../../utils/drag-utils';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';

const isValidDropTarget = buildIsValidDropTarget([
  'TimeGridEvent',
  'TimeGridEventResizeHandler',
  'DayGridEvent',
]);

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
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const createDropData = (
        newStart: SchedulerValidDate,
        newEnd: SchedulerValidDate,
      ): CalendarOccurrencePlaceholder => ({
        start: newStart,
        end: newEnd,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        surfaceType: 'time-grid',
        originalStart: data.start,
      });

      const addOffsetToDate = (date: SchedulerValidDate, offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
        return adapter.addSeconds(date, roundedOffset / 1000);
      };

      // Move a Time Grid Event within the Time Grid
      if (data.source === 'TimeGridEvent') {
        // TODO: Avoid JS Date conversion
        const eventDurationMinute =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const newStartDate = addOffsetToDate(
          start,
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );

        const newEndDate = adapter.addMinutes(newStartDate, eventDurationMinute);

        return createDropData(newStartDate, newEndDate);
      }

      // Resize a Time Grid Event
      if (data.source === 'TimeGridEventResizeHandler') {
        if (data.side === 'start') {
          const cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs,
          );

          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return createDropData(newStartDate, data.end);
        }

        if (data.side === 'end') {
          // TODO: Avoid JS Date conversion
          const eventDurationMs =
            adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime();

          const cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs + eventDurationMs,
          );

          // Ensure the new end date is not before or too close to the start date.
          const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
          const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

          return createDropData(data.start, newEndDate);
        }
      }

      // Move a Day Grid Event into the Time Grid
      if (data.source === 'DayGridEvent') {
        const newStartDate = addOffsetToDate(start, cursorOffsetMs);
        const newEndDate = adapter.addMinutes(newStartDate, 60);

        return createDropData(newStartDate, newEndDate);
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
      canDrop: (arg) => isValidDropTarget(arg.source.data),
      onDrag: ({ source: { data }, location }) => {
        const newPlaceholder = getEventDropData(data, location.current.input);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isValidDropTarget(data)) {
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
