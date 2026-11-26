// The builders of the Scheduler tests live outside of this package.
/* eslint-disable import/no-relative-packages */
import {
  createEventRangeIndex,
  EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
} from '@mui/x-scheduler-internals/internals';
import type { SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import { addDays, addHours, createDate } from '../../../../utils/scheduler/dates';
import { EventBuilder } from '../../../../utils/scheduler/event-builder';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const eventCount = 50_000;
const firstDay = createDate('2020-01-01T00:00:00Z');
const start = addHours(firstDay, eventCount * 2);
const end = addDays(start, 7);
const mediumStart = firstDay;
const mediumBelowThresholdEnd = addHours(firstDay, eventCount * 4 * 0.2);
const mediumAboveThresholdEnd = addHours(firstDay, eventCount * 4 * 0.3);
const broadStart = firstDay;
const broadEnd = addHours(firstDay, eventCount * 4);

function numericLinearQuery(
  collection: SchedulerProcessedEvent[],
  rangeStart: Date,
  rangeEnd: Date,
) {
  const rangeStartTimestamp = rangeStart.getTime();
  const rangeEndTimestamp = rangeEnd.getTime();

  return collection.filter(
    (event) =>
      event.start.epochMilliseconds <= rangeEndTimestamp &&
      event.end.epochMilliseconds >= rangeStartTimestamp,
  );
}

const getData = lazy(() => {
  const events = Array.from({ length: eventCount }, (_, index) => {
    const eventStart = addHours(firstDay, index * 4);
    return EventBuilder.new()
      .id(index)
      .span(eventStart.toISOString(), addHours(eventStart, 1).toISOString())
      .toProcessed();
  });
  const shuffledEvents = events.map((_, index) => events[(index * 7_919) % eventCount]);

  // Keep the medium queries on either side of the index's 25% linear-scan threshold.
  const threshold = eventCount * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD;
  if (
    numericLinearQuery(shuffledEvents, mediumStart, mediumBelowThresholdEnd).length >= threshold ||
    numericLinearQuery(shuffledEvents, mediumStart, mediumAboveThresholdEnd).length <= threshold
  ) {
    throw new Error('The medium queries are not on either side of the linear-scan threshold.');
  }

  return {
    events,
    shuffledEvents,
    eventRangeIndex: createEventRangeIndex(events, false),
    shuffledEventRangeIndex: createEventRangeIndex(shuffledEvents, false),
  };
});

timeBenchmark('Event range index - build index of 50k events', () =>
  createEventRangeIndex(getData().events, false),
);

timeBenchmark('Event range index - indexed narrow query of 50k chronological events', () =>
  getData().eventRangeIndex.getEventsForRange(start.getTime(), end.getTime()),
);

timeBenchmark('Event range index - indexed narrow query of 50k shuffled events', () =>
  getData().shuffledEventRangeIndex.getEventsForRange(start.getTime(), end.getTime()),
);

timeBenchmark('Event range index - indexed query matching 20% of 50k shuffled events', () =>
  getData().shuffledEventRangeIndex.getEventsForRange(
    mediumStart.getTime(),
    mediumBelowThresholdEnd.getTime(),
  ),
);

timeBenchmark('Event range index - indexed query matching 30% of 50k shuffled events', () =>
  getData().shuffledEventRangeIndex.getEventsForRange(
    mediumStart.getTime(),
    mediumAboveThresholdEnd.getTime(),
  ),
);

timeBenchmark('Event range index - indexed broad query of 50k chronological events', () =>
  getData().eventRangeIndex.getEventsForRange(broadStart.getTime(), broadEnd.getTime()),
);

timeBenchmark('Event range index - indexed broad query of 50k shuffled events', () =>
  getData().shuffledEventRangeIndex.getEventsForRange(broadStart.getTime(), broadEnd.getTime()),
);
