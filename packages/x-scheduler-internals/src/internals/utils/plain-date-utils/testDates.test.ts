import { addDays, addMonths, createDate, endOfDay, startOfWeek } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

// The date helpers of the tests (`test/utils/scheduler/dates.ts`), which most Scheduler tests use
// to build their dates.
describe('date helpers of the tests', () => {
  describe('createDate', () => {
    it('should read a string ending with Z or an offset as an instant', () => {
      expect(createDate('2025-07-01T10:00:00Z', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 6, 1, 10),
      );
      expect(createDate('2025-07-01Z', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 6, 1),
      );
      expect(createDate('2025-07-01T10:00:00+02:00', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 6, 1, 8),
      );
    });

    it('should read other strings as a wall-clock time in the timezone', () => {
      expect(createDate('2025-07-01T10:00:00', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 6, 1, 14),
      );
      expect(createDate('2025-07-01', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 6, 1, 4),
      );
      expect(createDate('2025-07-01').getTime()).to.equal(new Date(2025, 6, 1).getTime());
    });

    it('should move a skipped time forward and resolve a repeated time to its first instant', () => {
      // New York skips 02:00-03:00 on March 9th, 2025 and repeats 01:00-02:00 on November 2nd.
      expect(createDate('2025-03-09T02:30:00', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 2, 9, 7, 30),
      );
      expect(createDate('2025-11-02T01:30:00', 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 10, 2, 5, 30),
      );
    });

    it('should throw for a string that is not a date', () => {
      expect(() => createDate('July 1st')).to.throw('"July 1st" is not an ISO date');
    });
  });

  describe('calendar arithmetic', () => {
    it('should keep the wall-clock time across a DST transition', () => {
      const day = createDate('2025-03-08T10:00:00', 'America/New_York');
      expect(addDays(day, 1, 'America/New_York').getTime()).to.equal(Date.UTC(2025, 2, 9, 14));
    });

    it('should resolve the second occurrence of a repeated time to the first', () => {
      const secondOccurrence = new Date(Date.UTC(2025, 10, 2, 6, 30));
      expect(addDays(secondOccurrence, 0, 'America/New_York').getTime()).to.equal(
        Date.UTC(2025, 10, 2, 5, 30),
      );
    });

    it('should clamp the day to the end of a shorter month', () => {
      expect(addMonths(createDate('2025-01-31T10:00:00Z'), 1, 'UTC').getTime()).to.equal(
        Date.UTC(2025, 1, 28, 10),
      );
    });

    it('should start the week on Sunday', () => {
      expect(startOfWeek(createDate('2025-07-06T10:00:00Z'), 'UTC').getTime()).to.equal(
        Date.UTC(2025, 6, 6),
      );
      expect(startOfWeek(createDate('2025-07-05T10:00:00Z'), 'UTC').getTime()).to.equal(
        Date.UTC(2025, 5, 29),
      );
    });

    it('should end a day whose last hour repeats after its second occurrence', () => {
      // Santiago repeats 23:00-00:00 on April 4th, 2026, going from UTC-3 to UTC-4.
      const day = createDate('2026-04-04T12:00:00', 'America/Santiago');
      expect(endOfDay(day, 'America/Santiago').getTime()).to.equal(
        Date.UTC(2026, 3, 5, 3, 59, 59, 999),
      );
    });
  });
});
