'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useAdapter } from '../../use-adapter/useAdapter';
import { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useDropTarget } from '../../internals/utils/useDropTarget';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'CalendarGridDayEvent',
  'StandaloneEvent',
]);

export function useTimeDropTarget(parameters: useTimeDropTarget.Parameters) {
  const { start, end, addPropertiesToDroppedEvent } = parameters;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  const collectionStartTimestamp = adapter.getTime(start);
  const collectionEndTimestamp = adapter.getTime(end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: CalendarGridTimeColumnContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientY = input.clientY;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionY = (clientY - elementPosition.y) / ref.current.offsetHeight;
      const clampedPositionY = Math.max(0, Math.min(1, positionY));

      return Math.round(collectionDurationMs * clampedPositionY);
    });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const addOffsetToDate = (date: TemporalSupportedObject, offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        return adapter.addMilliseconds(date, roundedOffset);
      };

      // Move a Time Grid Event within the Time Grid
      if (data.source === 'CalendarGridTimeEvent') {
        const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

        let newStartDate = addOffsetToDate(
          start,
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );

        // Clamp the event to stay within the time grid bounds
        if (adapter.isBefore(newStartDate, start)) {
          newStartDate = start;
        }
        const maxStartDate = adapter.addMilliseconds(end, -eventDurationMs);
        if (adapter.isAfter(newStartDate, maxStartDate)) {
          newStartDate = maxStartDate;
        }

        const newEndDate = adapter.addMilliseconds(newStartDate, eventDurationMs);

        return getDataFromInside(data, newStartDate, newEndDate);
      }

      // Resize a Time Grid Event
      if (data.source === 'CalendarGridTimeEventResizeHandler') {
        if (data.side === 'start') {
          let cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs,
          );

          // Clamp to the time grid bounds
          if (adapter.isBefore(cursorDate, start)) {
            cursorDate = start;
          }

          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return getDataFromInside(data, newStartDate, data.end);
        }

        if (data.side === 'end') {
          const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

          let cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs + eventDurationMs,
          );

          // Clamp to the time grid bounds
          if (adapter.isAfter(cursorDate, end)) {
            cursorDate = end;
          }

          // Ensure the new end date is not before or too close to the start date.
          const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
          const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

          return getDataFromInside(data, data.start, newEndDate);
        }
      }

      // Move a Day Grid Event into the Time Grid
      if (data.source === 'CalendarGridDayEvent') {
        const newStartDate = addOffsetToDate(start, cursorOffsetMs);
        const newEndDate = adapter.addMinutes(
          newStartDate,
          schedulerEventSelectors.defaultEventDuration(store.state),
        );

        return getDataFromInside(data, newStartDate, newEndDate);
      }

      // Move a Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, addOffsetToDate(start, cursorOffsetMs));
      }

      return undefined;
    },
  );

  useDropTarget({
    ref,
    surfaceType: 'time-grid',
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return { getCursorPositionInElementMs, ref };
}

export namespace useTimeDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the column starts.
     */
    start: TemporalSupportedObject;
    /**
     * The data and time at which the column ends.
     */
    end: TemporalSupportedObject;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue extends Pick<
    CalendarGridTimeColumnContext,
    'getCursorPositionInElementMs'
  > {}
}
