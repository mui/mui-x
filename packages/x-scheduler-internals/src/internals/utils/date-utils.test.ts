import { describe, it, expect } from 'vitest';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import { adapter, adapterFr, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { PlainDate } from './base-temporal/PlainDate';
import { getPlainDateWeekStart, getWeekNumber } from './date-utils';
import { normalizeAllDayBounds } from './plain-date-utils/adapter';

const wednesdayPlainDate = PlainDate.from('2025-01-08');

describe('date-utils', () => {
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

  describe('getPlainDateWeekStart', () => {
    it('reads the weekday of the plain date for the first day of the week of the locale', () => {
      // Pacific/Apia skipped Friday, December 30th, 2011, so the day has no first instant to read
      // its weekday from. Weeks start on Sunday in English and on Monday in French.
      const plainDate = PlainDate.from('2011-12-30');
      expect(getPlainDateWeekStart(adapter, plainDate, undefined)).toEqualPlainDate('2011-12-25');
      expect(getPlainDateWeekStart(adapterFr, plainDate, undefined)).toEqualPlainDate('2011-12-26');
    });

    it.each([
      { weekStartsOn: 0, expected: '2025-01-05' }, // Sunday
      { weekStartsOn: 1, expected: '2025-01-06' }, // Monday
      { weekStartsOn: 6, expected: '2025-01-04' }, // Saturday
    ] as const)(
      'returns $expected for Wednesday, January 8th, 2025 when weekStartsOn is $weekStartsOn',
      ({ weekStartsOn, expected }) => {
        expect(getPlainDateWeekStart(adapter, wednesdayPlainDate, weekStartsOn)).toEqualPlainDate(
          expected,
        );
      },
    );
  });

  describe('getWeekNumber', () => {
    it('numbers the weeks with the rules of the locale when weekStartsOn is undefined', () => {
      // Friday, January 1st, 2027 is in the first week of 2027 in English, and in the last week of
      // 2026 in French, whose first week holds January 4th.
      const plainDate = PlainDate.from('2027-01-01');
      expect(getWeekNumber(adapter, plainDate, undefined)).to.equal(1);
      expect(getWeekNumber(adapterFr, plainDate, undefined)).to.equal(53);
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'numbers the week of the locale on the date itself, whatever the system timezone',
      () => {
        setSystemTimezone('Pacific/Pago_Pago');
        // A new adapter, as adapters cache data computed in the current system timezone.
        const systemAdapter = new TemporalAdapterDateFns();
        // Sunday, January 5th, 2025 starts the second week of 2025 in English. Pago Pago (UTC−11)
        // is still on Saturday at its midnight in UTC.
        expect(getWeekNumber(systemAdapter, PlainDate.from('2025-01-05'), undefined)).to.equal(2);
      },
    );

    it('returns week 2 for 2025-01-08 (Wednesday) with weekStartsOn=1 (ISO Mon)', () => {
      // ISO week 2 of 2025: Mon 2025-01-06 – Sun 2025-01-12
      const result = getWeekNumber(adapter, wednesdayPlainDate, 1);
      expect(result).to.equal(2);
    });

    it('returns week 1 for 2025-01-01 (Wednesday) with weekStartsOn=1 (ISO Mon)', () => {
      // ISO week 1 of 2025: Mon 2024-12-30 – Sun 2025-01-05, but Jan 1 is in that week.
      // Actually Jan 1 2025 is a Wednesday; its Mon is Dec 30 2024 and midpoint (Thu) is Jan 2, which is in 2025.
      // So it belongs to week 1 of 2025.
      const result = getWeekNumber(adapter, PlainDate.from('2025-01-01'), 1);
      expect(result).to.equal(1);
    });

    it('returns week 1 of 2026 for Dec 29 2025 with weekStartsOn=1', () => {
      // Dec 29 2025 is a Monday, so its midpoint (Thu) is Jan 1 2026, which is in 2026.
      // That means this week belongs to week 1 of 2026.
      const result = getWeekNumber(adapter, PlainDate.from('2025-12-29'), 1);
      expect(result).to.equal(1);
    });

    it('returns week 2 for 2025-01-08 with weekStartsOn=0 (Sun)', () => {
      // Sun-week 2: week starts Sun Jan 5 2025; midpoint Wed Jan 8 is in 2025 => week 2.
      const result = getWeekNumber(adapter, wednesdayPlainDate, 0);
      expect(result).to.equal(2);
    });

    it('returns week 48 for 2012-11-23 with weekStartsOn=5 (Fri)', () => {
      // Fri-week 1 of 2012 starts on Friday, December 30th, 2011, and holds January 4th.
      const result = getWeekNumber(adapter, PlainDate.from('2012-11-23'), 5);
      expect(result).to.equal(48);
    });
  });

  describe('runtime guards', () => {
    it('getPlainDateWeekStart throws in dev when weekStartsOn is out of range', () => {
      expect(() => getPlainDateWeekStart(adapter, wednesdayPlainDate, 7 as any)).to.throw(
        /weekStartsOn/,
      );
    });

    it('getPlainDateWeekStart throws in dev when weekStartsOn is a float', () => {
      expect(() => getPlainDateWeekStart(adapter, wednesdayPlainDate, 1.5 as any)).to.throw(
        /weekStartsOn/,
      );
    });
  });
});
