'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui-components/utils/useStableCallback';
import { useAdapter } from '../../use-adapter/useAdapter';
import { SchedulerResourceId, SchedulerEvent, SchedulerValidDate } from '../../models';
import { buildIsValidDropTarget } from '../../build-is-valid-drop-target';
import { TimelineEventRowContext } from './TimelineEventRowContext';
import { useDropTarget } from '../../utils/useDropTarget';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';

const isValidDropTarget = buildIsValidDropTarget([
  'TimelineEvent',
  'TimelineEventResizeHandler',
  'StandaloneEvent',
]);

export function useEventRowDropTarget(parameters: useEventRowDropTarget.Parameters) {
  const { start, end, resourceId, addPropertiesToDroppedEvent } = parameters;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);

  const collectionStartTimestamp = adapter.getTime(start);
  const collectionEndTimestamp = adapter.getTime(end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: TimelineEventRowContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientX = input.clientX;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

      return Math.round(collectionDurationMs * positionX);
    });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const addOffsetToDate = (date: SchedulerValidDate, offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        return adapter.addMilliseconds(date, roundedOffset);
      };

      // Move a Timeline Event within the Timeline
      if (data.source === 'TimelineEvent') {
        const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

        const newStartDate = addOffsetToDate(
          start,
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );

        const newEndDate = adapter.addMilliseconds(newStartDate, eventDurationMs);

        return getDataFromInside(data, newStartDate, newEndDate);
      }

      // Resize a Timeline Event
      if (data.source === 'TimelineEventResizeHandler') {
        if (data.side === 'start') {
          const cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs,
          );

          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return getDataFromInside(data, newStartDate, data.end);
        }

        if (data.side === 'end') {
          const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

          const cursorDate = addOffsetToDate(
            start,
            cursorOffsetMs - data.initialCursorPositionInEventMs + eventDurationMs,
          );

          // Ensure the new end date is not before or too close to the start date.
          const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
          const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

          return getDataFromInside(data, data.start, newEndDate);
        }
      }

      // Move a Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        return getDataFromOutside(data, addOffsetToDate(start, cursorOffsetMs));
      }

      return undefined;
    },
  );

  useDropTarget({
    ref,
    resourceId,
    surfaceType: 'timeline',
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  });

  return { getCursorPositionInElementMs, ref };
}

export namespace useEventRowDropTarget {
  export interface Parameters {
    /**
     * The data and time at which the row starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the row ends.
     */
    end: SchedulerValidDate;
    /**
     * The id of the resource to drop the event onto.
     * If null, the event will be dropped outside of any resource.
     */
    resourceId: SchedulerResourceId | null;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue
    extends Pick<TimelineEventRowContext, 'getCursorPositionInElementMs'> {}
}
