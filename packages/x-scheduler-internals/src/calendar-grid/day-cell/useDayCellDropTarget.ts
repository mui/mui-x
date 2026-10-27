'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import type { SchedulerEvent } from '../../models';
import type { PlainDate } from '../../internals/utils/base-temporal/PlainDate';
import {
  addDaysOnWallClock,
  getEndOfDayMs,
  moveTimestampToPlainDate,
  toEpochMs,
  toLocalDayNumber,
  toPlainDate,
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
      const dayStart = toEpochMs(value, 0, timezone);

      // Move an Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, dayStart);
      }

      // Days are compared as plain dates, and each date moves on the wall clock of the display
      // timezone.
      // Move a Day Grid Event within the Day Grid, or a Time Grid Event into it
      if (data.source === 'CalendarGridDayEvent' || data.source === 'CalendarGridTimeEvent') {
        // The day under the grab point.
        const grabbedPlainDate =
          data.source === 'CalendarGridDayEvent'
            ? data.draggedDay
            : toPlainDate(data.start + data.initialCursorPositionInEventMs, timezone);
        const dayCount = value.dayNumber - grabbedPlainDate.dayNumber;
        return getDataFromInside(
          data,
          addDaysOnWallClock(data.start, dayCount, timezone),
          addDaysOnWallClock(data.end, dayCount, timezone),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        if (data.side === 'start') {
          const order = value.dayNumber - toLocalDayNumber(data.end, timezone);
          if (order > 0) {
            return undefined;
          }

          // The new start keeps its time of day, unless it moves to the day of the end.
          const newStart =
            order === 0 ? dayStart : moveTimestampToPlainDate(data.start, value, timezone);
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          const order = value.dayNumber - toLocalDayNumber(data.start, timezone);
          if (order < 0) {
            return undefined;
          }

          // The new end keeps its time of day, unless it moves to the day of the start.
          const newEnd =
            order === 0
              ? getEndOfDayMs(dayStart, timezone)
              : moveTimestampToPlainDate(data.end, value, timezone);

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
    value: PlainDate;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
