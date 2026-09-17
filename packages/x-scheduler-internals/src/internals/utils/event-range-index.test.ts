import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, expect, it } from 'vitest';
import {
  createEventRangeIndex,
  EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
} from './event-range-index';

describe('createEventRangeIndex', () => {
  it('should return overlapping events in their original order', () => {
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

  it('should include events that end at the range start or start at the range end', () => {
    const events = [
      EventBuilder.new(adapter)
        .id('ends-at-start')
        .span('2025-01-15T08:00:00Z', '2025-01-15T10:00:00Z')
        .toProcessed(),
      EventBuilder.new(adapter)
        .id('starts-at-end')
        .span('2025-01-15T12:00:00Z', '2025-01-15T13:00:00Z')
        .toProcessed(),
      ...Array.from({ length: 7 }, (_, id) =>
        EventBuilder.new(adapter).id(id).singleDay('2025-02-15T09:00:00Z').toProcessed(),
      ),
    ];
    const index = createEventRangeIndex(events, adapter, false);

    const result = index.getEventsForRange(
      adapter.date('2025-01-15T10:00:00Z', 'default'),
      adapter.date('2025-01-15T12:00:00Z', 'default'),
    );

    expect(result.map((event) => event.id)).to.deep.equal(['ends-at-start', 'starts-at-end']);
  });

  it('should keep recurring events as candidates outside their original range when expansion is enabled', () => {
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

  it.each([9, 10, 11])(
    'should preserve mixed recurring candidates with %s of 40 range entries matching',
    (matchCount) => {
      const firstDay = adapter.date('2025-02-01T00:00:00Z', 'default');
      const events = Array.from({ length: 40 }, (_, eventIndex) => {
        const eventStart = adapter.addDays(firstDay, (eventIndex * 17) % 40);
        const event = EventBuilder.new(adapter)
          .id(eventIndex)
          .span(eventStart.toISOString(), eventStart.toISOString())
          .toProcessed();
        const recurring = EventBuilder.new(adapter)
          .id(`recurring-${eventIndex}`)
          .singleDay('2025-01-01T09:00:00Z')
          .rrule({ freq: 'DAILY' })
          .toProcessed();
        return [recurring, event];
      }).flat();
      const start = adapter.addDays(firstDay, 5);
      const end = adapter.addDays(start, matchCount - 1);
      const rangeMatches = events.filter(
        (event) =>
          event.displayTimezone.start.timestamp <= adapter.getTime(end) &&
          event.displayTimezone.end.timestamp >= adapter.getTime(start),
      );
      expect(rangeMatches).to.have.length(matchCount);
      const expected = events.filter(
        (event) => event.displayTimezone.rrule || rangeMatches.includes(event),
      );

      expect(
        createEventRangeIndex(events, adapter, true).getEventsForRange(start, end),
      ).to.deep.equal(expected);
      expect(
        createEventRangeIndex(events, adapter, false).getEventsForRange(start, end),
      ).to.deep.equal(rangeMatches);
    },
  );

  it('should handle recurring candidate counts above the argument limit', () => {
    const recurring = EventBuilder.new(adapter)
      .singleDay('2025-01-01T09:00:00Z')
      .rrule({ freq: 'DAILY' })
      .toProcessed();
    const events = Array.from({ length: 300_000 }, (_, id) => ({ ...recurring, id }));
    const outside = EventBuilder.new(adapter)
      .id('outside')
      .singleDay('2025-01-01T09:00:00Z')
      .toProcessed();
    const index = createEventRangeIndex([outside, ...events], adapter, true);

    const result = index.getEventsForRange(
      adapter.date('2025-02-01T00:00:00Z', 'default'),
      adapter.date('2025-02-02T00:00:00Z', 'default'),
    );

    expect(result).to.have.length(events.length);
    expect(result.every((event, i) => event === events[i])).to.equal(true);
  });

  it('should return an empty array for an empty calendar', () => {
    const index = createEventRangeIndex([], adapter, false);
    expect(
      index.getEventsForRange(
        adapter.date('2025-01-01T00:00:00Z', 'default'),
        adapter.date('2025-02-01T00:00:00Z', 'default'),
      ),
    ).to.deep.equal([]);
  });

  it('should include zero-duration events on both range boundaries', () => {
    const firstDay = adapter.date('2025-01-01T00:00:00Z', 'default');
    const events = Array.from({ length: 12 }, (_, id) => {
      const point = adapter.addDays(firstDay, id).toISOString();
      return EventBuilder.new(adapter).id(id).span(point, point).toProcessed();
    });
    const index = createEventRangeIndex(events, adapter, false);

    expect(index.getEventsForRange(firstDay, adapter.addDays(firstDay, 1))).to.deep.equal(
      events.slice(0, 2),
    );
    expect(index.getEventsForRange(firstDay, firstDay)).to.deep.equal([events[0]]);
  });

  it('should match a linear overlap scan across different ranges', () => {
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

    for (const width of [0, 3, 39, 40, 41, 100, 250]) {
      for (let day = -10; day < 230; day += 7) {
        const rangeStart = adapter.addDays(firstDay, day);
        const rangeEnd = adapter.addDays(rangeStart, width);
        const expected = events.filter(
          (event) =>
            !adapter.isAfter(event.displayTimezone.start.value, rangeEnd) &&
            !adapter.isBefore(event.displayTimezone.end.value, rangeStart),
        );

        expect(index.getEventsForRange(rangeStart, rangeEnd)).to.deep.equal(expected);
      }
    }
  });

  it('should preserve input order for a broad query over shuffled events', () => {
    const firstDay = adapter.date('2025-01-01T00:00:00Z', 'default');
    const events = Array.from({ length: 40 }, (_, eventIndex) => {
      const eventStart = adapter.addDays(firstDay, (eventIndex * 17) % 40);
      return EventBuilder.new(adapter)
        .id(eventIndex)
        .span(eventStart.toISOString(), adapter.addDays(eventStart, 1).toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, adapter, false);
    const rangeStart = adapter.addDays(firstDay, 5);
    const rangeEnd = adapter.addDays(firstDay, 30);
    const expected = events.filter(
      (event) =>
        event.displayTimezone.start.timestamp <= adapter.getTime(rangeEnd) &&
        event.displayTimezone.end.timestamp >= adapter.getTime(rangeStart),
    );

    expect(expected.length).to.be.greaterThan(
      events.length * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
    );
    expect(index.getEventsForRange(rangeStart, rangeEnd)).to.deep.equal(expected);
  });

  it('should preserve input order for a narrow indexed query over shuffled events', () => {
    const firstDay = adapter.date('2025-01-01T00:00:00Z', 'default');
    const events = Array.from({ length: 100 }, (_, eventIndex) => {
      const eventStart = adapter.addDays(firstDay, (eventIndex * 37) % 100);
      return EventBuilder.new(adapter)
        .id(eventIndex)
        .span(eventStart.toISOString(), adapter.addDays(eventStart, 1).toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, adapter, false);
    const rangeStart = adapter.addDays(firstDay, 40);
    const rangeEnd = adapter.addDays(firstDay, 45);
    const expected = events.filter(
      (event) =>
        event.displayTimezone.start.timestamp <= adapter.getTime(rangeEnd) &&
        event.displayTimezone.end.timestamp >= adapter.getTime(rangeStart),
    );

    expect(expected.length).to.be.lessThan(events.length * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD);
    expect(index.getEventsForRange(rangeStart, rangeEnd)).to.deep.equal(expected);
  });

  it('should return a copy in input order when the range overlaps every event', () => {
    const events = [
      EventBuilder.new(adapter).id('later').singleDay('2025-01-02T09:00:00Z').toProcessed(),
      EventBuilder.new(adapter).id('earlier').singleDay('2025-01-01T09:00:00Z').toProcessed(),
    ];
    const index = createEventRangeIndex(events, adapter, false);

    const result = index.getEventsForRange(
      adapter.date('2025-01-01T00:00:00Z', 'default'),
      adapter.date('2025-01-03T00:00:00Z', 'default'),
    );

    expect(result).to.deep.equal(events);
    expect(result).not.to.equal(events);
  });

  it('should index events before the Unix epoch', () => {
    const events = [
      EventBuilder.new(adapter)
        .id('before-epoch')
        .span('1960-01-01T00:00:00Z', '1960-01-02T00:00:00Z')
        .toProcessed(),
      EventBuilder.new(adapter)
        .id('after-epoch')
        .span('2025-01-01T00:00:00Z', '2025-01-02T00:00:00Z')
        .toProcessed(),
    ];

    expect(
      createEventRangeIndex(events, adapter, false)
        .getEventsForRange(
          adapter.date('1959-12-31T00:00:00Z', 'default'),
          adapter.date('1960-01-03T00:00:00Z', 'default'),
        )
        .map((event) => event.id),
    ).to.deep.equal(['before-epoch']);
  });
});
