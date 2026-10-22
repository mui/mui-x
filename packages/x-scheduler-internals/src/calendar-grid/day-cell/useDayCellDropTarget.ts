'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { MS_PER_DAY } from '../../internals/utils/base-temporal/iso';
import {
  addDaysOnWallClock,
  createEndOfDay,
  createStartOfDay,
  getAdapterDayNumber,
} from '../../internals/utils/drag-utils';
import { toLocalMs } from '../../internals/utils/plain-date-utils/timeZone';
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

      // Days are compared and moved with day numbers in the display timezone of the cell.
      const valueDay = getAdapterDayNumber(adapter, value);
      const timezone = adapter.getTimezone(value);

      // Move a Day Grid Event within the Day Grid
      if (data.source === 'CalendarGridDayEvent') {
        const offset = valueDay - getAdapterDayNumber(adapter, data.draggedDay);
        return getDataFromInside(
          data,
          addDaysOnWallClock(adapter, data.start, offset),
          addDaysOnWallClock(adapter, data.end, offset),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        if (data.side === 'start') {
          const endDay = getAdapterDayNumber(adapter, data.end);
          if (valueDay > endDay) {
            return undefined;
          }

          // The new start keeps its time of day, unless it moves to the day of the end.
          const newStart =
            valueDay === endDay
              ? createStartOfDay(adapter, endDay, timezone)
              : addDaysOnWallClock(
                  adapter,
                  data.start,
                  valueDay - getAdapterDayNumber(adapter, data.start),
                );
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          const startDay = getAdapterDayNumber(adapter, data.start);
          if (valueDay < startDay) {
            return undefined;
          }

          // The new end keeps its time of day, unless it moves to the day of the start.
          const newEnd =
            valueDay === startDay
              ? createEndOfDay(adapter, startDay, timezone)
              : addDaysOnWallClock(
                  adapter,
                  data.end,
                  valueDay - getAdapterDayNumber(adapter, data.end),
                );

          return getDataFromInside(data, data.start, newEnd);
        }
      }

      // Move a Time Grid Event into the Day Grid
      if (data.source === 'CalendarGridTimeEvent') {
        // The day under the grab point.
        const cursorDay = Math.floor(
          toLocalMs(
            adapter.getTime(data.start) + data.initialCursorPositionInEventMs,
            adapter.getTimezone(data.start),
          ) / MS_PER_DAY,
        );
        const offset = valueDay - cursorDay;
        return getDataFromInside(
          data,
          addDaysOnWallClock(adapter, data.start, offset),
          addDaysOnWallClock(adapter, data.end, offset),
        );
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
