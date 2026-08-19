import { bench } from 'vitest';
import {
  computeElementPositionInCollection,
  getTimelineAxisDurationMs,
} from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import { sortEventOccurrences } from '@mui/x-scheduler-internals/sort-event-occurrences';
import {
  computeOccurrencesFirstIndexLookup,
  computeOccurrencesMaxIndex,
} from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import {
  adapter,
  EventBuilder,
  getEventTimelinePremiumStateFromParameters,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';
import { addTimelinePositionsToOccurrences } from './eventTimelinePremiumOccurrenceSelectors';

const resourceCount = 100;
const occurrencesPerResource = 100;
const resources = Array.from({ length: resourceCount }, (_, index) =>
  ResourceBuilder.new().id(String(index)).build(),
);
const state = getEventTimelinePremiumStateFromParameters({
  events: [],
  resources,
  preset: 'dayAndHour',
});
const config = eventTimelinePremiumPresetSelectors.config(state);
const durationMs = getTimelineAxisDurationMs(adapter, config);
const start = config.start;
const end = adapter.addHours(start, 1);
const occurrenceTemplate = EventBuilder.new()
  .span(start.toISOString(), end.toISOString())
  .toOccurrence();
const groupedOccurrences = resources.map((resource, resourceIndex) => ({
  resource,
  occurrences: Array.from({ length: occurrencesPerResource }, (_, occurrenceIndex) => {
    const key = `${resourceIndex}-${occurrenceIndex}`;
    return { ...occurrenceTemplate, id: key, key } as SchedulerEventOccurrence;
  }),
}));

function addLanePositionsToOccurrences(occurrences: SchedulerEventOccurrence[]) {
  const firstIndexLookup = computeOccurrencesFirstIndexLookup(adapter, occurrences);

  return sortEventOccurrences(occurrences).map((occurrence) => {
    const firstIndex = firstIndexLookup[occurrence.key];
    return { ...occurrence, position: { firstIndex, lastIndex: firstIndex } };
  });
}

export const benchmarkResult = { value: undefined as unknown };

describe('event timeline resource layout', () => {
  bench('derive layout with geometry recomputed by each mounted consumer', () => {
    let result = 0;

    // The virtualizer needs every resource's lane count.
    for (const { occurrences } of groupedOccurrences) {
      result += computeOccurrencesMaxIndex(adapter, occurrences);
    }

    // Mounted rows derive lanes once, while the list and event independently derive geometry.
    for (const { occurrences } of groupedOccurrences.slice(0, 10)) {
      const positionedOccurrences = addLanePositionsToOccurrences(occurrences);
      for (const occurrence of positionedOccurrences) {
        const parameters = {
          start: occurrence.displayTimezone.start,
          end: occurrence.displayTimezone.end,
          collection: config,
          durationMs,
        };
        result += computeElementPositionInCollection(adapter, parameters).duration;
        result += computeElementPositionInCollection(adapter, parameters).duration;
      }
    }

    // Dependency geometry only derives lanes for involved resources.
    for (const { occurrences } of groupedOccurrences.slice(0, 2)) {
      result += Object.keys(computeOccurrencesFirstIndexLookup(adapter, occurrences)).length;
    }

    benchmarkResult.value = result;
  });

  bench('derive lazy layout with geometry shared by mounted consumers', () => {
    let result = 0;

    // The virtualizer needs every resource's lane count.
    for (const { occurrences } of groupedOccurrences) {
      result += computeOccurrencesMaxIndex(adapter, occurrences);
    }

    // Mounted rows derive lanes and geometry once, then share both with their children.
    for (const { occurrences } of groupedOccurrences.slice(0, 10)) {
      const positionedOccurrences = addLanePositionsToOccurrences(occurrences);
      result += addTimelinePositionsToOccurrences({
        adapter,
        config,
        occurrences: positionedOccurrences,
        positionByOccurrenceKey: null,
      }).length;
    }

    // Dependency geometry only derives lanes for involved resources.
    for (const { occurrences } of groupedOccurrences.slice(0, 2)) {
      result += Object.keys(computeOccurrencesFirstIndexLookup(adapter, occurrences)).length;
    }

    benchmarkResult.value = result;
  });
});
