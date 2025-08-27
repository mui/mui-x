import { DateTime } from 'luxon';
import { getAdapter } from './adapter/getAdapter';
import { diffIn, isWeekend, mergeDateAndTime } from './date-utils';

describe('date-utils', () => {
  const adapter = getAdapter();

  describe('mergeDateAndTime', () => {
    it('merges hour/minute/second/ms from timeParam into dateParam', () => {
      const date = DateTime.fromISO('2025-03-10T00:00:00Z');
      const time = DateTime.fromISO('2024-12-25T13:45:27.123Z');
      const merged = mergeDateAndTime(adapter, date, time);
      expect(adapter.getYear(merged)).to.equal(2025);
      expect(adapter.getMonth(merged)).to.equal(2);
      expect(adapter.getDate(merged)).to.equal(10);
      expect(adapter.getHours(merged)).to.equal(13);
      expect(adapter.getMinutes(merged)).to.equal(45);
      expect(adapter.getSeconds(merged)).to.equal(27);
      expect(adapter.getMilliseconds(merged)).to.equal(123);
    });
  });

  describe('isWeekend', () => {
    it('returns false for weekday (e.g. Wednesday)', () => {
      const wed = DateTime.fromISO('2025-01-08T12:00:00Z');
      expect(isWeekend(adapter, wed)).to.equal(false);
    });

    it('returns true for Saturday or Sunday', () => {
      const sat = DateTime.fromISO('2025-01-11T12:00:00Z');
      expect(isWeekend(adapter, sat)).to.equal(true);

      const sun = DateTime.fromISO('2025-01-12T12:00:00Z');
      expect(isWeekend(adapter, sun)).to.equal(true);
    });
  });

  describe('diffIn', () => {
    describe('minutes', () => {
      it('returns whole-minute difference for same-hour timestamps (floored)', () => {
        const later = DateTime.fromISO('2025-04-10T10:45:30Z');
        const earlier = DateTime.fromISO('2025-04-10T10:00:10Z');
        // 45m 20s -> 45
        expect(diffIn(adapter, later, earlier, 'minutes')).to.equal(45);
      });

      it('returns negative value when first date is earlier than second', () => {
        const earlier = DateTime.fromISO('2025-04-10T10:00:10Z');
        const later = DateTime.fromISO('2025-04-10T10:45:30Z');
        // -45m 20s -> -46 after floor
        expect(diffIn(adapter, earlier, later, 'minutes')).to.equal(-46);
      });

      it('returns 0 when both instants are identical', () => {
        const t = DateTime.fromISO('2025-04-10T10:45:30Z');
        expect(diffIn(adapter, t, t, 'minutes')).to.equal(0);
      });
    });

    describe('days', () => {
      it('ignores time-of-day and compares calendar dates only (end of day vs start of day)', () => {
        const endOf = DateTime.fromISO('2025-02-15T23:59:59Z');
        const startOf = DateTime.fromISO('2025-02-10T00:00:01Z');
        // Calendar span: 10 -> 15 = 5 days
        expect(diffIn(adapter, endOf, startOf, 'days')).to.equal(5);
      });

      it('handles month boundary correctly (Feb to Mar)', () => {
        const a = DateTime.fromISO('2025-03-02T05:00:00Z');
        const b = DateTime.fromISO('2025-02-27T18:00:00Z');
        // 27 -> 28 -> 1 -> 2 = 3
        expect(diffIn(adapter, a, b, 'days')).to.equal(3);
      });

      it('returns negative days when order is reversed', () => {
        const earlier = DateTime.fromISO('2025-03-02T12:00:00Z');
        const later = DateTime.fromISO('2025-03-05T01:00:00Z');
        expect(diffIn(adapter, earlier, later, 'days')).to.equal(-3);
      });
    });

    describe('weeks', () => {
      it('computes whole-week difference based on startOfWeek alignment', () => {
        const week3 = DateTime.fromISO('2025-01-18T09:00:00Z');
        const week1 = DateTime.fromISO('2025-01-03T09:00:00Z');
        expect(diffIn(adapter, week3, week1, 'weeks')).to.equal(2);
      });

      it('returns 0 for dates inside the same calendar week', () => {
        const monday = DateTime.fromISO('2025-01-06T08:00:00Z');
        const friday = DateTime.fromISO('2025-01-10T18:00:00Z');
        expect(diffIn(adapter, friday, monday, 'weeks')).to.equal(0);
      });

      it('returns negative when first date is in an earlier week', () => {
        const earlierWeek = DateTime.fromISO('2025-01-06T12:00:00Z');
        const laterWeek = DateTime.fromISO('2025-01-27T12:00:00Z');
        expect(diffIn(adapter, earlierWeek, laterWeek, 'weeks')).to.equal(-3);
      });
    });

    describe('months', () => {
      it('computes difference across year boundary', () => {
        const a = DateTime.fromISO('2026-03-10T00:00:00Z');
        const b = DateTime.fromISO('2025-12-10T00:00:00Z');
        // Dec(2025) -> Mar(2026) = 3
        expect(diffIn(adapter, a, b, 'months')).to.equal(3);
      });

      it('returns negative for earlier month', () => {
        const earlierMonth = DateTime.fromISO('2025-05-01T00:00:00Z');
        const laterMonth = DateTime.fromISO('2025-07-01T00:00:00Z');
        expect(diffIn(adapter, earlierMonth, laterMonth, 'months')).to.equal(-2);
      });

      it('returns 0 for same month regardless of day/time', () => {
        const a = DateTime.fromISO('2025-07-31T23:59:59Z');
        const b = DateTime.fromISO('2025-07-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'months')).to.equal(0);
      });
    });

    describe('years', () => {
      it('returns positive difference across multiple years', () => {
        const a = DateTime.fromISO('2030-05-01T00:00:00Z');
        const b = DateTime.fromISO('2025-05-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(5);
      });

      it('returns negative difference when first date is earlier', () => {
        const a = DateTime.fromISO('2022-12-31T23:59:59Z');
        const b = DateTime.fromISO('2025-01-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(-3);
      });

      it('returns 0 for dates within the same calendar year', () => {
        const a = DateTime.fromISO('2025-12-31T23:59:59Z');
        const b = DateTime.fromISO('2025-01-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(0);
      });
    });
  });
});
