'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  SchedulerResourceId,
  SchedulerEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { useDropTarget } from '@mui/x-scheduler-internals/internals';
import { buildIsValidDropTarget } from '@mui/x-scheduler-internals/build-is-valid-drop-target';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  EVENT_DRAG_PRECISION_MS,
} from '@mui/x-scheduler-internals/constants';
import { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';

const isValidDropTarget = buildIsValidDropTarget([
  'TimelineGridEvent',
  'TimelineGridEventResizeHandler',
  'StandaloneEvent',
]);

export function useEventRowDropTarget(parameters: useEventRowDropTarget.Parameters) {
  const { resourceId, addPropertiesToDroppedEvent } = parameters;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  const collectionStartTimestamp = adapter.getTime(presetConfig.start);
  const collectionEndTimestamp = adapter.getTime(presetConfig.end);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const getCursorPositionInElementMs: TimelineGridEventRowContext['getCursorPositionInElementMs'] =
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

      const addOffsetToDate = (date: TemporalSupportedObject, offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        return adapter.addMilliseconds(date, roundedOffset);
      };

      // Move a Timeline Event within the Timeline
      if (data.source === 'TimelineGridEvent') {
        const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

        const newStartDate = addOffsetToDate(
          presetConfig.start,
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );

        const newEndDate = adapter.addMilliseconds(newStartDate, eventDurationMs);

        return getDataFromInside(data, newStartDate, newEndDate);
      }

      // Resize a Timeline Event
      if (data.source === 'TimelineGridEventResizeHandler') {
        if (data.side === 'start') {
          const cursorDate = addOffsetToDate(
            presetConfig.start,
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
            presetConfig.start,
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
        return getDataFromOutside(data, addOffsetToDate(presetConfig.start, cursorOffsetMs));
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
     * The id of the resource to drop the event onto.
     */
    resourceId: SchedulerResourceId;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue extends Pick<
    TimelineGridEventRowContext,
    'getCursorPositionInElementMs'
  > {}
}
