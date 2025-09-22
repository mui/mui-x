'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import {
  isDraggingDayGridEvent,
  isDraggingDayGridEventResizeHandler,
} from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { SchedulerValidDate } from '../../models';
import { diffIn, mergeDateAndTime } from '../../utils/date-utils';

export function useDayGridCellDropTarget(parameters: useDayGridCellDropTarget.Parameters) {
  const { value } = parameters;

  const adapter = useAdapter();
  const { store, updateEvent, setPlaceholder } = useDayGridRootContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData = useEventCallback((data: Record<string, unknown>) => {
    if (!ref.current) {
      return undefined;
    }

    // Move event
    if (isDraggingDayGridEvent(data)) {
      const offset = diffIn(adapter, value, data.draggedDay, 'days');
      return {
        start: offset === 0 ? data.start : adapter.addDays(data.start, offset),
        end: offset === 0 ? data.end : adapter.addDays(data.end, offset),
        eventId: data.id,
        columnId: null,
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
          eventId: data.id,
          columnId: null,
          originalStart: data.start,
        };
      }
      if (data.side === 'end') {
        if (adapter.isBeforeDay(value, data.start)) {
          return undefined;
        }

        let newEnd: SchedulerValidDate;
        if (adapter.isSameDay(value, data.start)) {
          newEnd = adapter.endOfDay(data.start);
        } else {
          newEnd = mergeDateAndTime(adapter, value, data.end);
        }
        return {
          start: data.start,
          end: newEnd,
          eventId: data.id,
          columnId: null,
          originalStart: data.start,
        };
      }
    }

    return undefined;
  });

  React.useEffect(() => {
    if (!ref.current) {
      return () => {};
    }

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) =>
        isDraggingDayGridEvent(arg.source.data) ||
        isDraggingDayGridEventResizeHandler(arg.source.data),
      onDrag: ({ source: { data } }) => {
        const newPlaceholder = getEventDropData(data);
        if (newPlaceholder) {
          setPlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingDayGridEvent(data) || isDraggingDayGridEventResizeHandler(data)) {
          setPlaceholder({
            eventId: data.id,
            columnId: null,
            start: data.start,
            end: data.end,
            originalStart: data.start,
          });
        }
      },
      onDrop: ({ source: { data } }) => {
        const newEvent = getEventDropData(data) ?? store.state.placeholder;
        if (newEvent) {
          updateEvent(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, store, updateEvent, setPlaceholder, getEventDropData]);

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
