'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { useAdapter } from '../../use-adapter';
import { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { mergeDateAndTime } from '../../internals/utils/date-utils';
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
  const adapter = useAdapter();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      // Move a Day Grid Event within the Day Grid
      if (data.source === 'CalendarGridDayEvent') {
        const offset = adapter.differenceInDays(value, data.draggedDay);
        return getDataFromInside(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'CalendarGridDayEventResizeHandler') {
        if (data.side === 'start') {
          if (adapter.isAfter(value, adapter.endOfDay(data.end))) {
            return undefined;
          }

          let newStart: TemporalSupportedObject;
          if (adapter.isSameDay(value, data.end)) {
            newStart = adapter.startOfDay(data.end);
          } else {
            newStart = mergeDateAndTime(adapter, value, data.start);
          }
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          if (adapter.isBefore(value, adapter.startOfDay(data.start))) {
            return undefined;
          }

          let draggedDay: TemporalSupportedObject;
          if (adapter.isSameDay(value, data.start)) {
            draggedDay = adapter.endOfDay(data.start);
          } else {
            draggedDay = mergeDateAndTime(adapter, value, data.end);
          }

          return getDataFromInside(data, data.start, draggedDay);
        }
      }

      // Move a Time Grid Event into the Day Grid
      if (data.source === 'CalendarGridTimeEvent') {
        const cursorDate = adapter.startOfDay(
          adapter.addMilliseconds(data.start, data.initialCursorPositionInEventMs),
        );
        const offset = adapter.differenceInDays(value, cursorDate);
        return getDataFromInside(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
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
