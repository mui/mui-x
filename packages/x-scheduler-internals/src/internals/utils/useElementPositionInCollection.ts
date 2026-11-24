import * as React from 'react';
import {
  getTimelineAxisDurationMs,
  isStartMinuteOutsideAxisWindow,
  isEndMinuteOutsideAxisWindow,
  timestampToTimelineAxisOffsetMs,
} from './timeline-axis';
import type { TimelineAxis } from './timeline-axis';
import { MS_PER_MINUTE } from './plain-date-utils/dayNumber';
import { getMinutesInDay } from './plain-date-utils/plainDate';
import type { BaseTemporal } from './base-temporal';

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

  // The zoned bounds already carry their wall-clock time of day. The offsets are
  // monotonic in the date (day index × day size + a clamped in-day term), so no
  // midnight-wrap correction is needed for `end >= start` inputs.
  const startMinutes = getMinutesInDay(start);
  const endMinutes = getMinutesInDay(end);
  const startOffsetMs = timestampToTimelineAxisOffsetMs(
    axis,
    start.epochMilliseconds,
    startMinutes * MS_PER_MINUTE,
  );
  const endOffsetMs = timestampToTimelineAxisOffsetMs(
    axis,
    end.epochMilliseconds,
    endMinutes * MS_PER_MINUTE,
  );

  const totalMs = parameters.durationMs ?? getTimelineAxisDurationMs(axis);

  const clampToTimeline = (value: number) => Math.min(Math.max(value, 0), totalMs);

  const clampedStartMs = clampToTimeline(startOffsetMs);
  const clampedEndMs = clampToTimeline(endOffsetMs);

  // A bound clamped in either direction means part of the element is hidden.
  const startingBeforeEdge =
    startOffsetMs < 0 || isStartMinuteOutsideAxisWindow(axis, startMinutes);
  const endingAfterEdge = endOffsetMs > totalMs || isEndMinuteOutsideAxisWindow(axis, endMinutes);

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
     * The start of the element, in the timezone of the collection.
     */
    start: BaseTemporal.ZonedDateTime;
    /**
     * The end of the element, in the timezone of the collection.
     */
    end: BaseTemporal.ZonedDateTime;
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
