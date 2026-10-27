import * as React from 'react';
import type { SchedulerProcessedDate } from '../../models';
import {
  getTimelineAxisDurationMs,
  isStartMinuteOutsideAxisWindow,
  isEndMinuteOutsideAxisWindow,
  timestampToTimelineAxisOffsetMs,
} from './timeline-axis';
import type { TimelineAxis } from './timeline-axis';

const MINUTE_MS = 60_000;

export function useElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collection, durationMs } = parameters;

  return React.useMemo(
    () => computeElementPositionInCollection({ start, end, collection, durationMs }),
    [start, end, collection, durationMs],
  );
}

/**
 * Pure helper behind `useElementPositionInCollection`, callable outside React.
 */
export function computeElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collection: axis } = parameters;

  // The processed bounds already carry their wall-clock time of day. The offsets are
  // monotonic in the date (day index × day size + a clamped in-day term), so no
  // midnight-wrap correction is needed for `end >= start` inputs.
  const startOffsetMs = timestampToTimelineAxisOffsetMs(
    axis,
    start.timestamp,
    start.minutesInDay * MINUTE_MS,
  );
  const endOffsetMs = timestampToTimelineAxisOffsetMs(
    axis,
    end.timestamp,
    end.minutesInDay * MINUTE_MS,
  );

  const totalMs = parameters.durationMs ?? getTimelineAxisDurationMs(axis);

  const clampToTimeline = (value: number) => Math.min(Math.max(value, 0), totalMs);

  const clampedStartMs = clampToTimeline(startOffsetMs);
  const clampedEndMs = clampToTimeline(endOffsetMs);

  // A bound clamped in either direction means part of the element is hidden.
  const startingBeforeEdge =
    startOffsetMs < 0 || isStartMinuteOutsideAxisWindow(axis, start.minutesInDay);
  const endingAfterEdge =
    endOffsetMs > totalMs || isEndMinuteOutsideAxisWindow(axis, end.minutesInDay);

  return {
    position: clampedStartMs / totalMs,
    duration: Math.max(0, clampedEndMs - clampedStartMs) / totalMs,
    startingBeforeEdge,
    endingAfterEdge,
  };
}

export namespace useElementPositionInCollection {
  export interface Parameters {
    /**
     * The start of the element, processed in the timezone of the collection.
     */
    start: SchedulerProcessedDate;
    /**
     * The end of the element, processed in the timezone of the collection.
     */
    end: SchedulerProcessedDate;
    /**
     * The axis the element is positioned in: the axis of a CalendarGrid time column or day row, or
     * the `axis` of the timeline's preset config.
     */
    collection: TimelineAxis;
    /**
     * Precomputed `getTimelineAxisDurationMs()` of the collection, skipping the
     * per-call derivation when the caller already holds it.
     */
    durationMs?: number;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }
}
