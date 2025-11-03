import { adapter } from 'test/utils/scheduler';
import { diffIn, isWeekend } from './useAdapter';

describe('date-utils', () => {
  describe('isWeekend', () => {
    it('returns false for weekday (e.g. Wednesday)', () => {
      const wed = adapter.date('2025-01-08T12:00:00Z');
      expect(isWeekend(adapter, wed)).to.equal(false);
    });

    it('returns true for Saturday or Sunday', () => {
      const sat = adapter.date('2025-01-11T12:00:00Z');
      expect(isWeekend(adapter, sat)).to.equal(true);

      const sun = adapter.date('2025-01-12T12:00:00Z');
      expect(isWeekend(adapter, sun)).to.equal(true);
    });
  });

  describe('diffIn', () => {
    describe('minutes', () => {
      it('returns whole-minute difference for same-hour timestamps (floored)', () => {
        const later = adapter.date('2025-04-10T10:45:30Z');
        const earlier = adapter.date('2025-04-10T10:00:10Z');
        // 45m 20s -> 45
        expect(diffIn(adapter, later, earlier, 'minutes')).to.equal(45);
      });

      it('returns negative value when first date is earlier than second', () => {
        const earlier = adapter.date('2025-04-10T10:00:10Z');
        const later = adapter.date('2025-04-10T10:45:30Z');
        // -45m 20s -> -46 after floor
        expect(diffIn(adapter, earlier, later, 'minutes')).to.equal(-46);
      });

      it('returns 0 when both instants are identical', () => {
        const t = adapter.date('2025-04-10T10:45:30Z');
        expect(diffIn(adapter, t, t, 'minutes')).to.equal(0);
      });
    });

    describe('days', () => {
      it('ignores time-of-day and compares calendar dates only (end of day vs start of day)', () => {
        const endOf = adapter.date('2025-02-15T23:59:59Z');
        const startOf = adapter.date('2025-02-10T00:00:01Z');
        // Calendar span: 10 -> 15 = 5 days
        expect(diffIn(adapter, endOf, startOf, 'days')).to.equal(5);
      });

      it('handles month boundary correctly (Feb to Mar)', () => {
        const a = adapter.date('2025-03-02T05:00:00Z');
        const b = adapter.date('2025-02-27T18:00:00Z');
        // 27 -> 28 -> 1 -> 2 = 3
        expect(diffIn(adapter, a, b, 'days')).to.equal(3);
      });

      it('returns negative days when order is reversed', () => {
        const earlier = adapter.date('2025-03-02T12:00:00Z');
        const later = adapter.date('2025-03-05T01:00:00Z');
        expect(diffIn(adapter, earlier, later, 'days')).to.equal(-3);
      });
    });

    describe('weeks', () => {
      it('computes whole-week difference based on startOfWeek alignment', () => {
        const week3 = adapter.date('2025-01-18T09:00:00Z');
        const week1 = adapter.date('2025-01-03T09:00:00Z');
        expect(diffIn(adapter, week3, week1, 'weeks')).to.equal(2);
      });

      it('returns 0 for dates inside the same calendar week', () => {
        const monday = adapter.date('2025-01-06T08:00:00Z');
        const friday = adapter.date('2025-01-10T18:00:00Z');
        expect(diffIn(adapter, friday, monday, 'weeks')).to.equal(0);
      });

      it('returns negative when first date is in an earlier week', () => {
        const earlierWeek = adapter.date('2025-01-06T12:00:00Z');
        const laterWeek = adapter.date('2025-01-27T12:00:00Z');
        expect(diffIn(adapter, earlierWeek, laterWeek, 'weeks')).to.equal(-3);
      });
    });

    describe('months', () => {
      it('computes difference across year boundary', () => {
        const a = adapter.date('2026-03-10T00:00:00Z');
        const b = adapter.date('2025-12-10T00:00:00Z');
        // Dec(2025) -> Mar(2026) = 3
        expect(diffIn(adapter, a, b, 'months')).to.equal(3);
      });

      it('returns negative for earlier month', () => {
        const earlierMonth = adapter.date('2025-05-01T00:00:00Z');
        const laterMonth = adapter.date('2025-07-01T00:00:00Z');
        expect(diffIn(adapter, earlierMonth, laterMonth, 'months')).to.equal(-2);
      });

      it('returns 0 for same month regardless of day/time', () => {
        const a = adapter.date('2025-07-31T23:59:59Z');
        const b = adapter.date('2025-07-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'months')).to.equal(0);
      });
    });

    describe('years', () => {
      it('returns positive difference across multiple years', () => {
        const a = adapter.date('2030-05-01T00:00:00Z');
        const b = adapter.date('2025-05-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(5);
      });

      it('returns negative difference when first date is earlier', () => {
        const a = adapter.date('2022-12-31T23:59:59Z');
        const b = adapter.date('2025-01-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(-3);
      });

      it('returns 0 for dates within the same calendar year', () => {
        const a = adapter.date('2025-12-31T23:59:59Z');
        const b = adapter.date('2025-01-01T00:00:00Z');
        expect(diffIn(adapter, a, b, 'years')).to.equal(0);
      });
    });
  });
});
