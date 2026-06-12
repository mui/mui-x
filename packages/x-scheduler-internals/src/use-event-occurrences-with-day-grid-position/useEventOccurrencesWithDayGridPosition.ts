import * as React from 'react';
import {
  SchedulerEventOccurrence,
  SchedulerEventOccurrencePlaceholder,
  SchedulerProcessedDate,
} from '../models';
import { useEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { useAdapterContext } from '../use-adapter-context';
import { sortEventOccurrences } from '../sort-event-occurrences';

/**
 * Places event occurrences for a list of days, where if an event is rendered in a day, it fills the entire day cell (no notion of time).
 */
export function useEventOccurrencesWithDayGridPosition(
  parameters: useEventOccurrencesWithDayGridPosition.Parameters,
): useEventOccurrencesWithDayGridPosition.ReturnValue {
  const { days, occurrencesMap, shouldAddPosition } = parameters;
  const adapter = useAdapterContext();

  return React.useMemo(() => {
    const dayListSize = days.length;
    const usedIndexesByDay: Set<number>[] = [];
    const activeSegments: {
      [occurrenceKey: string]: {
        position: useEventOccurrencesWithDayGridPosition.EventOccurrencePosition;
        startDayIndex: number;
      };
    } = {};

    const processedDays = days.map((day, dayIndex) => {
      const usedIndexes = new Set<number>();
      usedIndexesByDay.push(usedIndexes);

      const needsPosition: SchedulerEventOccurrence[] = [];
      const withoutPosition: SchedulerEventOccurrence[] = [];

      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPosition = shouldAddPosition ? shouldAddPosition(occurrence) : true;
        if (hasPosition) {
          needsPosition.push(occurrence);
        } else {
          withoutPosition.push(occurrence);
        }
      }

      const sortedNeedsPosition = sortEventOccurrences(needsPosition);

      const withPosition: useEventOccurrencesWithDayGridPosition.EventOccurrenceWithPosition[] = [];
      for (const occurrence of sortedNeedsPosition) {
        let smallestAvailableIndex = 1;
        while (usedIndexes.has(smallestAvailableIndex)) {
          smallestAvailableIndex += 1;
        }

        const active = activeSegments[occurrence.key];
        let position: useEventOccurrencesWithDayGridPosition.EventOccurrencePosition;

        if (active != null && active.position.index <= smallestAvailableIndex) {
          // The current row is still the best one available: continue the existing bar.
          position = { index: active.position.index, daySpan: 1, isInvisible: true };
        } else {
          if (active != null) {
            // A lower row opened up: stop the previous bar segment right before today,
            // so it no longer overlaps with the new, compacted segment we're about to draw.
            active.position.daySpan = dayIndex - active.startDayIndex;
          }
          const durationInDays =
            adapter.differenceInDays(occurrence.displayTimezone.end.value, day.value) + 1;
          position = {
            index: smallestAvailableIndex,
            daySpan: Math.min(durationInDays, dayListSize - dayIndex),
          };
          activeSegments[occurrence.key] = { position, startDayIndex: dayIndex };
        }

        usedIndexes.add(position.index);
        withPosition.push({ ...occurrence, position });
      }

      withPosition.sort((a, b) => a.position.index - b.position.index);

      return { ...day, withPosition, withoutPosition };
    });

    const usedIndexesFlat = usedIndexesByDay.flatMap((set) => Array.from(set));

    return {
      days: processedDays,
      maxIndex: usedIndexesFlat.length === 0 ? 1 : Math.max(...usedIndexesFlat),
    };
  }, [adapter, days, occurrencesMap, shouldAddPosition]);
}

export namespace useEventOccurrencesWithDayGridPosition {
  export interface Parameters {
    /**
     * The days to add the occurrences to.
     */
    days: SchedulerProcessedDate[];
    /**
     * The occurrences Map as returned by `useEventOccurrences()`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
    /**
     * Whether the position should be computed for this event occurrence.
     * @default () => true
     */
    shouldAddPosition?: (occurrence: SchedulerEventOccurrence) => boolean;
  }

  export interface EventOccurrencePosition {
    /**
     * The 1-based index of the row the event should be rendered in.
     */
    index: number;
    /**
     * The number of days the event should span across.
     */
    daySpan: number;
    /**
     * Whether the event should be rendered as invisible.
     * Invisible events are used to reserve space for events that started on a previous day.
     */
    isInvisible?: boolean;
  }

  export interface EventOccurrenceWithPosition extends SchedulerEventOccurrence {
    position: EventOccurrencePosition;
  }

  export interface EventOccurrencePlaceholderWithPosition extends SchedulerEventOccurrencePlaceholder {
    position: EventOccurrencePosition;
  }

  export type EventRenderableOccurrenceWithPosition =
    | EventOccurrenceWithPosition
    | EventOccurrencePlaceholderWithPosition;

  export interface DayData extends SchedulerProcessedDate {
    /**
     * Occurrences that have been augmented with position information.
     */
    withPosition: EventOccurrenceWithPosition[];
    /**
     * Occurrences that do not need position information.
     */
    withoutPosition: SchedulerEventOccurrence[];
  }

  export type ReturnValue = {
    /**
     * The occurrences of each day.
     */
    days: DayData[];
    /**
     * The biggest index an event with position has on this day.
     */
    maxIndex: number;
  };
}
