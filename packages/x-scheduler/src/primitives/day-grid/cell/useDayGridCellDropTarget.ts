'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import {
  isDraggingDayGridEvent,
  isDraggingDayGridEventResizeHandler,
} from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarOccurrencePlaceholder, SchedulerValidDate } from '../../models';
import { diffIn, mergeDateAndTime } from '../../utils/date-utils';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar/store';

export function useDayGridCellDropTarget(parameters: useDayGridCellDropTarget.Parameters) {
  const { value } = parameters;

  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData = useEventCallback(
    (data: Record<string, unknown>): CalendarOccurrencePlaceholder | undefined => {
      if (!ref.current) {
        return undefined;
      }

      // Move event
      if (isDraggingDayGridEvent(data)) {
        const offset = diffIn(adapter, value, data.draggedDay, 'days');
        return {
          start: offset === 0 ? data.start : adapter.addDays(data.start, offset),
          end: offset === 0 ? data.end : adapter.addDays(data.end, offset),
          eventId: data.eventId,
          occurrenceKey: data.occurrenceKey,
          surfaceType: 'day-grid',
          originalStart: data.start,
        };
      }

      // Resize event
      if (isDraggingDayGridEventResizeHandler(data)) {
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
          return {
            start: newStart,
            end: data.end,
            eventId: data.eventId,
            occurrenceKey: data.occurrenceKey,
            surfaceType: 'day-grid',
            originalStart: data.start,
          };
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
          return {
            start: data.start,
            end: draggedDay,
            eventId: data.eventId,
            occurrenceKey: data.occurrenceKey,
            surfaceType: 'day-grid',
            originalStart: data.start,
          };
        }
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
      canDrop: (arg) =>
        isDraggingDayGridEvent(arg.source.data) ||
        isDraggingDayGridEventResizeHandler(arg.source.data),
      onDrag: ({ source: { data } }) => {
        const newPlaceholder = getEventDropData(data);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingDayGridEvent(data) || isDraggingDayGridEventResizeHandler(data)) {
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
