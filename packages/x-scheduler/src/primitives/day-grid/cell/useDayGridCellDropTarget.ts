'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { isDraggingDayGridEvent } from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { SchedulerValidDate } from '../../models';
import { diffIn } from '../../utils/date-utils';

export function useDayGridCellDropTarget(parameters: useDayGridCellDropTarget.Parameters) {
  const { value } = parameters;

  const adapter = useAdapter();
  const { updateEvent, setPlaceholder } = useDayGridRootContext();
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

    return undefined;
  });

  React.useEffect(() => {
    if (!ref.current) {
      return () => {};
    }

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) => isDraggingDayGridEvent(arg.source.data),
      onDrag: ({ source: { data } }) => {
        const newPlaceholder = getEventDropData(data);

        if (newPlaceholder) {
          setPlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingDayGridEvent(data)) {
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
        const newEvent = getEventDropData(data);

        if (newEvent) {
          updateEvent(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, updateEvent, setPlaceholder, getEventDropData]);

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
