import { adapter, adapterFr } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { mergeDateAndTime, getStartOfWeek, getEndOfWeek, getWeekNumber } from './date-utils';
import { normalizeAllDayBounds } from './plain-date-utils/adapter';

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

  describe('normalizeAllDayBounds', () => {
    const start = adapter.date('2025-01-08T09:00:00.000Z', 'default');
    const end = adapter.date('2025-01-08T18:00:00.000Z', 'default');

    it('returns the bounds unchanged when allDay is false', () => {
      const result = normalizeAllDayBounds(adapter, start, end, false);
      expect(adapter.getHours(result.start)).to.equal(9);
      expect(adapter.getHours(result.end)).to.equal(18);
    });

    it('returns the bounds unchanged when allDay is undefined', () => {
      const result = normalizeAllDayBounds(adapter, start, end, undefined);
      expect(adapter.getHours(result.start)).to.equal(9);
      expect(adapter.getHours(result.end)).to.equal(18);
    });

    it('snaps an all-day event to the whole day', () => {
      const result = normalizeAllDayBounds(adapter, start, end, true);
      expect(adapter.getHours(result.start)).to.equal(0);
      expect(adapter.getMinutes(result.start)).to.equal(0);
      expect(adapter.getHours(result.end)).to.equal(23);
      expect(adapter.getMinutes(result.end)).to.equal(59);
      expect(adapter.getSeconds(result.end)).to.equal(59);
    });

    it('preserves the span when flattening a multi-day all-day event', () => {
      const multiDayEnd = adapter.date('2025-01-10T18:00:00.000Z', 'default');
      const result = normalizeAllDayBounds(adapter, start, multiDayEnd, true);
      expect(adapter.getDate(result.start)).to.equal(8);
      expect(adapter.getHours(result.start)).to.equal(0);
      expect(adapter.getDate(result.end)).to.equal(10);
      expect(adapter.getHours(result.end)).to.equal(23);
    });
  });

  describe('normalizeAllDayBounds across DST transitions', () => {
    it('should end the day on the later 23:59:59.999 when a DST transition repeats its last hour', () => {
      // America/Santiago falls back from 00:00 -03:00 to 23:00 -04:00 on April 6th, 2024.
      const day = adapter.date('2024-04-06T12:00:00', 'America/Santiago');
      const result = normalizeAllDayBounds(adapter, day, day, true);
      expect(new Date(adapter.getTime(result.start)).toISOString()).to.equal(
        '2024-04-06T03:00:00.000Z',
      );
      expect(new Date(adapter.getTime(result.end)).toISOString()).to.equal(
        '2024-04-07T03:59:59.999Z',
      );
      expect(adapter.getTimezone(result.end)).to.equal('America/Santiago');
    });
  });

  describe('getStartOfWeek', () => {
    it('uses the first day of the week of the locale when weekStartsOn is undefined', () => {
      // Weeks start on Sunday in English and on Monday in French.
      for (const currentAdapter of [adapter, adapterFr]) {
        const result = getStartOfWeek(currentAdapter, wednesday, undefined);
        expect(currentAdapter.isEqual(result, currentAdapter.startOfWeek(wednesday))).to.equal(
          true,
        );
      }
    });

    it('reads the week in the timezone of the date', () => {
      // Sunday 03:00 in UTC is Saturday 22:00 in New York.
      const date = adapter.setTimezone(
        adapter.date('2025-01-12T03:00:00Z', 'default'),
        'America/New_York',
      );
      const result = getStartOfWeek(adapter, date, 0);
      expect(adapter.getTimezone(result)).to.equal('America/New_York');
      expect(adapter.toJsDate(result).toISOString()).to.equal('2025-01-05T05:00:00.000Z');
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
    it('uses the first day of the week of the locale when weekStartsOn is undefined', () => {
      for (const currentAdapter of [adapter, adapterFr]) {
        const result = getEndOfWeek(currentAdapter, wednesday, undefined);
        expect(currentAdapter.isEqual(result, currentAdapter.endOfWeek(wednesday))).to.equal(true);
      }
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

    it('returns the end of a week ending on the last supported day', () => {
      // 9999-12-31 is a Friday.
      const lastDay = adapter.date('9999-12-31T12:00:00.000Z', 'UTC');
      const result = getEndOfWeek(adapter, lastDay, 6);
      expect(adapter.getTime(result)).to.equal(Date.UTC(9999, 11, 31, 23, 59, 59, 999));
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

    it('returns week 1 of 10000 for the last week of 9999 with weekStartsOn=3 (Wed)', () => {
      // The week starts on Wed 9999-12-29, so its 4th day is in 10000.
      const lastDay = adapter.date('9999-12-31T12:00:00.000Z', 'UTC');
      expect(getWeekNumber(adapter, lastDay, 3)).to.equal(1);
    });
  });

  describe('runtime guards', () => {
    it('getStartOfWeek throws in dev when weekStartsOn is out of range', () => {
      expect(() => getStartOfWeek(adapter, wednesday, 7 as any)).to.throw(/weekStartsOn/);
    });

    it('getStartOfWeek throws in dev when weekStartsOn is a float', () => {
      expect(() => getStartOfWeek(adapter, wednesday, 1.5 as any)).to.throw(/weekStartsOn/);
    });
  });
});
