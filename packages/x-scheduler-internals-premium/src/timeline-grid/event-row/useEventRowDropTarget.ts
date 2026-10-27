'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import { useDirection } from '@base-ui/react/direction-provider';
import type { SchedulerResourceId, SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  useDropTarget,
  clampResizedEventEdge,
  roundToDragPrecision,
  isStartMinuteOutsideAxisWindow,
  timelineAxisOffsetToTimestamp,
  timestampToTimelineAxisOffsetMs,
  toPlainDateTime,
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
  const store = useEventTimelinePremiumStoreContext();
  const isRtl = useDirection() === 'rtl';

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const { axis } = config;

  // Cursor offsets are measured in axis milliseconds: with a trimmed hour window the
  // hidden hours take no space, so px↔date conversions go through the axis helpers.
  const collectionDurationMs = config.durationMs;

  const getCursorPositionInElementMs: TimelineGridEventRowContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef }) => {
      if (!ref.current || !elementRef.current) {
        return 0;
      }

      const clientX = input.clientX;
      const elementPosition = elementRef.current.getBoundingClientRect();
      // The time axis starts at the inline-start edge, which is the right edge in RTL.
      const offsetFromStart = isRtl
        ? elementPosition.right - clientX
        : clientX - elementPosition.left;
      const positionX = offsetFromStart / ref.current.offsetWidth;

      // A cursor on (or past) either edge must not map beyond the axis: the offset
      // would resolve into the day before or after the collection.
      return Math.min(
        Math.max(Math.round(collectionDurationMs * positionX), 0),
        collectionDurationMs,
      );
    });

  const getEventDropData: useDropTarget.GetEventDropData = useStableCallback(
    ({ data, getDataFromInside, getDataFromOutside, input }) => {
      if (!isValidDropTarget(data)) {
        return undefined;
      }

      const cursorOffsetMs = getCursorPositionInElementMs({ input, elementRef: ref });

      const axisOffsetToTimestamp = (offsetMs: number) =>
        timelineAxisOffsetToTimestamp(axis, roundToDragPrecision(offsetMs));

      // Move a Timeline Event within the Timeline
      if (data.source === 'TimelineGridEvent') {
        const eventDurationMs = data.end - data.start;

        // `cursorOffsetMs - initialCursorPositionInEventMs` reconstructs the *rendered*
        // start edge plus the drag delta. When the real start hides inside the hidden
        // hours, the rendered edge is its window-clamped anchor: carry the hidden
        // remainder over to the new anchor so an unmoved drag maps back to the exact
        // original dates instead of silently snapping the start to the window edge.
        // A visible start has no remainder, even in the second occurrence of an hour repeated by a
        // fall-back transition, which the axis reads as the first one.
        const startMsInDay = toPlainDateTime(data.start, axis.timezone).msInDay;
        const hiddenRemainderMs = isStartMinuteOutsideAxisWindow(
          config,
          Math.floor(startMsInDay / 60_000),
        )
          ? data.start -
            timelineAxisOffsetToTimestamp(
              axis,
              timestampToTimelineAxisOffsetMs(axis, data.start, startMsInDay),
            )
          : 0;

        const newStart =
          axisOffsetToTimestamp(cursorOffsetMs - data.initialCursorPositionInEventMs) +
          hiddenRemainderMs;

        // The event keeps its real duration even when it spans hidden hours, so the
        // real start and end both shift by the same amount as their rendered anchors.
        return getDataFromInside(data, newStart, newStart + eventDurationMs);
      }

      // Resize a Timeline Event
      if (data.source === 'TimelineGridEventResizeHandler') {
        if (data.side === 'start') {
          // Ensure the new start date is not after or too close to the end date.
          const { start: newStart } = clampResizedEventEdge({
            side: 'start',
            start: data.start,
            end: data.end,
            cursorTimestamp: axisOffsetToTimestamp(
              cursorOffsetMs - data.initialCursorPositionInEventMs,
            ),
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          // The offset from the grab point to the event end must be measured on the axis:
          // the real duration would overshoot when the event spans hidden hours.
          const eventAxisDurationMs =
            timestampToTimelineAxisOffsetMs(axis, data.end) -
            timestampToTimelineAxisOffsetMs(axis, data.start);

          // Ensure the new end date is not before or too close to the start date.
          const { end: newEnd } = clampResizedEventEdge({
            side: 'end',
            start: data.start,
            end: data.end,
            cursorTimestamp: axisOffsetToTimestamp(
              cursorOffsetMs - data.initialCursorPositionInEventMs + eventAxisDurationMs,
            ),
            precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
          });

          return getDataFromInside(data, data.start, newEnd);
        }
      }

      // Move a Standalone Event into the Time Grid
      if (data.source === 'StandaloneEvent') {
        // The new event starts at the cursor: cap the offset to the last slot of the
        // axis so a drop on the exact end edge does not create the event on the day
        // after the collection, where it would not be rendered at all.
        const lastStartOffsetMs = collectionDurationMs - EVENT_DRAG_PRECISION_MS;
        return getDataFromOutside(
          data,
          axisOffsetToTimestamp(Math.min(cursorOffsetMs, lastStartOffsetMs)),
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
