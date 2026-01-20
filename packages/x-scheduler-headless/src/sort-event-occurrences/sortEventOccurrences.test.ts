import { adapter, EventBuilder } from 'test/utils/scheduler';
import { sortEventOccurrences } from './sortEventOccurrences';

describe('sortEventOccurrences', () => {
  describe('basic sorting', () => {
    it('should return empty array when given empty array', () => {
      expect(sortEventOccurrences([], adapter)).toEqual([]);
    });

    it('should return single occurrence unchanged', () => {
      const occurrence = EventBuilder.new().singleDay('2024-01-15T10:00:00Z').toOccurrence();
      expect(sortEventOccurrences([occurrence], adapter)).toEqual([occurrence]);
    });

    it('should sort occurrences by start date (earliest first)', () => {
      const first = EventBuilder.new().id('first').singleDay('2024-01-15T08:00:00Z').toOccurrence();
      const second = EventBuilder.new()
        .id('second')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();
      const third = EventBuilder.new().id('third').singleDay('2024-01-15T14:00:00Z').toOccurrence();

      expect(sortEventOccurrences([third, first, second], adapter)).to.deep.equal([
        first,
        second,
        third,
      ]);
    });
  });

  describe('same start date tiebreaker', () => {
    it('should sort by end date (later end first) when start dates are equal', () => {
      const short = EventBuilder.new()
        .id('short')
        .singleDay('2024-01-15T10:00:00Z', 30)
        .toOccurrence();
      const long = EventBuilder.new()
        .id('long')
        .singleDay('2024-01-15T10:00:00Z', 120)
        .toOccurrence();

      expect(sortEventOccurrences([short, long], adapter)).to.deep.equal([long, short]);
    });

    it('should handle multiple events with same start but different ends', () => {
      const short = EventBuilder.new()
        .id('short')
        .singleDay('2024-01-15T10:00:00Z', 30)
        .toOccurrence();
      const medium = EventBuilder.new()
        .id('medium')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();
      const long = EventBuilder.new()
        .id('long')
        .singleDay('2024-01-15T10:00:00Z', 120)
        .toOccurrence();

      expect(sortEventOccurrences([short, medium, long], adapter)).to.deep.equal([
        long,
        medium,
        short,
      ]);
    });
  });

  describe('all-day events', () => {
    it('should sort all-day events by start of day', () => {
      const day1 = EventBuilder.new()
        .id('day1')
        .span('2024-01-15T00:00:00Z', '2024-01-15T23:59:59Z')
        .allDay(true)
        .toOccurrence();
      const day2 = EventBuilder.new()
        .id('day2')
        .span('2024-01-16T00:00:00Z', '2024-01-16T23:59:59Z')
        .allDay(true)
        .toOccurrence();

      expect(sortEventOccurrences([day2, day1], adapter)).to.deep.equal([day1, day2]);
    });

    it('should sort all-day events with same start by end date (longer first)', () => {
      const singleDay = EventBuilder.new()
        .id('single')
        .span('2024-01-15T00:00:00Z', '2024-01-15T23:59:59Z')
        .allDay(true)
        .toOccurrence();
      const multiDay = EventBuilder.new()
        .id('multi')
        .span('2024-01-15T00:00:00Z', '2024-01-17T23:59:59Z')
        .allDay(true)
        .toOccurrence();

      expect(sortEventOccurrences([singleDay, multiDay], adapter)).to.deep.equal([
        multiDay,
        singleDay,
      ]);
    });
  });

  describe('mixed timed and all-day events', () => {
    it('should correctly sort mixed all-day and timed events on the same day', () => {
      const allDay = EventBuilder.new()
        .id('allDay')
        .span('2024-01-15T00:00:00Z', '2024-01-15T23:59:59Z')
        .allDay(true)
        .toOccurrence();
      const timed = EventBuilder.new().id('timed').singleDay('2024-01-15T10:00:00Z').toOccurrence();

      // All-day event starts at midnight (start of day), so it should come first
      expect(sortEventOccurrences([timed, allDay], adapter)).to.deep.equal([allDay, timed]);
    });

    it('should sort all-day event after timed event that starts earlier in the day', () => {
      const allDay = EventBuilder.new()
        .id('allDay')
        .span('2024-01-16T00:00:00Z', '2024-01-16T23:59:59Z')
        .allDay(true)
        .toOccurrence();
      const timedEarlier = EventBuilder.new()
        .id('timed')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();

      expect(sortEventOccurrences([allDay, timedEarlier], adapter)).to.deep.equal([
        timedEarlier,
        allDay,
      ]);
    });
  });

  describe('edge cases', () => {
    it('should maintain stable sort for identical occurrences', () => {
      // Two events with exactly the same start and end
      const event1 = EventBuilder.new()
        .id('event1')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();
      const event2 = EventBuilder.new()
        .id('event2')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();

      // Should maintain original order when equal
      expect(sortEventOccurrences([event1, event2], adapter)).to.deep.equal([event1, event2]);
    });

    it('should handle events spanning multiple days', () => {
      const multiDay = EventBuilder.new()
        .id('multiDay')
        .span('2024-01-15T10:00:00Z', '2024-01-17T14:00:00Z')
        .toOccurrence();
      const singleDay = EventBuilder.new()
        .id('singleDay')
        .singleDay('2024-01-15T12:00:00Z')
        .toOccurrence();

      // multiDay starts earlier (10:00), so it should come first
      expect(sortEventOccurrences([singleDay, multiDay], adapter)).to.deep.equal([
        multiDay,
        singleDay,
      ]);
    });

    it('should handle events on different days', () => {
      const monday = EventBuilder.new()
        .id('monday')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();
      const wednesday = EventBuilder.new()
        .id('wednesday')
        .singleDay('2024-01-17T10:00:00Z')
        .toOccurrence();
      const tuesday = EventBuilder.new()
        .id('tuesday')
        .singleDay('2024-01-16T10:00:00Z')
        .toOccurrence();

      expect(sortEventOccurrences([wednesday, monday, tuesday], adapter)).to.deep.equal([
        monday,
        tuesday,
        wednesday,
      ]);
    });

    it('should not mutate the original array', () => {
      const early = EventBuilder.new().id('early').singleDay('2024-01-15T08:00:00Z').toOccurrence();
      const late = EventBuilder.new().id('late').singleDay('2024-01-15T14:00:00Z').toOccurrence();

      const original = [late, early];

      expect(sortEventOccurrences(original, adapter)).to.deep.equal([early, late]);
      expect(original).to.deep.equal([late, early]);
    });
  });
});
