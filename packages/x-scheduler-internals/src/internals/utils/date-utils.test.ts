import { describe, it, expect } from 'vitest';
import { createDate } from 'test/utils/scheduler';
import { BaseTemporal } from './base-temporal';
import {
  createUntilFromTimestamp,
  getPlainDateWeekStart,
  getWeekNumber,
  untilToEventString,
} from './date-utils';
import { normalizeAllDayBounds } from './plain-date-utils/date';
import { toPlainDateTime } from './plain-date-utils/timeZone';

const wednesdayPlainDate = BaseTemporal.PlainDate.from('2025-01-08');

describe('date-utils', () => {
  describe('normalizeAllDayBounds', () => {
    const start = createDate('2025-01-08T09:00:00').getTime();
    const end = createDate('2025-01-08T18:00:00').getTime();
    const read = (bounds: { start: number; end: number }) => [
      toPlainDateTime(bounds.start, 'default').toString(),
      toPlainDateTime(bounds.end, 'default').toString(),
    ];

    it('returns the bounds unchanged when allDay is false', () => {
      expect(normalizeAllDayBounds(start, end, false, 'default')).to.deep.equal({ start, end });
    });

    it('returns the bounds unchanged when allDay is undefined', () => {
      expect(normalizeAllDayBounds(start, end, undefined, 'default')).to.deep.equal({ start, end });
    });

    it('snaps an all-day event to the whole day', () => {
      expect(read(normalizeAllDayBounds(start, end, true, 'default'))).to.deep.equal([
        '2025-01-08T00:00:00',
        '2025-01-09T00:00:00',
      ]);
    });

    it('preserves the span when flattening a multi-day all-day event', () => {
      const multiDayEnd = createDate('2025-01-10T18:00:00').getTime();
      expect(read(normalizeAllDayBounds(start, multiDayEnd, true, 'default'))).to.deep.equal([
        '2025-01-08T00:00:00',
        '2025-01-11T00:00:00',
      ]);
    });
  });

  describe('normalizeAllDayBounds across DST transitions', () => {
    it('should end at the next midnight when a DST transition repeats the last hour', () => {
      // America/Santiago falls back from 00:00 -03:00 to 23:00 -04:00 on April 6th, 2024.
      const day = createDate('2024-04-06T12:00:00', 'America/Santiago').getTime();
      const result = normalizeAllDayBounds(day, day, true, 'America/Santiago');
      expect(new Date(result.start).toISOString()).to.equal('2024-04-06T03:00:00.000Z');
      expect(new Date(result.end).toISOString()).to.equal('2024-04-07T04:00:00.000Z');
    });
  });

  describe('untilToEventString', () => {
    it.each([
      ['2025-01-01', '2025-01-12'],
      ['2025-01-01T09:00:00', '2025-01-12T23:59:59'],
      ['2025-01-01T08:00:00Z', '2025-01-12T22:59:59.999Z'],
    ])('should preserve the format of an all-day UNTIL after %s', (original, expected) => {
      expect(
        untilToEventString(BaseTemporal.PlainDate.from('2025-01-12'), original, 'Europe/Paris'),
      ).to.equal(expected);
    });

    it('should preserve the exact time and precision of a timed UNTIL', () => {
      const until = BaseTemporal.PlainDateTime.from('2025-01-12T09:15:30.123');
      expect(untilToEventString(until, '2025-01-01T09:00:00', 'Europe/Paris')).to.equal(
        '2025-01-12T09:15:30.123',
      );
      expect(untilToEventString(until, '2025-01-01T08:00:00Z', 'Europe/Paris')).to.equal(
        '2025-01-12T08:15:30.123Z',
      );
    });

    it('should keep the time of a timed UNTIL after a date-only UNTIL', () => {
      expect(
        untilToEventString(
          BaseTemporal.PlainDateTime.from('2025-01-04T23:59:59.999'),
          '2025-01-10',
          'UTC',
        ),
      ).to.equal('2025-01-04T23:59:59.999');
      expect(
        untilToEventString(
          BaseTemporal.PlainDateTime.from('2025-01-04T00:00'),
          '2025-01-10',
          'UTC',
        ),
      ).to.equal('2025-01-04');
    });

    it('should save the later end of a day whose last hour repeats', () => {
      expect(
        untilToEventString(
          BaseTemporal.PlainDateTime.from('2024-04-06T23:59:59.999'),
          '2024-04-01T09:00:00Z',
          'America/Santiago',
        ),
      ).to.equal('2024-04-07T03:59:59.999Z');
    });

    it.each([
      // Santiago repeats 23:00-23:59 on April 6th, 2024: the first end of the day.
      ['2024-04-07T02:59:59.999Z', 'America/Santiago', '2024-04-01T09:00:00Z'],
      // Paris repeats 02:00-02:59 on October 26th, 2025: the second 02:30.
      ['2025-10-26T01:30:00.000Z', 'Europe/Paris', '2025-10-01T09:00:00'],
      // Havana repeats 00:00-00:59 on November 2nd, 2025: the second midnight.
      ['2025-11-02T05:00:00.000Z', 'America/Havana', '2025-10-01'],
    ])('should keep the instant %s of a timed UNTIL read in %s', (iso, timezone, original) => {
      const until = createUntilFromTimestamp(Date.parse(iso), timezone);
      expect(untilToEventString(until, original, timezone)).to.equal(iso);
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
