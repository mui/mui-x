'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useAdapter } from '../../use-adapter/useAdapter';
import { SchedulerValidDate } from '../../models';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  buildIsValidDropTarget,
  EVENT_DRAG_PRECISION_MS,
} from '../../build-is-valid-drop-target';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useDropTarget } from '../../utils/useDropTarget';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'CalendarGridDayEvent',
  'StandaloneEvent',
]);

export function useTimeDropTarget(parameters: useTimeDropTarget.Parameters) {
  const { start, end } = parameters;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);

  // TODO: Avoid JS date conversion
  const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();
  const collectionStartTimestamp = getTimestamp(start);
  const collectionEndTimestamp = getTimestamp(end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: CalendarGridTimeColumnContext['getCursorPositionInElementMs'] =
    useEventCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientY = input.clientY;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionY = (clientY - elementPosition.y) / ref.current.offsetHeight;

      return Math.round(collectionDurationMs * positionY);
    });

  const getEventDropData: useDropTarget.GetEventDropData = useEventCallback(
    ({ data, createDropData, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const addOffsetToDate = (date: SchedulerValidDate, offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
        return adapter.addSeconds(date, roundedOffset / 1000);
      };

      // Move a Time Grid Event within the Time Grid
      if (data.source === 'CalendarGridTimeEvent') {
        // TODO: Avoid JS Date conversion
        const eventDurationMinute =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const newStartDate = addOffsetToDate(
          start,
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );

        const newEndDate = adapter.addMinutes(newStartDate, eventDurationMinute);

        return createDropData(data, newStartDate, newEndDate);
      }

      // Resize a Time Grid Event
      if (data.source === 'CalendarGridTimeEventResizeHandler') {
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

          return createDropData(data, newStartDate, data.end);
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

          return createDropData(data, data.start, newEndDate);
        }
      }

      // Move a Day Grid Event into the Time Grid
      if (data.source === 'CalendarGridDayEvent') {
        const newStartDate = addOffsetToDate(start, cursorOffsetMs);
        const newEndDate = adapter.addMinutes(newStartDate, 60);

        return createDropData(data, newStartDate, newEndDate);
      }

      // Move an Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        const cursorDate = addOffsetToDate(start, cursorOffsetMs);

        return createDropData(data, cursorDate, adapter.addMinutes(cursorDate, 60));
      }

      return undefined;
    },
  );

  useDropTarget({
    ref,
    surfaceType: 'time-grid',
    getEventDropData,
    isValidDropTarget,
  });

  return { getCursorPositionInElementMs, ref };
}

export namespace useTimeDropTarget {
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
    extends Pick<CalendarGridTimeColumnContext, 'getCursorPositionInElementMs'> {}
}
