import { adapter, EventBuilder } from 'test/utils/scheduler';
import { sortEventOccurrences } from './sortEventOccurrences';

describe('sortEventOccurrences', () => {
  describe('basic sorting', () => {
    it('should return empty array when given empty array', () => {
      const result = sortEventOccurrences([], adapter);
      expect(result).toEqual([]);
    });

    it('should return single occurrence unchanged', () => {
      const occurrence = EventBuilder.new().singleDay('2024-01-15T10:00:00', 60).toOccurrence();
      const result = sortEventOccurrences([occurrence], adapter);
      expect(result).toEqual([occurrence]);
    });

    it('should sort occurrences by start date (earliest first)', () => {
      const early = EventBuilder.new()
        .id('early')
        .singleDay('2024-01-15T08:00:00', 60)
        .toOccurrence();
      const late = EventBuilder.new()
        .id('late')
        .singleDay('2024-01-15T14:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([late, early], adapter);
      expect(result.map((o) => o.id)).toEqual(['early', 'late']);
    });

    it('should sort three occurrences correctly', () => {
      const first = EventBuilder.new()
        .id('first')
        .singleDay('2024-01-15T08:00:00', 60)
        .toOccurrence();
      const second = EventBuilder.new()
        .id('second')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();
      const third = EventBuilder.new()
        .id('third')
        .singleDay('2024-01-15T14:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([third, first, second], adapter);
      expect(result.map((o) => o.id)).toEqual(['first', 'second', 'third']);
    });
  });

  describe('same start date tiebreaker', () => {
    it('should sort by end date (later end first) when start dates are equal', () => {
      const shortEvent = EventBuilder.new()
        .id('short')
        .singleDay('2024-01-15T10:00:00', 30)
        .toOccurrence();
      const longEvent = EventBuilder.new()
        .id('long')
        .singleDay('2024-01-15T10:00:00', 120)
        .toOccurrence();

      const result = sortEventOccurrences([shortEvent, longEvent], adapter);
      expect(result.map((o) => o.id)).toEqual(['long', 'short']);
    });

    it('should handle multiple events with same start but different ends', () => {
      const short = EventBuilder.new()
        .id('short')
        .singleDay('2024-01-15T10:00:00', 30)
        .toOccurrence();
      const medium = EventBuilder.new()
        .id('medium')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();
      const long = EventBuilder.new()
        .id('long')
        .singleDay('2024-01-15T10:00:00', 120)
        .toOccurrence();

      const result = sortEventOccurrences([short, medium, long], adapter);
      expect(result.map((o) => o.id)).toEqual(['long', 'medium', 'short']);
    });
  });

  describe('all-day events', () => {
    it('should sort all-day events by start of day', () => {
      const day1 = EventBuilder.new()
        .id('day1')
        .span('2024-01-15T00:00:00', '2024-01-15T23:59:59')
        .allDay(true)
        .toOccurrence();
      const day2 = EventBuilder.new()
        .id('day2')
        .span('2024-01-16T00:00:00', '2024-01-16T23:59:59')
        .allDay(true)
        .toOccurrence();

      const result = sortEventOccurrences([day2, day1], adapter);
      expect(result.map((o) => o.id)).toEqual(['day1', 'day2']);
    });

    it('should sort all-day events with same start by end date (longer first)', () => {
      const singleDay = EventBuilder.new()
        .id('single')
        .span('2024-01-15T00:00:00', '2024-01-15T23:59:59')
        .allDay(true)
        .toOccurrence();
      const multiDay = EventBuilder.new()
        .id('multi')
        .span('2024-01-15T00:00:00', '2024-01-17T23:59:59')
        .allDay(true)
        .toOccurrence();

      const result = sortEventOccurrences([singleDay, multiDay], adapter);
      expect(result.map((o) => o.id)).toEqual(['multi', 'single']);
    });
  });

  describe('mixed timed and all-day events', () => {
    it('should correctly sort mixed all-day and timed events on the same day', () => {
      const allDay = EventBuilder.new()
        .id('allDay')
        .span('2024-01-15T00:00:00', '2024-01-15T23:59:59')
        .allDay(true)
        .toOccurrence();
      const timed = EventBuilder.new()
        .id('timed')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();

      // All-day event starts at midnight (start of day), so it should come first
      const result = sortEventOccurrences([timed, allDay], adapter);
      expect(result.map((o) => o.id)).toEqual(['allDay', 'timed']);
    });

    it('should sort all-day event after timed event that starts earlier in the day', () => {
      const allDay = EventBuilder.new()
        .id('allDay')
        .span('2024-01-16T00:00:00', '2024-01-16T23:59:59')
        .allDay(true)
        .toOccurrence();
      const timedEarlier = EventBuilder.new()
        .id('timed')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([allDay, timedEarlier], adapter);
      expect(result.map((o) => o.id)).toEqual(['timed', 'allDay']);
    });
  });

  describe('edge cases', () => {
    it('should maintain stable sort for identical occurrences', () => {
      // Two events with exactly the same start and end
      const event1 = EventBuilder.new()
        .id('event1')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();
      const event2 = EventBuilder.new()
        .id('event2')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([event1, event2], adapter);
      // Should maintain original order when equal
      expect(result).toHaveLength(2);
    });

    it('should handle events spanning multiple days', () => {
      const multiDay = EventBuilder.new()
        .id('multiDay')
        .span('2024-01-15T10:00:00', '2024-01-17T14:00:00')
        .toOccurrence();
      const singleDay = EventBuilder.new()
        .id('singleDay')
        .singleDay('2024-01-15T12:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([singleDay, multiDay], adapter);
      // multiDay starts earlier (10:00), so it should come first
      expect(result.map((o) => o.id)).toEqual(['multiDay', 'singleDay']);
    });

    it('should handle events on different days', () => {
      const monday = EventBuilder.new()
        .id('monday')
        .singleDay('2024-01-15T10:00:00', 60)
        .toOccurrence();
      const wednesday = EventBuilder.new()
        .id('wednesday')
        .singleDay('2024-01-17T10:00:00', 60)
        .toOccurrence();
      const tuesday = EventBuilder.new()
        .id('tuesday')
        .singleDay('2024-01-16T10:00:00', 60)
        .toOccurrence();

      const result = sortEventOccurrences([wednesday, monday, tuesday], adapter);
      expect(result.map((o) => o.id)).toEqual(['monday', 'tuesday', 'wednesday']);
    });

    it('should not mutate the original array', () => {
      const early = EventBuilder.new()
        .id('early')
        .singleDay('2024-01-15T08:00:00', 60)
        .toOccurrence();
      const late = EventBuilder.new()
        .id('late')
        .singleDay('2024-01-15T14:00:00', 60)
        .toOccurrence();

      const original = [late, early];
      const originalCopy = [...original];

      sortEventOccurrences(original, adapter);

      expect(original).toEqual(originalCopy);
    });
  });
});
