'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import type { SchedulerEvent } from '../../models';
import type { BaseTemporal } from '../../internals/utils/base-temporal';
import { getDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import { getLastInstant } from '../../internals/utils/event-utils';
import {
  addDaysOnWallClock,
  getEndOfDayMs,
  moveTimestampToPlainDate,
  toEpochMs,
  toLocalDayNumber,
} from '../../internals/utils/plain-date-utils/timeZone';
import { useDropTarget } from '../../internals/utils/useDropTarget';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridDayEvent',
  'CalendarGridDayEventResizeHandler',
  'CalendarGridTimeEvent',
  'StandaloneEvent',
]);

export function useDayCellDropTarget(parameters: useDayCellDropTarget.Parameters) {
  const { value, addPropertiesToDroppedEvent } = parameters;

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, timezone }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      // The first instant of the day of the cell in the display timezone.
      const dayStart = toEpochMs(value, timezone);

      // Move an Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, dayStart);
      }

      // Days are compared as plain dates, and each date moves on the wall clock of the display
      // timezone.
      // Move a Day Grid Event within the Day Grid
      if (data.source === 'CalendarGridDayEvent') {
        // The day under the grab point.
        const dayCount = getDayNumber(value) - getDayNumber(data.draggedDay);
        return getDataFromInside(
          data,
          addDaysOnWallClock(data.start, dayCount, timezone),
          addDaysOnWallClock(data.end, dayCount, timezone),
        );
      }

      // Move a Time Grid Event into the Day Grid: it covers the day of the cell.
      if (data.source === 'CalendarGridTimeEvent') {
        return getDataFromInside(data, dayStart, toEpochMs(value.add({ days: 1 }), timezone));
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        const { allDay } = data.originalOccurrence;
        if (data.side === 'start') {
          const order =
            getDayNumber(value) - toLocalDayNumber(getLastInstant(data.end, allDay), timezone);
          if (order > 0) {
            return undefined;
          }

          // An all-day occurrence starts on the day; a timed one keeps its time of day, unless
          // it moves to the day of the end.
          let newStart = dayStart;
          if (!allDay && order !== 0) {
            newStart = moveTimestampToPlainDate(data.start, value, timezone);
          }
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          const order = getDayNumber(value) - toLocalDayNumber(data.start, timezone);
          if (order < 0) {
            return undefined;
          }

          // An all-day occurrence ends at the start of the day after; a timed one keeps its time
          // of day, unless it moves to the day of the start.
          let newEnd: number;
          if (allDay) {
            newEnd = toEpochMs(value.add({ days: 1 }), timezone);
          } else if (order === 0) {
            newEnd = getEndOfDayMs(dayStart, timezone);
          } else {
            newEnd = moveTimestampToPlainDate(data.end, value, timezone);
          }
          return getDataFromInside(data, data.start, newEnd);
        }
      }

      return undefined;
    },
  );

  useDropTarget({
    surfaceType: 'day-grid',
    ref,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return ref;
}

export namespace useDayCellDropTarget {
  export interface Parameters {
    /**
     * The day of the cell, read in the display timezone.
     */
    value: BaseTemporal.PlainDate;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
