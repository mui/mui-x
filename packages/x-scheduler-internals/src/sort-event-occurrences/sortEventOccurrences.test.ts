import { EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { sortEventOccurrences } from './sortEventOccurrences';

describe('sortEventOccurrences', () => {
  describe('basic sorting', () => {
    it('should return empty array when given empty array', () => {
      expect(sortEventOccurrences([])).toEqual([]);
    });

    it('should return single occurrence unchanged', () => {
      const occurrence = EventBuilder.new().singleDay('2024-01-15T10:00:00Z').toOccurrence();
      expect(sortEventOccurrences([occurrence])).toEqual([occurrence]);
    });

    it('should sort occurrences by start date (earliest first)', () => {
      const first = EventBuilder.new().id('first').singleDay('2024-01-15T08:00:00Z').toOccurrence();
      const second = EventBuilder.new()
        .id('second')
        .singleDay('2024-01-15T10:00:00Z')
        .toOccurrence();
      const third = EventBuilder.new().id('third').singleDay('2024-01-15T14:00:00Z').toOccurrence();

      expect(sortEventOccurrences([third, first, second])).to.deep.equal([first, second, third]);
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

      expect(sortEventOccurrences([short, long])).to.deep.equal([long, short]);
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
      expect(sortEventOccurrences([event1, event2])).to.deep.equal([event1, event2]);
    });

    it('should not mutate the original array', () => {
      const early = EventBuilder.new().id('early').singleDay('2024-01-15T08:00:00Z').toOccurrence();
      const late = EventBuilder.new().id('late').singleDay('2024-01-15T14:00:00Z').toOccurrence();

      const original = [late, early];

      expect(sortEventOccurrences(original)).to.deep.equal([early, late]);
      expect(original).to.deep.equal([late, early]);
    });
  });
});
