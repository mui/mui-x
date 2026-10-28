import { describe, it, expect } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { getPlainDateWeekStart, getWeekNumber } from './date-utils';
import { normalizeAllDayBounds } from './plain-date-utils/adapter';
import { BaseTemporal } from './base-temporal';

const wednesdayPlainDate = BaseTemporal.PlainDate.from('2025-01-08');

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
    it.each([
      { weekStartsOn: 7, expected: '2025-01-05' }, // Sunday
      { weekStartsOn: 1, expected: '2025-01-06' }, // Monday
      { weekStartsOn: 6, expected: '2025-01-04' }, // Saturday
    ] as const)(
      'returns $expected for Wednesday, January 8, 2025 when weekStartsOn is $weekStartsOn',
      ({ weekStartsOn, expected }) => {
        expect(getPlainDateWeekStart(wednesdayPlainDate, weekStartsOn)).toEqualPlainDate(expected);
      },
    );
  });

  describe('getWeekNumber', () => {
    it('returns the ISO week number with weeks starting on Monday and 4 minimal days', () => {
      // ISO week 2 of 2025: Monday, January 6th to Sunday, January 12th.
      expect(getWeekNumber(wednesdayPlainDate, { firstDay: 1, minimalDays: 4 })).to.equal(2);
      // Wednesday, January 1st, 2025 is in the week of Monday, December 30th, 2024, whose
      // Thursday is in 2025.
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2025-01-01'), { firstDay: 1, minimalDays: 4 }),
      ).to.equal(1);
      // Monday, December 29th, 2025 starts a week whose Thursday is in 2026.
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2025-12-29'), { firstDay: 1, minimalDays: 4 }),
      ).to.equal(1);
      // Friday, January 1st, 2027 is in the week of Monday, December 28th, 2026, whose Thursday is
      // in 2026.
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2027-01-01'), { firstDay: 1, minimalDays: 4 }),
      ).to.equal(53);
    });

    it('starts the first week of a year on the week of January 1 with 1 minimal day', () => {
      // The weeks of the United States start on Sunday, and January 1st is in their first week.
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2027-01-01'), { firstDay: 7, minimalDays: 1 }),
      ).to.equal(1);
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2026-12-26'), { firstDay: 7, minimalDays: 1 }),
      ).to.equal(52);
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2026-12-27'), { firstDay: 7, minimalDays: 1 }),
      ).to.equal(1);
      // Sunday, January 5th, 2025 starts the second week of 2025.
      expect(getWeekNumber(wednesdayPlainDate, { firstDay: 7, minimalDays: 1 })).to.equal(2);
    });

    it('keeps the first week of the year when the weeks start on another day', () => {
      // The first week of the United States holds January 1st, whatever day the weeks start on.
      const mondayWeekInfo = { firstDay: 1, minimalDays: 1 } as const;
      expect(getWeekNumber(BaseTemporal.PlainDate.from('2026-12-27'), mondayWeekInfo)).to.equal(52);
      expect(getWeekNumber(BaseTemporal.PlainDate.from('2026-12-28'), mondayWeekInfo)).to.equal(1);
      expect(getWeekNumber(BaseTemporal.PlainDate.from('2027-01-01'), mondayWeekInfo)).to.equal(1);
      const saturdayWeekInfo = { firstDay: 6, minimalDays: 1 } as const;
      expect(getWeekNumber(BaseTemporal.PlainDate.from('2026-12-25'), saturdayWeekInfo)).to.equal(
        52,
      );
      expect(getWeekNumber(BaseTemporal.PlainDate.from('2026-12-26'), saturdayWeekInfo)).to.equal(
        1,
      );
    });

    it('returns week 48 for 2012-11-23 with weekStartsOn=5 (Fri)', () => {
      // Fri-week 1 of 2012 starts on Friday, December 30th, 2011, and holds January 4th.
      expect(
        getWeekNumber(BaseTemporal.PlainDate.from('2012-11-23'), { firstDay: 5, minimalDays: 4 }),
      ).to.equal(48);
    });
  });

  describe('runtime guards', () => {
    it.each([0, 8, 1.5])(
      'getPlainDateWeekStart throws in dev when weekStartsOn is %s',
      (weekStartsOn) => {
        expect(() => getPlainDateWeekStart(wednesdayPlainDate, weekStartsOn as any)).to.throw(
          /weekStartsOn must be an integer between 1 \(Monday\) and 7 \(Sunday\)/,
        );
      },
    );
  });
});
