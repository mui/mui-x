'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { buildIsValidDropTarget } from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarOccurrencePlaceholder, SchedulerValidDate } from '../../models';
import { diffIn, mergeDateAndTime } from '../../utils/date-utils';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar/EventCalendarStore.selectors';

const isValidDropTarget = buildIsValidDropTarget([
  'DayGridEvent',
  'DayGridEventResizeHandler',
  'TimeGridEvent',
]);

export function useDayGridCellDropTarget(parameters: useDayGridCellDropTarget.Parameters) {
  const { value } = parameters;

  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData = useEventCallback(
    (data: any): CalendarOccurrencePlaceholder | undefined => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const createDropData = (
        newStart: SchedulerValidDate,
        newEnd: SchedulerValidDate,
      ): CalendarOccurrencePlaceholder => ({
        start: newStart,
        end: newEnd,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        surfaceType: 'day-grid',
        originalStart: data.start,
      });

      // Move a Day Grid Event within the Day Grid
      if (data.source === 'DayGridEvent') {
        const offset = diffIn(adapter, value, data.draggedDay, 'days');
        return createDropData(
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Resize a Day Grid Event
      if (data.source === 'DayGridEventResizeHandler') {
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
          return createDropData(newStart, data.end);
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

          return createDropData(data.start, draggedDay);
        }
      }

      // Move a Time Grid Event into the Day Grid
      if (data.source === 'TimeGridEvent') {
        // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
        const cursorDate = adapter.addSeconds(
          data.start,
          data.initialCursorPositionInEventMs / 1000,
        );
        const offset = diffIn(adapter, value, cursorDate, 'days');
        return createDropData(
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      return undefined;
    },
  );

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) => isValidDropTarget(arg.source.data),
      onDrag: ({ source: { data } }) => {
        const newPlaceholder = getEventDropData(data);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isValidDropTarget(data)) {
          store.setOccurrencePlaceholder({
            occurrenceKey: data.occurrenceKey,
            eventId: data.eventId,
            start: data.start,
            end: data.end,
            originalStart: data.start,
            surfaceType: 'day-grid',
          });
        }
      },
      onDrop: ({ source: { data } }) => {
        const newEvent = getEventDropData(data) ?? selectors.occurrencePlaceholder(store.state);
        if (newEvent) {
          store.applyOccurrencePlaceholder(newEvent);
        }
      },
    });
  }, [adapter, getEventDropData, store]);

  return ref;
}

export namespace useDayGridCellDropTarget {
  export interface Parameters {
    /**
     * The value of the cell.
     */
    value: SchedulerValidDate;
  }
}
