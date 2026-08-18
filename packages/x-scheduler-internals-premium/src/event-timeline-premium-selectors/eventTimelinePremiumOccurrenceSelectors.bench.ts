import { bench, describe } from 'vitest';
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
const positionedGroupedOccurrences = groupedOccurrences.map(({ resource, occurrences }) => {
  const firstIndexLookup = computeOccurrencesFirstIndexLookup(adapter, occurrences);
  return {
    resource,
    occurrences: sortEventOccurrences(occurrences).map((occurrence) => {
      const firstIndex = firstIndexLookup[occurrence.key];
      return { ...occurrence, position: { firstIndex, lastIndex: firstIndex } };
    }),
  };
});
export const benchmarkResult = { value: undefined as unknown };

describe('event timeline resource layout', () => {
  bench('derive lanes and geometry independently for each consumer', () => {
    let result = 0;
    for (const { occurrences } of groupedOccurrences) {
      result += computeOccurrencesMaxIndex(adapter, occurrences);
      result += Object.keys(computeOccurrencesFirstIndexLookup(adapter, occurrences)).length;
      result += sortEventOccurrences(occurrences).length;
      result += computeOccurrencesFirstIndexLookup(adapter, occurrences)[occurrences[0].key];
      for (const occurrence of occurrences) {
        result += computeElementPositionInCollection(adapter, {
          start: occurrence.displayTimezone.start,
          end: occurrence.displayTimezone.end,
          collection: config,
          durationMs,
        }).duration;
      }
    }
    benchmarkResult.value = result;
  });

  bench('derive global lane counts for the virtualizer', () => {
    let result = 0;
    for (const { occurrences } of groupedOccurrences) {
      result += computeOccurrencesMaxIndex(adapter, occurrences);
    }
    benchmarkResult.value = result;
  });

  bench('derive geometry for 10 mounted rows', () => {
    let result = 0;
    for (const { occurrences } of positionedGroupedOccurrences.slice(0, 10)) {
      result += addTimelinePositionsToOccurrences({
        adapter,
        config,
        occurrences,
        positionByOccurrenceKey: null,
      }).length;
    }
    benchmarkResult.value = result;
  });

  bench('derive dependency lanes for 2 involved rows', () => {
    let result = 0;
    for (const { occurrences } of groupedOccurrences.slice(0, 2)) {
      result += Object.keys(computeOccurrencesFirstIndexLookup(adapter, occurrences)).length;
    }
    benchmarkResult.value = result;
  });
});
