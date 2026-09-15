import { bench, describe } from 'vitest';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { createEventRangeIndex } from './event-range-index';

const eventCount = 50_000;
const firstDay = adapter.date('2020-01-01T00:00:00Z', 'default');
const events = Array.from({ length: eventCount }, (_, index) => {
  const start = adapter.addHours(firstDay, index * 4);
  return EventBuilder.new(adapter)
    .id(index)
    .span(start.toISOString(), adapter.addHours(start, 1).toISOString())
    .toProcessed();
});
const start = adapter.addHours(firstDay, eventCount * 2);
const end = adapter.addDays(start, 7);
const eventRangeIndex = createEventRangeIndex(events, adapter, false);
const shuffledEvents = events.map((_, index) => events[(index * 7_919) % eventCount]);
const shuffledEventRangeIndex = createEventRangeIndex(shuffledEvents, adapter, false);
const mediumStart = firstDay;
const mediumBelowThresholdEnd = adapter.addHours(firstDay, eventCount * 4 * 0.2);
const mediumAboveThresholdEnd = adapter.addHours(firstDay, eventCount * 4 * 0.3);
const broadStart = firstDay;
const broadEnd = adapter.addHours(firstDay, eventCount * 4);

function numericLinearQuery(
  collection: typeof events,
  rangeStart: typeof start,
  rangeEnd: typeof end,
) {
  const rangeStartTimestamp = adapter.getTime(rangeStart);
  const rangeEndTimestamp = adapter.getTime(rangeEnd);

  return collection.filter(
    (event) =>
      event.displayTimezone.start.timestamp <= rangeEndTimestamp &&
      event.displayTimezone.end.timestamp >= rangeStartTimestamp,
  );
}

describe('event range index', () => {
  bench('build index of 50k events', () => {
    createEventRangeIndex(events, adapter, false);
  });

  bench('linear narrow query of 50k events', () => {
    numericLinearQuery(events, start, end);
  });

  bench('indexed narrow query of 50k chronological events', () => {
    eventRangeIndex.getEventsForRange(start, end);
  });

  bench('indexed narrow query of 50k shuffled events', () => {
    shuffledEventRangeIndex.getEventsForRange(start, end);
  });

  bench('numeric linear query matching 20% of 50k shuffled events', () => {
    numericLinearQuery(shuffledEvents, mediumStart, mediumBelowThresholdEnd);
  });

  bench('indexed query matching 20% of 50k shuffled events', () => {
    shuffledEventRangeIndex.getEventsForRange(mediumStart, mediumBelowThresholdEnd);
  });

  bench('numeric linear query matching 30% of 50k shuffled events', () => {
    numericLinearQuery(shuffledEvents, mediumStart, mediumAboveThresholdEnd);
  });

  bench('indexed query matching 30% of 50k shuffled events', () => {
    shuffledEventRangeIndex.getEventsForRange(mediumStart, mediumAboveThresholdEnd);
  });

  bench('numeric linear broad query of 50k events', () => {
    numericLinearQuery(shuffledEvents, broadStart, broadEnd);
  });

  bench('indexed broad query of 50k chronological events', () => {
    eventRangeIndex.getEventsForRange(broadStart, broadEnd);
  });

  bench('indexed broad query of 50k shuffled events', () => {
    shuffledEventRangeIndex.getEventsForRange(broadStart, broadEnd);
  });
});
