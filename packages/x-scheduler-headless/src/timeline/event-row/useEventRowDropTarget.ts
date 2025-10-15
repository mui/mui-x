'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useAdapter } from '../../use-adapter/useAdapter';
import { CalendarEvent, SchedulerValidDate } from '../../models';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { TimelineEventRowContext } from './TimelineEventRowContext';
import { useDropTarget } from '../../utils/useDropTarget';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';

const isValidDropTarget = buildIsValidDropTarget(['TimelineEvent', 'TimelineEventResizeHandler']);

export function useEventRowDropTarget(parameters: useEventRowDropTarget.Parameters) {
  const { start, end, addPropertiesToDroppedEvent } = parameters;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);

  // TODO: Avoid JS date conversion
  const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();
  const collectionStartTimestamp = getTimestamp(start);
  const collectionEndTimestamp = getTimestamp(end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: TimelineEventRowContext['getCursorPositionInElementMs'] =
    useEventCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientX = input.clientX;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

      return Math.round(collectionDurationMs * positionX);
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

      // Move a Timeline Event within the Timeline
      if (data.source === 'TimelineEvent') {
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

      // Resize a Timeline Event
      if (data.source === 'TimelineEventResizeHandler') {
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

      return undefined;
    },
  );

  useDropTarget({
    ref,
    surfaceType: 'timeline',
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return { getCursorPositionInElementMs, ref };
}

export namespace useEventRowDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the row starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the row ends.
     */
    end: SchedulerValidDate;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>;
  }

  export interface ReturnValue
    extends Pick<TimelineEventRowContext, 'getCursorPositionInElementMs'> {}
}
