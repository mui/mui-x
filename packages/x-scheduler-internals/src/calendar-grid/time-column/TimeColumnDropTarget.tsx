'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { useCalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useDropTarget } from '../../internals/utils/useDropTarget';
import { clampResizedEventEdge } from '../../internals/utils/resize-utils';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridTimeEventResizeHandler',
  'CalendarGridDayEvent',
  'StandaloneEvent',
]);

export function TimeColumnDropTarget(props: TimeColumnDropTarget.Props) {
  const { addPropertiesToDroppedEvent, render } = props;
  const { start, end, getCursorPositionInElementMs } = useCalendarGridTimeColumnContext();

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

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
          const { start: newStartDate } = clampResizedEventEdge({
            adapter,
            side: 'start',
            start: data.start,
            end: data.end,
            cursorDate,
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

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
          const { end: newEndDate } = clampResizedEventEdge({
            adapter,
            side: 'end',
            start: data.start,
            end: data.end,
            cursorDate,
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

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

  const targetProps = useDropTarget({
    surfaceType: 'time-grid',
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return <Draggable.Target {...targetProps} ref={ref} render={render} />;
}

export namespace TimeColumnDropTarget {
  export interface Props {
    render: React.ReactElement;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
