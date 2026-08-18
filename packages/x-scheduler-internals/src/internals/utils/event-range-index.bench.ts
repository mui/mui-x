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

describe('event range index', () => {
  bench('build index of 50k events', () => {
    createEventRangeIndex(events, adapter, false);
  });

  bench('linear scan of 50k events', () => {
    events.filter(
      (event) =>
        !adapter.isAfter(event.displayTimezone.start.value, end) &&
        !adapter.isBefore(event.displayTimezone.end.value, start),
    );
  });

  bench('indexed query of 50k events', () => {
    eventRangeIndex.getEventsForRange(start, end);
  });
});
