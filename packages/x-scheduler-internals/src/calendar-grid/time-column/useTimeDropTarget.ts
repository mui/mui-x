'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { SchedulerEvent } from '../../models';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import type { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useDropTarget } from '../../internals/utils/useDropTarget';
import { clampResizedEventEdge } from '../../internals/utils/resize-utils';
import { EVENT_DRAG_PRECISION_MINUTE } from '../../constants';
import { roundToDragPrecision } from '../../internals/utils/drag-utils';
import {
  getTimelineAxisDurationMs,
  resolveRepeatedTimeFrom,
  timelineAxisOffsetToTimestamp,
} from '../../internals/utils/timeline-axis';
import type { TimelineAxis } from '../../internals/utils/timeline-axis';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'CalendarGridDayEvent',
  'StandaloneEvent',
]);

export function useTimeDropTarget(parameters: useTimeDropTarget.Parameters) {
  const { axis, addPropertiesToDroppedEvent } = parameters;
  const { start: startMs, end: endMs } = axis;

  // Context hooks
  const store = useEventCalendarStoreContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  const axisDurationMs = React.useMemo(() => getTimelineAxisDurationMs(axis), [axis]);

  const getCursorPositionInElementMs: CalendarGridTimeColumnContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef, elementStart }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      // The column renders a wall-clock axis, which keeps every hour on DST days. Reading the
      // dates under the element top and under the cursor on that axis keeps the offset in sync
      // with the rendered grid. The offset is the time elapsed between them.
      const column = ref.current;
      const columnTop = column.getBoundingClientRect().y;
      const getTimestampAtClientY = (clientY: number) => {
        const positionY = Math.max(0, Math.min(1, (clientY - columnTop) / column.offsetHeight));
        // The axis maps its full duration to the next day's window start.
        if (positionY === 1) {
          return endMs;
        }
        return timelineAxisOffsetToTimestamp(axis, Math.round(axisDurationMs * positionY));
      };
      const elementTop = Math.max(elementRef.current.getBoundingClientRect().y, columnTop);
      const cursorY = Math.max(input.clientY, elementTop);

      let cursorTimestamp = getTimestampAtClientY(cursorY);
      let topTimestamp = getTimestampAtClientY(elementTop);
      // On a fall-back day, the axis reads the top of an element starting in the second occurrence
      // of the repeated hour, and the cursor inside that hour, as their first occurrence.
      if (elementStart != null) {
        const timezone = schedulerOtherSelectors.displayTimezone(store.state);
        const startTimestamp = Math.max(elementStart, startMs);
        cursorTimestamp = resolveRepeatedTimeFrom(cursorTimestamp, startTimestamp, timezone);
        topTimestamp = resolveRepeatedTimeFrom(topTimestamp, startTimestamp, timezone);
      }
      return cursorTimestamp - topTimestamp;
    });

  const getTimestampAtPointer: CalendarGridTimeColumnContext['getTimestampAtPointer'] =
    useStableCallback((input) => {
      // Bail when the column isn't measurable yet — zero height makes `getCursorPositionInElementMs` return NaN.
      if (!ref.current || ref.current.offsetHeight === 0) {
        return null;
      }
      const offsetMs = getCursorPositionInElementMs({ input, elementRef: ref });
      return startMs + roundToDragPrecision(offsetMs);
    });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input, timezone }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });
      const offsetToTimestamp = (offsetMs: number) => startMs + roundToDragPrecision(offsetMs);

      // Move a Time Grid Event within the Time Grid
      if (data.source === 'CalendarGridTimeEvent') {
        const eventDurationMs = data.end - data.start;

        let newStart = offsetToTimestamp(cursorOffsetMs - data.initialCursorPositionInEventMs);

        // Clamp the event to stay within the time grid bounds, unless it already crosses midnight
        if (toLocalDayNumber(data.start, timezone) === toLocalDayNumber(data.end, timezone)) {
          newStart = Math.min(Math.max(newStart, startMs), endMs - eventDurationMs);
        }

        return getDataFromInside(data, newStart, newStart + eventDurationMs);
      }

      // Resize a Time Grid Event
      if (data.source === 'CalendarGridTimeEventResizeHandler') {
        if (data.side === 'start') {
          // Clamped to the time grid bounds.
          const cursorTimestamp = Math.max(
            offsetToTimestamp(cursorOffsetMs - data.initialCursorPositionInEventMs),
            startMs,
          );

          // Ensure the new start date is not after or too close to the end date.
          const { start: newStart } = clampResizedEventEdge({
            side: 'start',
            start: data.start,
            end: data.end,
            cursorTimestamp,
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          const eventDurationMs = data.end - data.start;

          // Clamped to the time grid bounds.
          const cursorTimestamp = Math.min(
            offsetToTimestamp(
              cursorOffsetMs - data.initialCursorPositionInEventMs + eventDurationMs,
            ),
            endMs,
          );

          // Ensure the new end date is not before or too close to the start date.
          const { end: newEnd } = clampResizedEventEdge({
            side: 'end',
            start: data.start,
            end: data.end,
            cursorTimestamp,
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

          return getDataFromInside(data, data.start, newEnd);
        }
      }

      // Move a Day Grid Event into the Time Grid
      if (data.source === 'CalendarGridDayEvent') {
        const newStart = offsetToTimestamp(cursorOffsetMs);
        const newEnd =
          newStart + schedulerEventSelectors.defaultEventDuration(store.state) * 60_000;

        return getDataFromInside(data, newStart, newEnd);
      }

      // Move a Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, offsetToTimestamp(cursorOffsetMs));
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

  return { getCursorPositionInElementMs, getTimestampAtPointer, ref };
}

export namespace useTimeDropTarget {
  export interface Parameters {
    /**
     * The axis of the column: its bounds, read in the display timezone, and the hour window of the
     * view.
     */
    axis: TimelineAxis;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue extends Pick<
    CalendarGridTimeColumnContext,
    'getCursorPositionInElementMs' | 'getTimestampAtPointer'
  > {}
}
