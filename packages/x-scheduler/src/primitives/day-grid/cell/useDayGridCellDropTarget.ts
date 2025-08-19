'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { isDraggingDayGridEvent } from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';

export function useDayGridCellDropTarget(parameters: useDayGridCellDropTarget.Parameters) {
  const { value } = parameters;

  const adapter = useAdapter();
  const { onEventChange, setPlaceholder } = useDayGridRootContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData = useEventCallback((data: Record<string, unknown>) => {
    if (!ref.current) {
      return undefined;
    }

    // Move event
    if (isDraggingDayGridEvent(data)) {
      // TODO: Avoid JS Date conversion
      const eventDuration =
        (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
        (60 * 1000);

      const newStartDate = mergeDateAndTime(adapter, value, data.start);
      const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

      return { start: newStartDate, end: newEndDate, eventId: data.id, columnId: null };
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
          setPlaceholder({ eventId: data.id, columnId: null, start: data.start, end: data.end });
        }
      },
      onDrop: ({ source: { data } }) => {
        const newEvent = getEventDropData(data);

        if (newEvent) {
          onEventChange(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, onEventChange, setPlaceholder, getEventDropData]);

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
