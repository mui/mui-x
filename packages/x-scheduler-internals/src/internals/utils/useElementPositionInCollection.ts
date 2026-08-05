import * as React from 'react';
import { useAdapterContext } from '../../use-adapter-context';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { SchedulerProcessedDate } from '../../models';
import {
  dateToTimelineAxisOffsetMs,
  getTimelineAxisDayMs,
  getTimelineAxisDurationMs,
  isStartMinuteOutsideAxisWindow,
  isEndMinuteOutsideAxisWindow,
} from './timeline-axis';
import type { TimelineAxis } from './timeline-axis';

const MINUTE_MS = 60_000;

export function useElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collection } = parameters;
  // Deconstructed so an inline collection object stays memoization-friendly.
  const { start: collectionStart, end: collectionEnd, dayStartMinute, dayEndMinute } = collection;

  const adapter = useAdapterContext();

  return React.useMemo(
    () =>
      computeElementPositionInCollection(adapter, {
        start,
        end,
        collection: { start: collectionStart, end: collectionEnd, dayStartMinute, dayEndMinute },
      }),
    [adapter, start, end, collectionStart, collectionEnd, dayStartMinute, dayEndMinute],
  );
}

/**
 * Pure helper behind `useElementPositionInCollection`, callable outside React.
 */
export function computeElementPositionInCollection(
  adapter: Adapter,
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collection } = parameters;

  const dayMs = getTimelineAxisDayMs(collection);

  // The processed bounds already carry their wall-clock time of day.
  const startOffsetMs = dateToTimelineAxisOffsetMs(
    adapter,
    collection,
    start.value,
    start.minutesInDay * MINUTE_MS,
  );
  let endOffsetMs = dateToTimelineAxisOffsetMs(
    adapter,
    collection,
    end.value,
    end.minutesInDay * MINUTE_MS,
  );

  // If the event ends before it starts, it means it spans over midnight(s)
  if (endOffsetMs < startOffsetMs) {
    endOffsetMs += dayMs;
  }

  const totalMs = getTimelineAxisDurationMs(adapter, collection);

  const clampToTimeline = (value: number) => Math.min(Math.max(value, 0), totalMs);

  const clampedStartMs = clampToTimeline(startOffsetMs);
  const clampedEndMs = clampToTimeline(endOffsetMs);

  // A bound clamped in either direction means part of the element is hidden.
  const startingBeforeEdge =
    startOffsetMs < 0 || isStartMinuteOutsideAxisWindow(collection, start.minutesInDay);
  const endingAfterEdge =
    endOffsetMs > totalMs || isEndMinuteOutsideAxisWindow(collection, end.minutesInDay);

  return {
    position: clampedStartMs / totalMs,
    duration: Math.max(0, clampedEndMs - clampedStartMs) / totalMs,
    startingBeforeEdge,
    endingAfterEdge,
  };
}

namespace useElementPositionInCollection {
  export interface Parameters {
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
    /**
     * The displayed range and daily hour window the element is positioned in: a
     * time-grid column (`viewConfig`) or the timeline's axis (`presetConfig`).
     */
    collection: TimelineAxis;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }
}
