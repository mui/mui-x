'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import {
  addRoundedOffsetToDate,
  getOffsetMsInCollection,
  EVENT_DRAG_PRECISION_MINUTE,
  getCursorPositionRelativeToElement,
  isDraggingTimeGridEvent,
  isDraggingTimeGridEventResizeHandler,
} from '../../utils/drag-utils';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';

export function useTimeGridColumnDropTarget(parameters: useTimeGridColumnDropTarget.Parameters) {
  const { start, end, columnId = null } = parameters;

  const adapter = useAdapter();
  const { onEventChange, setPlaceholder } = useTimeGridRootContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getEventDropData = useEventCallback(
    (
      data: Record<string, unknown>,
      input: { clientY: number },
    ): CalendarPrimitiveEventData | undefined => {
      if (!ref.current) {
        return undefined;
      }

      const position = getCursorPositionRelativeToElement({ ref, input });

      // Move event
      if (isDraggingTimeGridEvent(data)) {
        // TODO: Avoid JS Date conversion
        const eventDuration =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const cursorOffsetMs = getOffsetMsInCollection({
          adapter,
          collectionStart: start,
          collectionEnd: end,
          position: position.y / ref.current!.offsetHeight,
        });

        const newStartDate = addRoundedOffsetToDate({
          adapter,
          date: start,
          offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs,
        });

        const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

        return { start: newStartDate, end: newEndDate, eventId: data.id, columnId };
      }

      // Resize event
      if (isDraggingTimeGridEventResizeHandler(data)) {
        const cursorOffsetMs = getOffsetMsInCollection({
          adapter,
          collectionStart: start,
          collectionEnd: end,
          position: position.y / ref.current!.offsetHeight,
        });

        const cursorDate = addRoundedOffsetToDate({
          adapter,
          date: start,
          offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs,
        });

        if (data.side === 'start') {
          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return {
            start: newStartDate,
            end: data.end,
            eventId: data.id,
            columnId,
          };
        }

        // Ensure the new end date is not before or too close to the start date.
        const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
        const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

        return {
          start: data.start,
          end: newEndDate,
          eventId: data.id,
          columnId,
        };
      }

      return undefined;
    },
  );

  React.useEffect(() => {
    if (!ref.current) {
      return () => {};
    }

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) =>
        isDraggingTimeGridEvent(arg.source.data) ||
        isDraggingTimeGridEventResizeHandler(arg.source.data),
      onDrag: ({ source: { data }, location }) => {
        const newPlaceholder = getEventDropData(data, location.current.input);
        if (newPlaceholder) {
          setPlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingTimeGridEvent(data) || isDraggingTimeGridEventResizeHandler(data)) {
          setPlaceholder({ eventId: data.id, start: data.start, end: data.end, columnId });
        }
      },
      onDrop: ({ source: { data }, location }) => {
        const newEvent = getEventDropData(data, location.current.input);
        if (newEvent) {
          onEventChange(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, getEventDropData, setPlaceholder, columnId, onEventChange]);

  return ref;
}

export namespace useTimeGridColumnDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the column starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the column ends.
     */
    end: SchedulerValidDate;
    /**
     * A unique identifier for the column.
     * This is used to identify the column when dragging events if several columns represent the same time range.
     * @default null
     */
    columnId?: string;
  }
}
