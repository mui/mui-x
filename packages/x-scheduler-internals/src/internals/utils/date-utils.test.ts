import { adapter } from 'test/utils/scheduler';
import { mergeDateAndTime, getStartOfWeek, getEndOfWeek, getWeekNumber } from './date-utils';
import { TemporalAdapter } from '../../base-ui-copy/types';

const wednesday = adapter.date('2025-01-08T12:00:00.000Z', 'UTC');

describe('date-utils', () => {
  describe('mergeDateAndTime', () => {
    it('merges hour/minute/second/ms from timeParam into dateParam', () => {
      const date = adapter.date('2025-03-10T00:00:00Z', 'default');
      const time = adapter.date('2024-12-25T13:45:27.123Z', 'default');
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

  describe('getStartOfWeek', () => {
    it('delegates to adapter.startOfWeek when weekStartsOn is undefined', () => {
      const result = getStartOfWeek(adapter, wednesday, undefined);
      expect(adapter.isSameDay(result, adapter.startOfWeek(wednesday))).to.equal(true);
    });

    it('returns Sunday (2025-01-05) when weekStartsOn is 0', () => {
      const result = getStartOfWeek(adapter, wednesday, 0);
      expect(adapter.isSameDay(result, adapter.date('2025-01-05T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });

    it('returns Monday (2025-01-06) when weekStartsOn is 1', () => {
      const result = getStartOfWeek(adapter, wednesday, 1);
      expect(adapter.isSameDay(result, adapter.date('2025-01-06T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });

    it('returns Saturday (2025-01-04) when weekStartsOn is 6', () => {
      const result = getStartOfWeek(adapter, wednesday, 6);
      expect(adapter.isSameDay(result, adapter.date('2025-01-04T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });
  });

  describe('getEndOfWeek', () => {
    it('delegates to adapter.endOfWeek when weekStartsOn is undefined', () => {
      const result = getEndOfWeek(adapter, wednesday, undefined);
      expect(adapter.isSameDay(result, adapter.endOfWeek(wednesday))).to.equal(true);
    });

    it('returns Saturday (2025-01-11) when weekStartsOn is 0 (Sun–Sat week)', () => {
      const result = getEndOfWeek(adapter, wednesday, 0);
      expect(adapter.isSameDay(result, adapter.date('2025-01-11T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });

    it('returns Sunday (2025-01-12) when weekStartsOn is 1 (Mon–Sun week)', () => {
      const result = getEndOfWeek(adapter, wednesday, 1);
      expect(adapter.isSameDay(result, adapter.date('2025-01-12T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });

    it('returns Friday (2025-01-10) when weekStartsOn is 6 (Sat–Fri week)', () => {
      const result = getEndOfWeek(adapter, wednesday, 6);
      expect(adapter.isSameDay(result, adapter.date('2025-01-10T12:00:00.000Z', 'UTC'))).to.equal(
        true,
      );
    });

    it('end of week is always 6 days after start of week', () => {
      const start = getStartOfWeek(adapter, wednesday, 1);
      const end = getEndOfWeek(adapter, wednesday, 1);
      expect(adapter.isSameDay(adapter.addDays(start, 6), end)).to.equal(true);
    });
  });

  describe('getWeekNumber', () => {
    it('delegates to adapter.getWeekNumber when weekStartsOn is undefined', () => {
      const result = getWeekNumber(adapter, wednesday, undefined);
      expect(result).to.equal(adapter.getWeekNumber(wednesday));
    });

    it('returns week 2 for 2025-01-08 (Wednesday) with weekStartsOn=1 (ISO Mon)', () => {
      // ISO week 2 of 2025: Mon 2025-01-06 – Sun 2025-01-12
      const result = getWeekNumber(adapter, wednesday, 1);
      expect(result).to.equal(2);
    });

    it('returns week 1 for 2025-01-01 (Wednesday) with weekStartsOn=1 (ISO Mon)', () => {
      // ISO week 1 of 2025: Mon 2024-12-30 – Sun 2025-01-05, but Jan 1 is in that week.
      // Actually Jan 1 2025 is a Wednesday; its Mon is Dec 30 2024 and midpoint (Thu) is Jan 2, which is in 2025.
      // So it belongs to week 1 of 2025.
      const jan1 = adapter.date('2025-01-01T12:00:00.000Z', 'UTC');
      const result = getWeekNumber(adapter, jan1, 1);
      expect(result).to.equal(1);
    });

    it('returns week 1 of 2026 for Dec 29 2025 with weekStartsOn=1', () => {
      // Dec 29 2025 is a Monday, so its midpoint (Thu) is Jan 1 2026, which is in 2026.
      // That means this week belongs to week 1 of 2026.
      const dec29 = adapter.date('2025-12-29T12:00:00.000Z', 'UTC');
      const result = getWeekNumber(adapter, dec29, 1);
      expect(result).to.equal(1);
    });

    it('returns week 2 for 2025-01-08 with weekStartsOn=0 (Sun)', () => {
      // Sun-week 2: week starts Sun Jan 5 2025; midpoint Wed Jan 8 is in 2025 => week 2.
      const result = getWeekNumber(adapter, wednesday, 0);
      expect(result).to.equal(2);
    });
  });

  describe('runtime guards', () => {
    it('getStartOfWeek throws in dev when weekStartsOn is out of range', () => {
      expect(() => getStartOfWeek(adapter, wednesday, 7 as any)).to.throw(/weekStartsOn/);
    });

    it('getStartOfWeek throws in dev when weekStartsOn is a float', () => {
      expect(() => getStartOfWeek(adapter, wednesday, 1.5 as any)).to.throw(/weekStartsOn/);
    });

    it('getSundayDayNumber throws in dev when adapter.getDayOfWeek returns out-of-range value', () => {
      const badAdapter = {
        ...adapter,
        getDayOfWeek: () => 0,
      } as unknown as TemporalAdapter;
      // Use an object not previously seen so the WeakMap has no cache for it
      expect(() => getStartOfWeek(badAdapter, wednesday, 1)).to.throw(/getDayOfWeek/);
    });
  });
});
