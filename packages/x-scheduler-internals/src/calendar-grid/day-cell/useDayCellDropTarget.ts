'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { addDaysOnWallClock, moveToPlainDate } from '../../internals/utils/drag-utils';
import {
  buildTemporalPlainDate,
  createAdapterDate,
} from '../../internals/utils/plain-date-utils/adapter';
import {
  getEndOfDayMs,
  getStartOfDayMs,
  toPlainDateTime,
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

  // Context hooks
  const adapter = useAdapterContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      // Days are compared and moved with the plain dates of the display timezone of the cell.
      const valuePlainDate = buildTemporalPlainDate(adapter, value);
      const timezone = adapter.getTimezone(value);

      // Move a Day Grid Event within the Day Grid, or a Time Grid Event into it
      if (data.source === 'CalendarGridDayEvent' || data.source === 'CalendarGridTimeEvent') {
        // The day under the grab point.
        const grabbedPlainDate =
          data.source === 'CalendarGridDayEvent'
            ? data.draggedDay
            : toPlainDateTime(
                adapter.getTime(data.start) + data.initialCursorPositionInEventMs,
                adapter.getTimezone(data.start),
              ).date;
        const dayCount = valuePlainDate.dayNumber - grabbedPlainDate.dayNumber;
        return getDataFromInside(
          data,
          addDaysOnWallClock(adapter, data.start, dayCount),
          addDaysOnWallClock(adapter, data.end, dayCount),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        if (data.side === 'start') {
          const endPlainDate = buildTemporalPlainDate(adapter, data.end);
          if (valuePlainDate.dayNumber > endPlainDate.dayNumber) {
            return undefined;
          }

          // The new start keeps its time of day, unless it moves to the day of the end.
          const newStart = valuePlainDate.equals(endPlainDate)
            ? createAdapterDate(
                adapter,
                getStartOfDayMs(adapter.getTime(value), timezone),
                timezone,
              )
            : moveToPlainDate(adapter, data.start, valuePlainDate);
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          const startPlainDate = buildTemporalPlainDate(adapter, data.start);
          if (valuePlainDate.dayNumber < startPlainDate.dayNumber) {
            return undefined;
          }

          // The new end keeps its time of day, unless it moves to the day of the start.
          const newEnd = valuePlainDate.equals(startPlainDate)
            ? createAdapterDate(adapter, getEndOfDayMs(adapter.getTime(value), timezone), timezone)
            : moveToPlainDate(adapter, data.end, valuePlainDate);

          return getDataFromInside(data, data.start, newEnd);
        }
      }

      // Move an Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, value);
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
     * The value of the cell.
     */
    value: TemporalSupportedObject;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
