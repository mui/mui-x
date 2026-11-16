import { test, describe, expect } from 'vitest';
import { addDays, addHours, createDate, EventBuilder } from 'test/utils/scheduler';
import {
  createEventRangeIndex,
  EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
} from './event-range-index';

const eventCount = 50_000;
const firstDay = createDate('2020-01-01T00:00:00Z');
const events = Array.from({ length: eventCount }, (_, index) => {
  const start = addHours(firstDay, index * 4);
  return EventBuilder.new()
    .id(index)
    .span(start.toISOString(), addHours(start, 1).toISOString())
    .toProcessed();
});
const start = addHours(firstDay, eventCount * 2);
const end = addDays(start, 7);
const eventRangeIndex = createEventRangeIndex(events, false);
const shuffledEvents = events.map((_, index) => events[(index * 7_919) % eventCount]);
const shuffledEventRangeIndex = createEventRangeIndex(shuffledEvents, false);
const mediumStart = firstDay;
const mediumBelowThresholdEnd = addHours(firstDay, eventCount * 4 * 0.2);
const mediumAboveThresholdEnd = addHours(firstDay, eventCount * 4 * 0.3);
const broadStart = firstDay;
const broadEnd = addHours(firstDay, eventCount * 4);

function numericLinearQuery(
  collection: typeof events,
  rangeStart: typeof start,
  rangeEnd: typeof end,
) {
  const rangeStartTimestamp = rangeStart.getTime();
  const rangeEndTimestamp = rangeEnd.getTime();

  return collection.filter(
    (event) =>
      event.displayTimezone.start.timestamp <= rangeEndTimestamp &&
      event.displayTimezone.end.timestamp >= rangeStartTimestamp,
  );
}

describe('event range index', () => {
  test('range queries', { timeout: 0 }, async ({ bench }) => {
    // Keep the medium queries on either side of the index's 25% linear-scan threshold.
    expect(
      numericLinearQuery(shuffledEvents, mediumStart, mediumBelowThresholdEnd).length,
    ).toBeLessThan(eventCount * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD);
    expect(
      numericLinearQuery(shuffledEvents, mediumStart, mediumAboveThresholdEnd).length,
    ).toBeGreaterThan(eventCount * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD);

    await bench.compare(
      bench('build index of 50k events', () => {
        createEventRangeIndex(events, false);
      }),

      bench('linear narrow query of 50k events', () => {
        numericLinearQuery(events, start, end);
      }),

      bench('indexed narrow query of 50k chronological events', () => {
        eventRangeIndex.getEventsForRange(start.getTime(), end.getTime());
      }),

      bench('indexed narrow query of 50k shuffled events', () => {
        shuffledEventRangeIndex.getEventsForRange(start.getTime(), end.getTime());
      }),

      bench('numeric linear query matching 20% of 50k shuffled events', () => {
        numericLinearQuery(shuffledEvents, mediumStart, mediumBelowThresholdEnd);
      }),

      bench('indexed query matching 20% of 50k shuffled events', () => {
        shuffledEventRangeIndex.getEventsForRange(
          mediumStart.getTime(),
          mediumBelowThresholdEnd.getTime(),
        );
      }),

      bench('numeric linear query matching 30% of 50k shuffled events', () => {
        numericLinearQuery(shuffledEvents, mediumStart, mediumAboveThresholdEnd);
      }),

      bench('indexed query matching 30% of 50k shuffled events', () => {
        shuffledEventRangeIndex.getEventsForRange(
          mediumStart.getTime(),
          mediumAboveThresholdEnd.getTime(),
        );
      }),

      bench('numeric linear broad query of 50k events', () => {
        numericLinearQuery(shuffledEvents, broadStart, broadEnd);
      }),

      bench('indexed broad query of 50k chronological events', () => {
        eventRangeIndex.getEventsForRange(broadStart.getTime(), broadEnd.getTime());
      }),

      bench('indexed broad query of 50k shuffled events', () => {
        shuffledEventRangeIndex.getEventsForRange(broadStart.getTime(), broadEnd.getTime());
      }),
    );
  });
});
