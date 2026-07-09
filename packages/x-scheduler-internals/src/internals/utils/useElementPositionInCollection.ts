import * as React from 'react';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../models';

// Default visual window: the full 24h day (visual time, not real-time duration)
const FIXED_24H_GRID_MINUTES = 24 * 60;

export function useElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const {
    start,
    end,
    collectionStart,
    collectionEnd,
    dayStartMinute = 0,
    dayEndMinute = FIXED_24H_GRID_MINUTES,
  } = parameters;

  const adapter = useAdapterContext();

  return React.useMemo(() => {
    // Number of minutes displayed per day. With the default window this is the full day (1440).
    const dayMinutes = Math.max(1, dayEndMinute - dayStartMinute);

    const startDayIndex = adapter.differenceInDays(
      adapter.startOfDay(start.value),
      adapter.startOfDay(collectionStart),
    );

    const endDayIndex = adapter.differenceInDays(
      adapter.startOfDay(end.value),
      adapter.startOfDay(collectionStart),
    );

    const startIndexMinutes = startDayIndex * dayMinutes + (start.minutesInDay - dayStartMinute);

    let endIndexMinutes = endDayIndex * dayMinutes + (end.minutesInDay - dayStartMinute);

    // If the event ends before it starts, it means it spans over midnight(s)
    if (endIndexMinutes < startIndexMinutes) {
      endIndexMinutes += dayMinutes;
    }

    const totalDays =
      adapter.differenceInDays(
        adapter.startOfDay(collectionEnd),
        adapter.startOfDay(collectionStart),
      ) + 1;

    const totalMinutes = Math.max(1, totalDays * dayMinutes);

    const clampToTimeline = (value: number) => Math.min(Math.max(value, 0), totalMinutes);

    const clampedStartMinutes = clampToTimeline(startIndexMinutes);
    const clampedEndMinutes = clampToTimeline(endIndexMinutes);

    const startingBeforeEdge = startIndexMinutes < 0;
    const endingAfterEdge = endIndexMinutes > totalMinutes;

    return {
      position: clampedStartMinutes / totalMinutes,
      duration: Math.max(0, clampedEndMinutes - clampedStartMinutes) / totalMinutes,
      startingBeforeEdge,
      endingAfterEdge,
    };
  }, [adapter, start, end, collectionStart, collectionEnd, dayStartMinute, dayEndMinute]);
}

namespace useElementPositionInCollection {
  export interface Parameters {
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
    collectionStart: TemporalSupportedObject;
    collectionEnd: TemporalSupportedObject;
    /**
     * First displayed minute of the day, as an offset from midnight.
     * Used by the time-grid views to limit the visible hour range.
     * @default 0
     */
    dayStartMinute?: number;
    /**
     * Last displayed minute of the day, as an offset from midnight.
     * Used by the time-grid views to limit the visible hour range.
     * @default 1440
     */
    dayEndMinute?: number;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }
}
