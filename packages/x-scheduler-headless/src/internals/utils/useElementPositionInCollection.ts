import * as React from 'react';
import { useAdapter } from '../../use-adapter/useAdapter';
import { SchedulerProcessedDate, TemporalSupportedObject } from '../../models';

// Fixed 24h grid (visual time, not real-time duration)
const FIXED_24H_GRID_MINUTES = 24 * 60;

export function useElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collectionStart, collectionEnd } = parameters;

  const adapter = useAdapter();

  return React.useMemo(() => {
    const startDayIndex = adapter.differenceInDays(
      adapter.startOfDay(start.value),
      adapter.startOfDay(collectionStart),
    );

    const endDayIndex = adapter.differenceInDays(
      adapter.startOfDay(end.value),
      adapter.startOfDay(collectionStart),
    );

    const startIndexMinutes = startDayIndex * FIXED_24H_GRID_MINUTES + start.minutesInDay;

    let endIndexMinutes = endDayIndex * FIXED_24H_GRID_MINUTES + end.minutesInDay;

    // If the event ends before it starts, it means it spans over midnight(s)
    if (endIndexMinutes < startIndexMinutes) {
      endIndexMinutes += FIXED_24H_GRID_MINUTES;
    }

    const totalDays =
      adapter.differenceInDays(
        adapter.startOfDay(collectionEnd),
        adapter.startOfDay(collectionStart),
      ) + 1;

    const totalMinutes = Math.max(1, totalDays * FIXED_24H_GRID_MINUTES);

    const clampToTimeline = (value: number) => Math.min(Math.max(value, 0), totalMinutes);

    const clampedStartMinutes = clampToTimeline(startIndexMinutes);
    const clampedEndMinutes = clampToTimeline(endIndexMinutes);

    return {
      position: clampedStartMinutes / totalMinutes,
      duration: Math.max(0, clampedEndMinutes - clampedStartMinutes) / totalMinutes,
    };
  }, [adapter, start, end, collectionStart, collectionEnd]);
}

namespace useElementPositionInCollection {
  export interface Parameters {
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
    collectionStart: TemporalSupportedObject;
    collectionEnd: TemporalSupportedObject;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
  }
}
