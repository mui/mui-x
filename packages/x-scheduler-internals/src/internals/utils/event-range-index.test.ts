import { adapter, EventBuilder } from 'test/utils/scheduler';
import { createEventRangeIndex } from './event-range-index';

describe('createEventRangeIndex', () => {
  it('returns overlapping events in their original order', () => {
    const events = [
      EventBuilder.new(adapter).id('later-start').singleDay('2025-01-15T12:00:00Z').toProcessed(),
      EventBuilder.new(adapter)
        .id('spanning')
        .span('2025-01-01T00:00:00Z', '2025-02-01T00:00:00Z')
        .toProcessed(),
      EventBuilder.new(adapter).id('earlier-start').singleDay('2025-01-15T09:00:00Z').toProcessed(),
      EventBuilder.new(adapter).id('outside').singleDay('2025-02-15T09:00:00Z').toProcessed(),
    ];
    const index = createEventRangeIndex(events, adapter, false);

    const result = index.getEventsForRange(
      adapter.date('2025-01-15T10:00:00Z', 'default'),
      adapter.date('2025-01-15T13:00:00Z', 'default'),
    );

    expect(result.map((event) => event.id)).to.deep.equal([
      'later-start',
      'spanning',
      'earlier-start',
    ]);
  });

  it('includes events that end at the range start or start at the range end', () => {
    const events = [
      EventBuilder.new(adapter)
        .id('ends-at-start')
        .span('2025-01-15T08:00:00Z', '2025-01-15T10:00:00Z')
        .toProcessed(),
      EventBuilder.new(adapter)
        .id('starts-at-end')
        .span('2025-01-15T12:00:00Z', '2025-01-15T13:00:00Z')
        .toProcessed(),
    ];
    const index = createEventRangeIndex(events, adapter, false);

    const result = index.getEventsForRange(
      adapter.date('2025-01-15T10:00:00Z', 'default'),
      adapter.date('2025-01-15T12:00:00Z', 'default'),
    );

    expect(result.map((event) => event.id)).to.deep.equal(['ends-at-start', 'starts-at-end']);
  });

  it('keeps recurring events as candidates outside their original range when expansion is enabled', () => {
    const recurringEvent = EventBuilder.new(adapter)
      .id('recurring')
      .singleDay('2025-01-01T09:00:00Z')
      .rrule({ freq: 'DAILY' })
      .toProcessed();
    const start = adapter.date('2025-02-01T00:00:00Z', 'default');
    const end = adapter.date('2025-02-02T00:00:00Z', 'default');

    expect(
      createEventRangeIndex([recurringEvent], adapter, true).getEventsForRange(start, end),
    ).to.have.length(1);
    expect(
      createEventRangeIndex([recurringEvent], adapter, false).getEventsForRange(start, end),
    ).to.have.length(0);
  });

  it('matches a linear overlap scan across different ranges', () => {
    const firstDay = adapter.date('2025-01-01T00:00:00Z', 'default');
    const events = Array.from({ length: 200 }, (_, eventIndex) => {
      const eventStart = adapter.addDays(firstDay, eventIndex);
      const eventEnd = adapter.addDays(eventStart, (eventIndex % 20) + 1);
      return EventBuilder.new(adapter)
        .id(eventIndex)
        .span(eventStart.toISOString(), eventEnd.toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, adapter, false);

    for (let day = -10; day < 230; day += 7) {
      const rangeStart = adapter.addDays(firstDay, day);
      const rangeEnd = adapter.addDays(rangeStart, 3);
      const expected = events.filter(
        (event) =>
          !adapter.isAfter(event.displayTimezone.start.value, rangeEnd) &&
          !adapter.isBefore(event.displayTimezone.end.value, rangeStart),
      );

      expect(index.getEventsForRange(rangeStart, rangeEnd).map((event) => event.id)).to.deep.equal(
        expected.map((event) => event.id),
      );
    }
  });
});
