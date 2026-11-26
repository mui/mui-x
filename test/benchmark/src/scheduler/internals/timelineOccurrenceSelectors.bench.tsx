// The builders of the Scheduler tests live outside of this package.
/* eslint-disable import/no-relative-packages */
import { computeElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import { sortEventOccurrences } from '@mui/x-scheduler-internals/sort-event-occurrences';
import {
  computeOccurrencesFirstIndexLookup,
  computeOccurrencesMaxIndex,
} from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import {
  addTimelinePositionsToOccurrences,
  eventTimelinePremiumPresetSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import {
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from '../../../../utils/scheduler/event-builder';
import { ResourceBuilder } from '../../../../utils/scheduler/resource-builder';
import { getEventTimelinePremiumStateFromParameters } from '../../../../utils/scheduler/state';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const resourceCount = 100;
const occurrencesPerResource = 100;

const getData = lazy(() => {
  const resources = Array.from({ length: resourceCount }, (_, index) =>
    ResourceBuilder.new().id(String(index)).build(),
  );
  const state = getEventTimelinePremiumStateFromParameters({
    events: [],
    resources,
    preset: 'dayAndHour',
  });
  const config = eventTimelinePremiumPresetSelectors.config(state);
  // One hour at the start of the range, which starts on the default visible date.
  const occurrenceTemplate = EventBuilder.new()
    .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
    .toOccurrence();
  const groupedOccurrences = resources.map((resource, resourceIndex) => ({
    resource,
    occurrences: Array.from({ length: occurrencesPerResource }, (_, occurrenceIndex) => {
      const key = `${resourceIndex}-${occurrenceIndex}`;
      return { ...occurrenceTemplate, id: key, key } as SchedulerEventOccurrence;
    }),
  }));
  return { config, durationMs: config.durationMs, groupedOccurrences };
});

function addLanePositionsToOccurrences(occurrences: SchedulerEventOccurrence[]) {
  const firstIndexLookup = computeOccurrencesFirstIndexLookup(occurrences);

  return sortEventOccurrences(occurrences).map((occurrence) => {
    const firstIndex = firstIndexLookup[occurrence.key];
    return { ...occurrence, position: { firstIndex, lastIndex: firstIndex } };
  });
}

timeBenchmark(
  'Event Timeline resource layout - geometry recomputed by each mounted consumer',
  () => {
    const { config, durationMs, groupedOccurrences } = getData();
    let result = 0;

    // The virtualizer needs every resource's lane count.
    for (const { occurrences } of groupedOccurrences) {
      result += computeOccurrencesMaxIndex(occurrences);
    }

    // Mounted rows derive lanes once, while the list and event independently derive geometry.
    for (const { occurrences } of groupedOccurrences.slice(0, 10)) {
      const positionedOccurrences = addLanePositionsToOccurrences(occurrences);
      for (const occurrence of positionedOccurrences) {
        const parameters = {
          start: occurrence.start,
          end: occurrence.end,
          collection: config,
          durationMs,
        };
        result += computeElementPositionInCollection(parameters).duration;
        result += computeElementPositionInCollection(parameters).duration;
      }
    }

    // Dependency geometry only derives lanes for involved resources.
    for (const { occurrences } of groupedOccurrences.slice(0, 2)) {
      result += Object.keys(computeOccurrencesFirstIndexLookup(occurrences)).length;
    }

    return result;
  },
);

timeBenchmark('Event Timeline resource layout - geometry shared by mounted consumers', () => {
  const { config, groupedOccurrences } = getData();
  let result = 0;

  // The virtualizer needs every resource's lane count.
  for (const { occurrences } of groupedOccurrences) {
    result += computeOccurrencesMaxIndex(occurrences);
  }

  // Mounted rows derive lanes and geometry once, then share both with their children.
  for (const { occurrences } of groupedOccurrences.slice(0, 10)) {
    const positionedOccurrences = addLanePositionsToOccurrences(occurrences);
    result += addTimelinePositionsToOccurrences({
      config,
      occurrences: positionedOccurrences,
      positionByOccurrenceKey: null,
    }).length;
  }

  // Dependency geometry only derives lanes for involved resources.
  for (const { occurrences } of groupedOccurrences.slice(0, 2)) {
    result += Object.keys(computeOccurrencesFirstIndexLookup(occurrences)).length;
  }

  return result;
});
