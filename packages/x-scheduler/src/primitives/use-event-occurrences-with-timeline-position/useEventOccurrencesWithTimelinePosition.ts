import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrenceWithTimePosition,
  SchedulerValidDate,
} from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { Adapter } from '../utils/adapter/types';

/**
 * Places event occurrences for a timeline UI.
 */
export function useEventOccurrencesWithTimelinePosition(
  parameters: useEventOccurrencesWithTimelinePosition.Parameters,
): useEventOccurrencesWithTimelinePosition.ReturnValue {
  const { occurrences, maxColumnSpan } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const conflicts = buildOccurrenceConflicts(adapter, occurrences);

    const { firstIndexLookup, maxIndex } = buildFirstIndexLookup(conflicts);

    const lastIndexLookup = buildLastIndexLookup(
      conflicts,
      firstIndexLookup,
      maxIndex,
      maxColumnSpan,
    );

    const occurrencesWithPosition = occurrences.map((occurrence) => ({
      ...occurrence,
      position: {
        firstIndex: firstIndexLookup[occurrence.key],
        lastIndex: lastIndexLookup[occurrence.key],
      },
    }));

    return { occurrences: occurrencesWithPosition, maxIndex };
  }, [adapter, occurrences, maxColumnSpan]);
}

export namespace useEventOccurrencesWithTimelinePosition {
  export interface Parameters {
    /**
     * The occurrences without the position information
     */
    occurrences: CalendarEventOccurrence[];
    /**
     * Maximum amount of columns an event can span across.
     */
    maxColumnSpan: number;
  }

  export interface ReturnValue {
    /**
     * The occurrences augmented with position information
     */
    occurrences: CalendarEventOccurrenceWithTimePosition[];
    /**
     * The biggest index an event with position has on this time frame.
     */
    maxIndex: number;
  }
}

function buildOccurrenceConflicts(
  adapter: Adapter,
  occurrences: CalendarEventOccurrence[],
): OccurrenceConflicts[] {
  let longestOccurrence: CalendarEventOccurrence | null = null;
  let longestOccurrenceDurationMs = 0;
  const occurrencesProperties: OccurrenceProperties[] = [];
  for (const occurrence of occurrences) {
    // TODO: Avoid JS Date conversion and add adapter.getDurationMs method
    const startTimestamp = adapter.toJsDate(occurrence.start).getTime();
    const occurrenceDurationMs = adapter.toJsDate(occurrence.end).getTime() - startTimestamp;

    occurrencesProperties.push({
      key: occurrence.key,
      start: occurrence.start,
      end: occurrence.end,
      durationMs: occurrenceDurationMs,
      startTimestamp,
    });

    if (occurrenceDurationMs > longestOccurrenceDurationMs) {
      longestOccurrenceDurationMs = occurrenceDurationMs;
      longestOccurrence = occurrence;
    }
  }

  if (longestOccurrence == null) {
    return [];
  }

  const conflicts: OccurrenceConflicts[] = [];

  for (let i = 0; i < occurrencesProperties.length; i += 1) {
    const occurrence = occurrencesProperties[i];
    const conflictsBefore = new Set<string>();
    const conflictsAfter = new Set<string>();

    for (let j = i + 1; j < occurrencesProperties.length; j += 1) {
      const occurrenceA = occurrencesProperties[j];
      if (adapter.isBefore(occurrenceA.start, occurrence.end)) {
        conflictsAfter.add(occurrenceA.key);
      } else {
        // We know that all the next occurrences will start even later, so we can stop here.
        break;
      }
    }

    for (let j = i - 1; j >= 0; j -= 1) {
      const occurrenceB = occurrencesProperties[j];
      const diffBetweenOccurrencesStart = occurrence.startTimestamp - occurrenceB.startTimestamp;
      if (diffBetweenOccurrencesStart > longestOccurrenceDurationMs) {
        // We know that all the previous occurrences won't end after the start of the occurrence we are getting conflicts for, so we can stop here.
        break;
      }

      if (adapter.isAfter(occurrenceB.end, occurrence.start)) {
        conflictsBefore.add(occurrenceB.key);
      }
    }

    conflicts.push({ key: occurrence.key, before: conflictsBefore, after: conflictsAfter });
  }

  return conflicts;
}

function buildFirstIndexLookup(conflicts: OccurrenceConflicts[]) {
  let maxIndex: number = 1;
  const firstIndexLookup: OccurrenceIndexLookup = {};

  for (const occurrence of conflicts) {
    if (occurrence.before.size === 0) {
      firstIndexLookup[occurrence.key] = 1;
    } else {
      const usedIndexes = new Set(
        Array.from(occurrence.before).map(
          (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence],
        ),
      );
      let i = 1;
      while (usedIndexes.has(i)) {
        i += 1;
      }
      firstIndexLookup[occurrence.key] = i;
      if (i > maxIndex) {
        maxIndex = i;
      }
    }
  }

  return { firstIndexLookup, maxIndex };
}

function buildLastIndexLookup(
  conflicts: OccurrenceConflicts[],
  firstIndexLookup: OccurrenceIndexLookup,
  maxIndex: number,
  maxColumnSpan: number,
) {
  if (maxColumnSpan < 2) {
    return firstIndexLookup;
  }

  const lastIndexLookup: OccurrenceIndexLookup = {};
  for (const occurrence of conflicts) {
    const usedIndexes = new Set(
      [...Array.from(occurrence.before), ...Array.from(occurrence.after)].map(
        (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence],
      ),
    );
    const firstIndex = firstIndexLookup[occurrence.key];
    let lastIndex = firstIndex;
    while (
      !usedIndexes.has(lastIndex + 1) &&
      lastIndex < maxIndex &&
      lastIndex - firstIndex < maxColumnSpan - 1
    ) {
      lastIndex += 1;
    }
    lastIndexLookup[occurrence.key] = lastIndex;
  }

  return lastIndexLookup;
}

interface OccurrenceProperties {
  key: string;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  durationMs: number;
  startTimestamp: number;
}

interface OccurrenceConflicts {
  key: string;
  before: Set<string>;
  after: Set<string>;
}

type OccurrenceIndexLookup = { [occurrenceKey: string]: number };
