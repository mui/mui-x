'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { SchedulerResourceId, SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  useDropTarget,
  dateToTimelineAxisOffsetMs,
  timelineAxisOffsetToDate,
} from '@mui/x-scheduler-internals/internals';
import { buildIsValidDropTarget } from '@mui/x-scheduler-internals/build-is-valid-drop-target';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  EVENT_DRAG_PRECISION_MS,
} from '@mui/x-scheduler-internals/constants';
import type { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
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

  // Cursor offsets are measured in axis milliseconds: with a trimmed hour window the
  // hidden hours take no space, so px↔date conversions go through the axis helpers.
  const collectionDurationMs = presetConfig.durationMs;

  const getCursorPositionInElementMs: TimelineGridEventRowContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientX = input.clientX;
      const elementPosition = elementRef.current.getBoundingClientRect();
      const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

      // A cursor exactly on (or past) the right edge must not map beyond the axis:
      // the offset would resolve into the day after the collection.
      return Math.min(Math.round(collectionDurationMs * positionX), collectionDurationMs);
    });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const axisOffsetToDate = (offsetMs: number) => {
        const roundedOffset =
          Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

        return timelineAxisOffsetToDate(adapter, presetConfig, roundedOffset);
      };

      // Move a Timeline Event within the Timeline
      if (data.source === 'TimelineGridEvent') {
        const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

        // `cursorOffsetMs - initialCursorPositionInEventMs` reconstructs the *rendered*
        // start edge plus the drag delta. When the real start hides inside the hidden
        // hours, the rendered edge is its window-clamped anchor: carry the hidden
        // remainder over to the new anchor so an unmoved drag maps back to the exact
        // original dates instead of silently snapping the start to the window edge.
        const startAnchor = timelineAxisOffsetToDate(
          adapter,
          presetConfig,
          dateToTimelineAxisOffsetMs(adapter, presetConfig, data.start),
        );
        const hiddenRemainderMs = adapter.getTime(data.start) - adapter.getTime(startAnchor);

        const newAnchorDate = axisOffsetToDate(
          cursorOffsetMs - data.initialCursorPositionInEventMs,
        );
        const newStartDate = adapter.addMilliseconds(newAnchorDate, hiddenRemainderMs);

        // The event keeps its real duration even when it spans hidden hours, so the
        // real start and end both shift by the same amount as their rendered anchors.
        const newEndDate = adapter.addMilliseconds(newStartDate, eventDurationMs);

        return getDataFromInside(data, newStartDate, newEndDate);
      }

      // Resize a Timeline Event
      if (data.source === 'TimelineGridEventResizeHandler') {
        if (data.side === 'start') {
          const cursorDate = axisOffsetToDate(cursorOffsetMs - data.initialCursorPositionInEventMs);

          // Ensure the new start date is not after or too close to the end date.
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return getDataFromInside(data, newStartDate, data.end);
        }

        if (data.side === 'end') {
          // The offset from the grab point to the event end must be measured on the axis:
          // the real duration would overshoot when the event spans hidden hours.
          const eventAxisDurationMs =
            dateToTimelineAxisOffsetMs(adapter, presetConfig, data.end) -
            dateToTimelineAxisOffsetMs(adapter, presetConfig, data.start);

          const cursorDate = axisOffsetToDate(
            cursorOffsetMs - data.initialCursorPositionInEventMs + eventAxisDurationMs,
          );

          // Ensure the new end date is not before or too close to the start date.
          const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);
          const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

          return getDataFromInside(data, data.start, newEndDate);
        }
      }

      // Move a Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        // The new event starts at the cursor: cap the offset to the last slot of the
        // axis so a drop on the exact right edge does not create the event on the day
        // after the collection, where it would not be rendered at all.
        const lastStartOffsetMs = collectionDurationMs - EVENT_DRAG_PRECISION_MS;
        return getDataFromOutside(
          data,
          axisOffsetToDate(Math.min(cursorOffsetMs, lastStartOffsetMs)),
        );
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
