import { describe, it, expect } from 'vitest';
import { EventBuilder } from 'test/utils/scheduler';
import { BaseTemporal } from './base-temporal';
import {
  allDayBoundToEventString,
  getAllDayDayCount,
  getOccurrenceEnd,
  getPlainDateWeekStart,
  getUntilReferenceString,
  getWeekNumber,
  untilToEventString,
} from './date-utils';
import { toEpochMs } from './plain-date-utils/timeZone';

const wednesdayPlainDate = BaseTemporal.PlainDate.from('2025-01-08');

describe('date-utils', () => {
  describe('allDayBoundToEventString', () => {
    it('should write an all-day bound as its date in the timezone', () => {
      expect(allDayBoundToEventString(Date.UTC(2025, 6, 4), 'Asia/Tokyo')).to.equal('2025-07-04');
      expect(allDayBoundToEventString(Date.UTC(2025, 6, 4), 'America/New_York')).to.equal(
        '2025-07-03',
      );
    });
  });

  describe('getAllDayDayCount', () => {
    it('should count the days of an all-day model', () => {
      const model = EventBuilder.new().span('2025-07-04', '2025-07-07', { allDay: true }).build();
      expect(getAllDayDayCount({ modelInBuiltInFormat: model })).to.equal(3);
    });
  });

  describe('getOccurrenceEnd', () => {
    it('should end an all-day occurrence after its day count on the wall clock', () => {
      // Europe/Paris springs forward on March 29th, 2026: two days from March 28th last 47 hours.
      const event = EventBuilder.new()
        .span('2026-03-28', '2026-03-30', { allDay: true })
        .withDisplayTimezone('Europe/Paris')
        .toProcessed();
      const occurrenceStart = toEpochMs(BaseTemporal.PlainDate.from('2026-03-28'), 'Europe/Paris');
      const end = getOccurrenceEnd({ event, occurrenceStart, displayTimezone: 'Europe/Paris' });
      expect(new Date(end).toISOString()).to.equal('2026-03-29T22:00:00.000Z'); // March 30th 00:00
    });

    it('should end an all-day occurrence starting on a day without midnight at the start of the next day', () => {
      // America/Havana springs forward at midnight on March 9th, 2025: that day starts at 01:00.
      const event = EventBuilder.new()
        .span('2025-03-09', '2025-03-10', { allDay: true })
        .withDisplayTimezone('America/Havana')
        .toProcessed();
      const occurrenceStart = toEpochMs(
        BaseTemporal.PlainDate.from('2025-03-09'),
        'America/Havana',
      );
      const end = getOccurrenceEnd({ event, occurrenceStart, displayTimezone: 'America/Havana' });
      expect(end).to.equal(toEpochMs(BaseTemporal.PlainDate.from('2025-03-10'), 'America/Havana'));
    });

    it('should keep the duration of a timed occurrence', () => {
      const event = EventBuilder.new().singleDay('2025-07-04T09:00:00Z', 90).toProcessed();
      const occurrenceStart = Date.UTC(2025, 6, 11, 9);
      expect(getOccurrenceEnd({ event, occurrenceStart, displayTimezone: 'UTC' })).to.equal(
        Date.UTC(2025, 6, 11, 10, 30),
      );
    });
  });

  describe('untilToEventString', () => {
    it.each([
      ['2025-01-01', '2025-01-12'],
      ['2025-01-01T09:00:00', '2025-01-12T23:59:59'],
      ['2025-01-01T08:00:00Z', '2025-01-12T22:59:59.999Z'],
    ])('should write a plain date covering its whole day after %s', (original, expected) => {
      expect(
        untilToEventString(BaseTemporal.PlainDate.from('2025-01-12'), original, 'Europe/Paris'),
      ).to.equal(expected);
    });

    it.each([
      ['2025-01-01', '2025-01-12T09:15:30'],
      ['2025-01-01T09:00:00', '2025-01-12T09:15:30'],
      ['2025-01-01T08:00:00Z', '2025-01-12T08:15:30.000Z'],
    ])('should write a plain date-time with its time after %s', (original, expected) => {
      expect(
        untilToEventString(
          BaseTemporal.PlainDateTime.from('2025-01-12T09:15:30'),
          original,
          'Europe/Paris',
        ),
      ).to.equal(expected);
    });

    it('should end a plain date on the later 23:59:59.999 when a DST transition repeats its last hour', () => {
      // America/Santiago falls back from 00:00 -03:00 to 23:00 -04:00 on April 6th, 2024.
      expect(
        untilToEventString(
          BaseTemporal.PlainDate.from('2024-04-06'),
          '2024-04-01T09:00:00Z',
          'America/Santiago',
        ),
      ).to.equal('2024-04-07T03:59:59.999Z');
    });
  });

  describe('getUntilReferenceString', () => {
    const event = {
      id: 'event',
      title: 'Event',
      start: '2025-01-01T09:00:00',
      end: '2025-01-01T10:00:00',
    };

    it.each([
      [{ freq: 'DAILY' as const, until: '2025-01-10T08:00:00Z' }, '2025-01-10T08:00:00Z'],
      [{ freq: 'DAILY' as const }, '2025-01-01T09:00:00'],
      ['FREQ=DAILY;UNTIL=20250110', '2025-01-10'],
      ['FREQ=DAILY;UNTIL=20250110T080000Z;INTERVAL=2', '2025-01-10T08:00:00Z'],
      ['FREQ=DAILY;COUNT=3', '2025-01-01T09:00:00'],
    ])('should read the format of the UNTIL of %j', (rrule, expected) => {
      expect(getUntilReferenceString({ ...event, rrule })).to.equal(expected);
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
