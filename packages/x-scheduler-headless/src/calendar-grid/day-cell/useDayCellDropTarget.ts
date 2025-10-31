'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { useAdapter, diffIn } from '../../use-adapter';
import { SchedulerEvent, SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';
import { useDropTarget } from '../../utils/useDropTarget';
import { EVENT_CREATION_DEFAULT_LENGTH_MINUTE } from '../../constants';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridDayEvent',
  'CalendarGridDayEventResizeHandler',
  'CalendarGridTimeEvent',
  'StandaloneEvent',
]);

export function useDayCellDropTarget(parameters: useDayCellDropTarget.Parameters) {
  const { value, addPropertiesToDroppedEvent } = parameters;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData: useDropTarget.GetEventDropData = useEventCallback(
    ({ data, createDropData }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      // Move a Day Grid Event within the Day Grid
      if (data.source === 'CalendarGridDayEvent') {
        const offset = diffIn(adapter, value, data.draggedDay, 'days');
        return createDropData(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        if (data.side === 'start') {
          if (adapter.isAfterDay(value, data.end)) {
            return undefined;
          }

          let newStart: SchedulerValidDate;
          if (adapter.isSameDay(value, data.end)) {
            newStart = adapter.startOfDay(data.end);
          } else {
            newStart = mergeDateAndTime(adapter, value, data.start);
          }
          return createDropData(data, newStart, data.end);
        }

        if (data.side === 'end') {
          if (adapter.isBeforeDay(value, data.start)) {
            return undefined;
          }

          let draggedDay: SchedulerValidDate;
          if (adapter.isSameDay(value, data.start)) {
            draggedDay = adapter.endOfDay(data.start);
          } else {
            draggedDay = mergeDateAndTime(adapter, value, data.end);
          }

          return createDropData(data, data.start, draggedDay);
        }
      }

      // Move a Time Grid Event into the Day Grid
      if (data.source === 'CalendarGridTimeEvent') {
        // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
        const cursorDate = adapter.addSeconds(
          data.start,
          data.initialCursorPositionInEventMs / 1000,
        );
        const offset = diffIn(adapter, value, cursorDate, 'days');
        return createDropData(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Move an Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        // TODO: Improve the start and end time of a non all-day event dropped in the Month View.
        return createDropData(
          data,
          value,
          adapter.addMinutes(
            value,
            data.eventData.duration ?? EVENT_CREATION_DEFAULT_LENGTH_MINUTE,
          ),
        );
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
    value: SchedulerValidDate;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
