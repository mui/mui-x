import * as React from 'react';
import type {
  SchedulerEventOccurrence,
  SchedulerEventOccurrencePlaceholder,
  SchedulerProcessedDate,
} from '../models';
import type { useEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { useAdapterContext } from '../use-adapter-context';
import { sortEventOccurrences } from '../sort-event-occurrences';

/**
 * Places event occurrences for a list of days, where if an event is rendered in a day, it fills the entire day cell (no notion of time).
 */
export function useEventOccurrencesWithDayGridPosition(
  parameters: useEventOccurrencesWithDayGridPosition.Parameters,
): useEventOccurrencesWithDayGridPosition.ReturnValue {
  const { days, occurrencesMap, shouldAddPosition, maxEvents } = parameters;
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

      // 1. Split occurrences into withPosition and withoutPosition
      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPosition = shouldAddPosition ? shouldAddPosition(occurrence) : true;
        if (hasPosition) {
          needsPosition.push(occurrence);
        } else {
          withoutPosition.push(occurrence);
        }
      }

      // 2. Sort: multi-day events first (so they claim top rows), then by start date.
      // The active-first, then-by-span secondary sort is only needed in overflow mode —
      const baseSorted = sortEventOccurrences(needsPosition);
      const sortedNeedsPosition =
        maxEvents == null
          ? baseSorted
          : baseSorted.sort((a, b) => {
              const aIsActive = activeSegments[a.key] != null ? 0 : 1;
              const bIsActive = activeSegments[b.key] != null ? 0 : 1;
              if (aIsActive !== bIsActive) {
                return aIsActive - bIsActive;
              }
              const aSpan = adapter.differenceInDays(
                a.displayTimezone.end.value,
                a.displayTimezone.start.value,
              );
              const bSpan = adapter.differenceInDays(
                b.displayTimezone.end.value,
                b.displayTimezone.start.value,
              );
              return bSpan - aSpan;
            });

      // 3. Assign position to each occurrence

      // Pre-reserve rows for events that are currently visible and will retain their
      // row. Without this, a resurfacing event computes smallestAvailableIndex before
      // those rows are claimed and can collide with a still-visible event.
      for (const occurrence of sortedNeedsPosition) {
        const active = activeSegments[occurrence.key];
        if (active != null) {
          const isCurrentlyVisible = maxEvents == null || active.position.index <= maxEvents;
          if (isCurrentlyVisible) {
            usedIndexes.add(active.position.index);
          }
        }
      }

      const withPosition: useEventOccurrencesWithDayGridPosition.EventOccurrenceWithPosition[] = [];

      for (const occurrence of sortedNeedsPosition) {
        let smallestAvailableIndex = 1;
        while (usedIndexes.has(smallestAvailableIndex)) {
          smallestAvailableIndex += 1;
        }

        const active = activeSegments[occurrence.key];
        let position: useEventOccurrencesWithDayGridPosition.EventOccurrencePosition;

        if (active != null) {
          const currentIndex = active.position.index;
          const isCurrentlyVisible = maxEvents == null || currentIndex <= maxEvents;
          const wouldNewIndexBeVisible = maxEvents == null || smallestAvailableIndex <= maxEvents;

          if (isCurrentlyVisible) {
            // Event is visible in its current row — never split it, keep the bar continuous.
            position = { index: currentIndex, daySpan: 1, isInvisible: true };
          } else if (wouldNewIndexBeVisible) {
            // Event was hidden (overflowed) and a visible row just opened up — start a new
            // segment with a continuation arrow so the user knows it started earlier.
            active.position.daySpan = dayIndex - active.startDayIndex;
            position = {
              index: smallestAvailableIndex,
              daySpan: Math.min(
                adapter.differenceInDays(occurrence.displayTimezone.end.value, day.value) + 1,
                dayListSize - dayIndex,
              ),
            };
            activeSegments[occurrence.key] = {
              position,
              startDayIndex: dayIndex,
            };
          } else {
            // Still hidden even after checking — stay invisible in the overflow row.
            position = { index: currentIndex, daySpan: 1, isInvisible: true };
          }
        } else {
          // First time we're seeing this occurrence — assign the smallest available index.
          const durationInDays =
            adapter.differenceInDays(occurrence.displayTimezone.end.value, day.value) + 1;
          position = {
            index: smallestAvailableIndex,
            daySpan: Math.min(durationInDays, dayListSize - dayIndex),
          };
          activeSegments[occurrence.key] = {
            position,
            startDayIndex: dayIndex,
          };
        }

        usedIndexes.add(position.index);
        withPosition.push({ ...occurrence, position });
      }

      // Sort by index so they render in the right visual order
      withPosition.sort((a, b) => a.position.index - b.position.index);

      return { ...day, withPosition, withoutPosition };
    });

    if (maxEvents != null) {
      for (let dayIndex = 1; dayIndex < dayListSize; dayIndex += 1) {
        const { withPosition } = processedDays[dayIndex];
        if (!withPosition.some((o) => o.position.index > maxEvents)) {
          continue;
        }
        const sliced = withPosition.find(
          (o) => o.position.index === maxEvents && o.position.isInvisible,
        );
        if (sliced) {
          const segment = activeSegments[sliced.key];
          if (segment) {
            segment.position.daySpan = Math.min(
              segment.position.daySpan,
              dayIndex - segment.startDayIndex,
            );
          }
        }
      }
    }

    const usedIndexesFlat = usedIndexesByDay.flatMap((set) => Array.from(set));

    return {
      days: processedDays,
      maxIndex: usedIndexesFlat.length === 0 ? 1 : Math.max(...usedIndexesFlat),
    };
  }, [adapter, days, maxEvents, occurrencesMap, shouldAddPosition]);
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
    /**
     * The maximum number of events to show before collapsing into a "+N more" overflow.
     * When provided, events beyond this threshold are tracked so they can resurface with
     * a continuation arrow on later days where a visible row becomes available.
     */
    maxEvents?: number | null;
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
    EventOccurrenceWithPosition | EventOccurrencePlaceholderWithPosition;

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
