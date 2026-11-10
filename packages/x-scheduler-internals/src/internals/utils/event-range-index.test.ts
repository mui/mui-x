import { addDays, createDate, EventBuilder } from 'test/utils/scheduler';
import { describe, expect, it } from 'vitest';
import {
  createEventRangeIndex,
  EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
} from './event-range-index';

describe('createEventRangeIndex', () => {
  it('should return overlapping events in their original order', () => {
    const events = [
      EventBuilder.new().id('later-start').singleDay('2025-01-15T12:00:00Z').toProcessed(),
      EventBuilder.new()
        .id('spanning')
        .span('2025-01-01T00:00:00Z', '2025-02-01T00:00:00Z')
        .toProcessed(),
      EventBuilder.new().id('earlier-start').singleDay('2025-01-15T09:00:00Z').toProcessed(),
      EventBuilder.new().id('outside').singleDay('2025-02-15T09:00:00Z').toProcessed(),
    ];
    const index = createEventRangeIndex(events, false);

    const result = index.getEventsForRange(
      Date.parse('2025-01-15T10:00:00Z'),
      Date.parse('2025-01-15T13:00:00Z'),
    );

    expect(result.map((event) => event.id)).to.deep.equal([
      'later-start',
      'spanning',
      'earlier-start',
    ]);
  });

  it('should include events that end at the range start or start at the range end', () => {
    const events = [
      EventBuilder.new()
        .id('ends-at-start')
        .span('2025-01-15T08:00:00Z', '2025-01-15T10:00:00Z')
        .toProcessed(),
      EventBuilder.new()
        .id('starts-at-end')
        .span('2025-01-15T12:00:00Z', '2025-01-15T13:00:00Z')
        .toProcessed(),
      ...Array.from({ length: 7 }, (_, id) =>
        EventBuilder.new().id(id).singleDay('2025-02-15T09:00:00Z').toProcessed(),
      ),
    ];
    const index = createEventRangeIndex(events, false);

    const result = index.getEventsForRange(
      Date.parse('2025-01-15T10:00:00Z'),
      Date.parse('2025-01-15T12:00:00Z'),
    );

    expect(result.map((event) => event.id)).to.deep.equal(['ends-at-start', 'starts-at-end']);
  });

  it('should keep recurring events as candidates outside their original range when expansion is enabled', () => {
    const recurringEvent = EventBuilder.new()
      .id('recurring')
      .singleDay('2025-01-01T09:00:00Z')
      .rrule({ freq: 'DAILY' })
      .toProcessed();
    const start = createDate('2025-02-01T00:00:00Z');
    const end = createDate('2025-02-02T00:00:00Z');

    expect(
      createEventRangeIndex([recurringEvent], true).getEventsForRange(
        start.getTime(),
        end.getTime(),
      ),
    ).to.have.length(1);
    expect(
      createEventRangeIndex([recurringEvent], false).getEventsForRange(
        start.getTime(),
        end.getTime(),
      ),
    ).to.have.length(0);
  });

  it.each([9, 10, 11])(
    'should preserve mixed recurring candidates with %s of 40 range entries matching',
    (matchCount) => {
      const firstDay = createDate('2025-02-01T00:00:00Z');
      const events = Array.from({ length: 40 }, (_, eventIndex) => {
        const eventStart = addDays(firstDay, (eventIndex * 17) % 40);
        const event = EventBuilder.new()
          .id(eventIndex)
          .span(eventStart.toISOString(), eventStart.toISOString())
          .toProcessed();
        const recurring = EventBuilder.new()
          .id(`recurring-${eventIndex}`)
          .singleDay('2025-01-01T09:00:00Z')
          .rrule({ freq: 'DAILY' })
          .toProcessed();
        return [recurring, event];
      }).flat();
      const start = addDays(firstDay, 5);
      const end = addDays(start, matchCount - 1);
      const rangeMatches = events.filter(
        (event) =>
          event.displayTimezone.start.timestamp <= end.getTime() &&
          event.displayTimezone.end.timestamp >= start.getTime(),
      );
      expect(rangeMatches).to.have.length(matchCount);
      const expected = events.filter(
        (event) => event.dataTimezone.rrule || rangeMatches.includes(event),
      );

      expect(
        createEventRangeIndex(events, true).getEventsForRange(start.getTime(), end.getTime()),
      ).to.deep.equal(expected);
      expect(
        createEventRangeIndex(events, false).getEventsForRange(start.getTime(), end.getTime()),
      ).to.deep.equal(rangeMatches);
    },
  );

  it('should handle recurring candidate counts above the argument limit', () => {
    const recurring = EventBuilder.new()
      .singleDay('2025-01-01T09:00:00Z')
      .rrule({ freq: 'DAILY' })
      .toProcessed();
    const events = Array.from({ length: 300_000 }, (_, id) => ({ ...recurring, id }));
    const outside = EventBuilder.new()
      .id('outside')
      .singleDay('2025-01-01T09:00:00Z')
      .toProcessed();
    const index = createEventRangeIndex([outside, ...events], true);

    const result = index.getEventsForRange(
      Date.parse('2025-02-01T00:00:00Z'),
      Date.parse('2025-02-02T00:00:00Z'),
    );

    expect(result).to.have.length(events.length);
    expect(result.every((event, i) => event === events[i])).to.equal(true);
  });

  it('should return an empty array for an empty calendar', () => {
    const index = createEventRangeIndex([], false);
    expect(
      index.getEventsForRange(
        Date.parse('2025-01-01T00:00:00Z'),
        Date.parse('2025-02-01T00:00:00Z'),
      ),
    ).to.deep.equal([]);
  });

  it('should include zero-duration events on both range boundaries', () => {
    const firstDay = createDate('2025-01-01T00:00:00Z');
    const events = Array.from({ length: 12 }, (_, id) => {
      const point = addDays(firstDay, id).toISOString();
      return EventBuilder.new().id(id).span(point, point).toProcessed();
    });
    const index = createEventRangeIndex(events, false);

    expect(
      index.getEventsForRange(firstDay.getTime(), addDays(firstDay, 1).getTime()),
    ).to.deep.equal(events.slice(0, 2));
    expect(index.getEventsForRange(firstDay.getTime(), firstDay.getTime())).to.deep.equal([
      events[0],
    ]);
  });

  it('should match a linear overlap scan across different ranges', () => {
    const firstDay = createDate('2025-01-01T00:00:00Z');
    const events = Array.from({ length: 200 }, (_, eventIndex) => {
      const eventStart = addDays(firstDay, eventIndex);
      const eventEnd = addDays(eventStart, (eventIndex % 20) + 1);
      return EventBuilder.new()
        .id(eventIndex)
        .span(eventStart.toISOString(), eventEnd.toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, false);

    for (const width of [0, 3, 39, 40, 41, 100, 250]) {
      for (let day = -10; day < 230; day += 7) {
        const rangeStart = addDays(firstDay, day);
        const rangeEnd = addDays(rangeStart, width);
        const expected = events.filter(
          (event) =>
            event.displayTimezone.start.timestamp <= rangeEnd.getTime() &&
            event.displayTimezone.end.timestamp >= rangeStart.getTime(),
        );

        expect(index.getEventsForRange(rangeStart.getTime(), rangeEnd.getTime())).to.deep.equal(
          expected,
        );
      }
    }
  });

  it('should preserve input order for a broad query over shuffled events', () => {
    const firstDay = createDate('2025-01-01T00:00:00Z');
    const events = Array.from({ length: 40 }, (_, eventIndex) => {
      const eventStart = addDays(firstDay, (eventIndex * 17) % 40);
      return EventBuilder.new()
        .id(eventIndex)
        .span(eventStart.toISOString(), addDays(eventStart, 1).toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, false);
    const rangeStart = addDays(firstDay, 5);
    const rangeEnd = addDays(firstDay, 30);
    const expected = events.filter(
      (event) =>
        event.displayTimezone.start.timestamp <= rangeEnd.getTime() &&
        event.displayTimezone.end.timestamp >= rangeStart.getTime(),
    );

    expect(expected.length).to.be.greaterThan(
      events.length * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD,
    );
    expect(index.getEventsForRange(rangeStart.getTime(), rangeEnd.getTime())).to.deep.equal(
      expected,
    );
  });

  it('should preserve input order for a narrow indexed query over shuffled events', () => {
    const firstDay = createDate('2025-01-01T00:00:00Z');
    const events = Array.from({ length: 100 }, (_, eventIndex) => {
      const eventStart = addDays(firstDay, (eventIndex * 37) % 100);
      return EventBuilder.new()
        .id(eventIndex)
        .span(eventStart.toISOString(), addDays(eventStart, 1).toISOString())
        .toProcessed();
    });
    const index = createEventRangeIndex(events, false);
    const rangeStart = addDays(firstDay, 40);
    const rangeEnd = addDays(firstDay, 45);
    const expected = events.filter(
      (event) =>
        event.displayTimezone.start.timestamp <= rangeEnd.getTime() &&
        event.displayTimezone.end.timestamp >= rangeStart.getTime(),
    );

    expect(expected.length).to.be.lessThan(events.length * EVENT_RANGE_INDEX_LINEAR_SCAN_THRESHOLD);
    expect(index.getEventsForRange(rangeStart.getTime(), rangeEnd.getTime())).to.deep.equal(
      expected,
    );
  });

  it('should return a copy in input order when the range overlaps every event', () => {
    const events = [
      EventBuilder.new().id('later').singleDay('2025-01-02T09:00:00Z').toProcessed(),
      EventBuilder.new().id('earlier').singleDay('2025-01-01T09:00:00Z').toProcessed(),
    ];
    const index = createEventRangeIndex(events, false);

    const result = index.getEventsForRange(
      Date.parse('2025-01-01T00:00:00Z'),
      Date.parse('2025-01-03T00:00:00Z'),
    );

    expect(result).to.deep.equal(events);
    expect(result).not.to.equal(events);
  });

  it('should index events before the Unix epoch', () => {
    const events = [
      EventBuilder.new()
        .id('before-epoch')
        .span('1960-01-01T00:00:00Z', '1960-01-02T00:00:00Z')
        .toProcessed(),
      EventBuilder.new()
        .id('after-epoch')
        .span('2025-01-01T00:00:00Z', '2025-01-02T00:00:00Z')
        .toProcessed(),
    ];

    expect(
      createEventRangeIndex(events, false)
        .getEventsForRange(Date.parse('1959-12-31T00:00:00Z'), Date.parse('1960-01-03T00:00:00Z'))
        .map((event) => event.id),
    ).to.deep.equal(['before-epoch']);
  });
});
