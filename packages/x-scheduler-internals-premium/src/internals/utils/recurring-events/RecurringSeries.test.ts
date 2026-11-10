import { createDate } from 'test/utils/scheduler';
import type {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
  TemporalTimezone,
} from '@mui/x-scheduler-internals/models';
import { toPlainDate } from '@mui/x-scheduler-internals/internals';
import { describe, it, expect } from 'vitest';
import { RecurringSeries } from './RecurringSeries';

/**
 * The DTSTART parameters of a series starting at `start`, a wall-clock time in `timezone`.
 */
function seriesStart(start: string, timezone: TemporalTimezone) {
  return { start: createDate(start, timezone).getTime(), timezone };
}

/**
 * The number of occurrences of a series with `count` occurrences that remain after `date`, included.
 */
function countRemaining(
  rule: SchedulerProcessedEventRecurrenceRule,
  start: string,
  date: string,
  count: number,
  timezone: TemporalTimezone = 'UTC',
) {
  const series = new RecurringSeries({
    rule: { ...rule, count },
    ...seriesStart(start, timezone),
  });
  const datePlainDate = toPlainDate(createDate(date, timezone).getTime(), timezone);
  return count - series.countOccurrencesBefore(datePlainDate.add({ days: 1 }));
}

/**
 * A series starting at `start`, with its dates in UTC.
 */
function createSeries(
  rule: SchedulerProcessedEventRecurrenceRule,
  start: string,
  exDates?: string[],
) {
  return new RecurringSeries({
    rule,
    ...seriesStart(start, 'UTC'),
    exDates: exDates?.map((exDate) => createDate(exDate, 'UTC')),
  });
}

function getOccurrenceDays(
  rule: SchedulerProcessedEventRecurrenceRule,
  start: string,
  from: string,
  to: string,
  exDates?: string[],
) {
  const series = createSeries(rule, start, exDates);
  const fromPlainDate = toPlainDate(createDate(from, 'UTC').getTime(), 'UTC');
  const lastPlainDate = toPlainDate(createDate(to, 'UTC').getTime(), 'UTC');
  return series.getOccurrenceDays(fromPlainDate, lastPlainDate).map((day) => day.toString());
}

describe('recurring-events/RecurringSeries', () => {
  describe('getOccurrenceDays', () => {
    it('should return the nth weekday of each month, counted from the start or the end', () => {
      const july = ['2025-07-01T09:00:00', '2025-07-01T00:00:00', '2025-07-31T00:00:00'] as const;
      expect(getOccurrenceDays({ freq: 'MONTHLY', byDay: ['2TU'] }, ...july)).to.deep.equal([
        '2025-07-08',
      ]);
      expect(getOccurrenceDays({ freq: 'MONTHLY', byDay: ['-1FR'] }, ...july)).to.deep.equal([
        '2025-07-25',
      ]);
      expect(getOccurrenceDays({ freq: 'MONTHLY', byDay: ['-2WE'] }, ...july)).to.deep.equal([
        '2025-07-23',
      ]);
      // June 2025 has 5 Mondays: the 5th from the end is the 2nd.
      expect(
        getOccurrenceDays(
          { freq: 'MONTHLY', byDay: ['-5MO'] },
          '2025-06-01T09:00:00',
          '2025-06-01T00:00:00',
          '2025-06-30T00:00:00',
        ),
      ).to.deep.equal(['2025-06-02']);
      // February 2025 has 4 Fridays.
      expect(
        getOccurrenceDays(
          { freq: 'MONTHLY', byDay: ['5FR'] },
          '2025-02-01T09:00:00',
          '2025-02-01T00:00:00',
          '2025-02-28T00:00:00',
        ),
      ).to.deep.equal([]);
    });

    it('should count the excluded occurrences toward COUNT', () => {
      expect(
        getOccurrenceDays(
          { freq: 'DAILY', count: 3 },
          '2025-01-01T09:00:00',
          '2025-01-01T00:00:00',
          '2025-01-10T00:00:00',
          ['2025-01-02T09:00:00'],
        ),
      ).to.deep.equal(['2025-01-01', '2025-01-03']);
    });

    it('should start after the first period of a daily or weekly rule with an interval', () => {
      // January 1st, 4th, 7th and 10th.
      expect(
        getOccurrenceDays(
          { freq: 'DAILY', interval: 3, count: 4 },
          '2025-01-01T09:00:00',
          '2025-01-05T00:00:00',
          '2025-01-31T00:00:00',
        ),
      ).to.deep.equal(['2025-01-07', '2025-01-10']);
      // Wednesday 8th and Friday 10th, then Monday 20th to Friday 24th. The range starts in the week
      // of the 13th, which the rule skips.
      expect(
        getOccurrenceDays(
          { freq: 'WEEKLY', interval: 2, byDay: ['MO', 'WE', 'FR'], count: 5 },
          '2025-01-08T09:00:00',
          '2025-01-13T00:00:00',
          '2025-02-28T00:00:00',
        ),
      ).to.deep.equal(['2025-01-20', '2025-01-22', '2025-01-24']);
    });

    it('should count a day repeated in BYDAY once', () => {
      // Monday 6th, Wednesday 8th and Monday 13th.
      expect(
        getOccurrenceDays(
          { freq: 'WEEKLY', byDay: ['MO', 'MO', 'WE'], count: 3 },
          '2025-01-06T09:00:00',
          '2025-01-07T00:00:00',
          '2025-01-31T00:00:00',
        ),
      ).to.deep.equal(['2025-01-08', '2025-01-13']);
    });

    it('should use the first day of a monthly rule with several BYMONTHDAY values', () => {
      expect(
        getOccurrenceDays(
          { freq: 'MONTHLY', byMonthDay: [1, 15] },
          '2025-01-01T09:00:00',
          '2025-01-01T00:00:00',
          '2025-02-28T00:00:00',
        ),
      ).to.deep.equal(['2025-01-01', '2025-02-01']);
    });
  });

  describe('UNTIL and exDates after 9999', () => {
    it('should read them in a timezone east of UTC', () => {
      // December 31st, 9999, a common "no end date", is already January 1st, 10000 in Tokyo.
      const lastInstant = createDate('9999-12-31T23:59:59Z');
      const getLastDays = (timezone: TemporalTimezone, exDates: TemporalSupportedObject[]) => {
        const series = new RecurringSeries({
          rule: { freq: 'DAILY', until: lastInstant },
          start: createDate('2026-01-05T09:00:00Z').getTime(),
          timezone,
          exDates,
        });
        return series
          .getOccurrenceDays(
            toPlainDate(createDate('9999-12-31T00:00:00', 'UTC').getTime(), 'UTC'),
            toPlainDate(createDate('+010000-01-02T00:00:00', 'UTC').getTime(), 'UTC'),
          )
          .map((day) => day.toString());
      };

      expect(getLastDays('Asia/Tokyo', [])).to.deep.equal(['9999-12-31', '+010000-01-01']);
      expect(getLastDays('Asia/Tokyo', [lastInstant])).to.deep.equal(['9999-12-31']);
      expect(getLastDays('UTC', [])).to.deep.equal(['9999-12-31']);
    });
  });

  describe('last supported day', () => {
    it('should end every frequency on September 13, 275760', () => {
      const lastYear = ['+275760-01-01T00:00:00', '+275760-09-13T00:00:00'] as const;
      expect(
        getOccurrenceDays(
          { freq: 'YEARLY' },
          '+275759-06-01T09:00:00',
          '+275759-01-01T00:00:00',
          lastYear[1],
        ),
      ).to.deep.equal(['+275759-06-01', '+275760-06-01']);
      expect(
        getOccurrenceDays({ freq: 'DAILY', interval: 300 }, '+275760-06-01T09:00:00', ...lastYear),
      ).to.deep.equal(['+275760-06-01']);
      expect(
        getOccurrenceDays({ freq: 'MONTHLY', interval: 5 }, '+275760-08-15T09:00:00', ...lastYear),
      ).to.deep.equal(['+275760-08-15']);
      // The month after the first one is too far to compute.
      expect(
        getOccurrenceDays(
          { freq: 'MONTHLY', interval: Number.MAX_VALUE },
          '+275760-08-15T09:00:00',
          ...lastYear,
        ),
      ).to.deep.equal(['+275760-08-15']);
    });

    it('should return the first period of a rule whose next period is too far to compute', () => {
      const january = ['2025-01-01T00:00:00', '2025-01-31T00:00:00'] as const;
      expect(
        getOccurrenceDays(
          { freq: 'WEEKLY', byDay: ['MO', 'WE'], interval: Number.MAX_VALUE },
          '2025-01-06T09:00:00',
          ...january,
        ),
      ).to.deep.equal(['2025-01-06', '2025-01-08']);
      expect(
        getOccurrenceDays(
          { freq: 'YEARLY', interval: Number.MAX_VALUE },
          '2025-01-06T09:00:00',
          ...january,
        ),
      ).to.deep.equal(['2025-01-06']);
    });

    it('should end the series when its next day of the week or month is after September 13, 275760', () => {
      // September 13th, 275760 is a Saturday, so the Sunday of its week is after it.
      expect(
        getOccurrenceDays(
          { freq: 'WEEKLY', byDay: ['SU'] },
          '+275760-09-07T09:00:00',
          '+275760-09-08T00:00:00',
          '+275760-09-13T00:00:00',
        ),
      ).to.deep.equal([]);
      // The 20th and the 3rd Sunday of September 275760 are after the 13th.
      const september = ['+275760-09-01T00:00:00', '+275760-09-13T00:00:00'] as const;
      expect(
        getOccurrenceDays({ freq: 'MONTHLY' }, '+275760-08-20T09:00:00', ...september),
      ).to.deep.equal([]);
      expect(
        getOccurrenceDays(
          { freq: 'MONTHLY', byDay: ['3SU'] },
          '+275760-08-17T09:00:00',
          ...september,
        ),
      ).to.deep.equal([]);
      expect(
        getOccurrenceDays({ freq: 'YEARLY' }, '+275759-09-20T09:00:00', ...september),
      ).to.deep.equal([]);
      // September 275760 has no 5th Sunday before the 13th, and August 31st is the last one.
      expect(
        createSeries({ freq: 'MONTHLY', byDay: ['5SU'], count: 3 }, '+275760-08-31T09:00:00', [
          '+275760-08-31T09:00:00',
        ]).hasOccurrence(),
      ).to.equal(false);
      // The first Sunday from Monday, September 8th, 275760 is after the 13th.
      expect(
        createSeries(
          { freq: 'WEEKLY', byDay: ['SU'], count: 1 },
          '+275760-09-08T09:00:00',
        ).hasOccurrence(),
      ).to.equal(false);
      // The first occurrence is excluded, and the second one is after September 13th, 275760.
      expect(
        createSeries({ freq: 'DAILY', interval: 100_000_000, count: 2 }, '2025-01-01T09:00:00', [
          '2025-01-01T09:00:00',
        ]).hasOccurrence(),
      ).to.equal(false);
    });
  });

  describe('hasOccurrenceBefore', () => {
    it('should ignore the excluded occurrences', () => {
      const series = new RecurringSeries({
        rule: { freq: 'WEEKLY' },
        ...seriesStart('2025-01-06T09:00:00', 'UTC'),
        exDates: [createDate('2025-01-06T09:00:00', 'UTC')],
      });
      const day = (date: string) => toPlainDate(createDate(date, 'UTC').getTime(), 'UTC');
      expect(series.hasOccurrenceBefore(day('2025-01-13T00:00:00'))).to.equal(false);
      expect(series.hasOccurrenceBefore(day('2025-01-14T00:00:00'))).to.equal(true);
    });
  });

  describe('hasOccurrence', () => {
    it('should find an occurrence that is years away', () => {
      // February 29th: excluding 2024 leaves 2028.
      const series = new RecurringSeries({
        rule: { freq: 'YEARLY', count: 2 },
        ...seriesStart('2024-02-29T09:00:00', 'UTC'),
        exDates: [createDate('2024-02-29T09:00:00', 'UTC')],
      });
      expect(series.hasOccurrence()).to.equal(true);
    });

    it('should return false when every occurrence is excluded', () => {
      const exDates = ['2025-01-01T09:00:00', '2025-01-02T09:00:00'];
      expect(
        createSeries({ freq: 'DAILY', count: 2 }, '2025-01-01T09:00:00', exDates).hasOccurrence(),
      ).to.equal(false);
      expect(
        createSeries(
          { freq: 'DAILY', until: createDate('2025-01-02T09:00:00', 'UTC') },
          '2025-01-01T09:00:00',
          exDates,
        ).hasOccurrence(),
      ).to.equal(false);
    });
  });

  describe('countOccurrencesBefore: DAILY', () => {
    const createRule = (interval = 1): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'DAILY',
      interval,
    });

    it('should return count when target is before start', () => {
      expect(countRemaining(createRule(), '2025-03-10', '2025-03-09T23:59:59', 100)).to.equal(100);
    });

    it('should return count when target is before start with an interval of millennia', () => {
      expect(
        countRemaining(createRule(1_000_000), '2025-03-10', '2025-03-09T23:59:59', 100),
      ).to.equal(100);
    });

    it('should return the remaining occurrences after an inclusive day span (interval=1)', () => {
      expect(
        countRemaining(
          createRule(),
          '2025-01-01',
          '2025-01-05T23:59:59', // 1,2,3,4,5 = 5 occurrences
          100,
        ),
      ).to.equal(95); // 100 - 5
    });

    it('should return the remaining occurrences of every other day, inclusive (interval=2)', () => {
      expect(
        countRemaining(
          createRule(2),
          '2025-01-01',
          '2025-01-11T00:00:00', // Days: 1,3,5,7,9,11 => 6 occurrences
          100,
        ),
      ).to.equal(94); // 100 - 6
    });

    it('should do not count a day the timezone of the series skips', () => {
      // Pacific/Apia skipped December 30th, 2011: Dec 29 and 31 are before January 1st.
      expect(
        countRemaining(
          createRule(),
          '2011-12-29T09:00:00',
          '2011-12-31T09:00:00',
          4,
          'Pacific/Apia',
        ),
      ).to.equal(2);
    });

    it('should return 0 when count is lower than the number of occurrences', () => {
      expect(
        countRemaining(
          createRule(),
          '2025-01-01',
          '2025-01-10T23:59:59', // 10 occurrences
          5,
        ),
      ).to.equal(0); // 5 - 10 = -5, clamped to 0
    });

    it('should not count the days after UNTIL', () => {
      const series = createSeries(
        { freq: 'DAILY', until: createDate('2025-01-05T09:00:00', 'UTC') },
        '2025-01-01T09:00:00',
      );
      expect(
        series.countOccurrencesBefore(
          toPlainDate(createDate('2025-01-10T00:00:00', 'UTC').getTime(), 'UTC'),
        ),
      ).to.equal(5);
    });
  });

  describe('countOccurrencesBefore: WEEKLY', () => {
    const createRule = (
      by: RecurringEventWeekDayCode[],
      interval = 1,
    ): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'WEEKLY',
      interval,
      byDay: by,
    });

    it('should return count when target date is before series start', () => {
      expect(
        countRemaining(
          createRule(['TU']),
          '2025-06-10',
          '2025-06-09T23:59:59', // Mon before start,
          100,
        ),
      ).to.equal(100);
    });

    it('should return remaining after first occurrence when target is same day', () => {
      expect(
        countRemaining(
          createRule(['TU']),
          '2025-06-10', // Tuesday
          '2025-06-10T23:59:59',
          100,
        ),
      ).to.equal(99); // 100 - 1
    });

    it('should return remaining for a single weekday across several weeks (interval=1)', () => {
      expect(
        countRemaining(
          createRule(['TU']),
          '2025-06-10', // Tuesday
          '2025-07-08T12:00:00', // 5 Tuesdays inclusive
          100,
        ),
      ).to.equal(95); // 100 - 5
    });

    it('should return remaining for multiple days per week (e.g. Mon & Wed) up to target inclusive', () => {
      // Occurrences: Mon(2), Wed(4), Mon(9), Wed(11), Mon(16), Wed(18) = 6
      expect(
        countRemaining(
          createRule(['MO', 'WE']),
          '2025-06-02', // Monday,
          '2025-06-18T23:59:59', // includes weeks of Jun 2,9,16
          100,
        ),
      ).to.equal(94); // 100 - 6
    });

    it('should respect interval > 1 (every 2 weeks)', () => {
      expect(
        countRemaining(
          createRule(['TU'], 2),
          '2025-06-10', // Tuesday,
          '2025-07-22T12:00:00',
          100,
        ),
      ).to.equal(96); // 100 - 4
    });

    it('should do not count weekday in target week occurring after target day', () => {
      // Occurrences counted: Jun 10, Jun 17 => 2 (Jun 24 excluded)
      expect(
        countRemaining(
          createRule(['TU']),
          '2025-06-10', // Tuesday
          '2025-06-23T12:00:00', // Monday of week containing Tue 24
          100,
        ),
      ).to.equal(98); // 100 - 2
    });

    it('should handle unordered byDay array', () => {
      expect(
        countRemaining(
          createRule(['FR', 'MO']),
          '2025-06-02', // Monday,
          '2025-06-13T23:59:59', // Mon 2, Fri 6, Mon 9, Fri 13 => 4
          100,
        ),
      ).to.equal(96); // 100 - 4
    });

    it('should return 0 when count is lower than the number of occurrences', () => {
      expect(
        countRemaining(
          createRule(['TU']),
          '2025-06-10', // Tuesday
          '2025-07-08T12:00:00', // 5 Tuesdays inclusive
          3,
        ),
      ).to.equal(0); // 3 - 5 = -2, clamped to 0
    });
  });

  describe('countOccurrencesBefore: MONTHLY', () => {
    describe('byMonthDay', () => {
      const createRule = (day: number, interval = 1): SchedulerProcessedEventRecurrenceRule => ({
        freq: 'MONTHLY',
        interval,
        byMonthDay: [day],
      });

      it('should return count when target month is before start month', () => {
        expect(countRemaining(createRule(10), '2025-06-10', '2025-05-31T23:59:59', 100)).to.equal(
          100,
        );
      });

      it('should return count when target is earlier in the start month', () => {
        expect(countRemaining(createRule(10), '2025-06-10', '2025-06-09T23:59:59', 100)).to.equal(
          100,
        );
      });

      it('should return remaining after byMonthDay occurrences up to inclusive target (interval=1)', () => {
        expect(
          countRemaining(
            createRule(10),
            '2025-01-10',
            '2025-04-10T12:00:00', // Jan, Feb, Mar, Apr = 4
            100,
          ),
        ).to.equal(96); // 100 - 4
      });

      it('should respect interval > 1 (e.g. every 2 months)', () => {
        expect(
          countRemaining(
            createRule(10, 2),
            '2025-01-10',
            '2025-11-10T09:00:00', // Jan, Mar, May, Jul, Sep, Nov = 6
            100,
          ),
        ).to.equal(94); // 100 - 6
      });

      it('should skip months lacking the day (e.g. day 31)', () => {
        expect(
          countRemaining(
            createRule(31),
            '2025-01-31',
            '2025-05-31T09:00:00', // Jan(31), Mar(31), May(31) = 3
            100,
          ),
        ).to.equal(97); // 100 - 3
      });

      it('should do not count occurrence after target day in same month', () => {
        expect(
          countRemaining(
            createRule(20),
            '2025-01-20',
            '2025-02-15T09:00:00', // Feb 20 not reached = 1
            100,
          ),
        ).to.equal(99); // 100 - 1
      });

      it('should return 0 when count is lower than the number of occurrences', () => {
        expect(
          countRemaining(
            createRule(10),
            '2025-01-10',
            '2025-06-10T12:00:00', // Jan–Jun = 6 occurrences
            4,
          ),
        ).to.equal(0); // 4 - 6 = -2, clamped to 0
      });
    });

    describe('ByDay (ordinal: Nth / last weekday)', () => {
      const createByDayRule = (
        byDay: RecurringEventByDayValue[],
        interval = 1,
      ): SchedulerProcessedEventRecurrenceRule => ({
        freq: 'MONTHLY',
        interval,
        byDay,
      });

      it('should count 2nd Tuesday from July to October 2025 (interval=1)', () => {
        // Jul 8, Aug 12, Sep 9, Oct 14 => 4
        expect(
          countRemaining(
            createByDayRule(['2TU']),
            '2025-07-01', // before 2nd Tuesday (Jul 8)
            '2025-10-31T23:59:59',
            100,
          ),
        ).to.equal(96); // 100 - 4
      });

      it('should respect interval > 1 (e.g., 2nd Tuesday every 2 months)', () => {
        // Jul 8, Sep 9 => 2
        expect(
          countRemaining(
            createByDayRule(['2TU'], 2),
            '2025-07-01', // before 2nd Tuesday (Jul 8)
            '2025-10-31T23:59:59',
            100,
          ),
        ).to.equal(98); // 100 - 2
      });

      it("should skip the start month if DTSTART is after that month's occurrence (2TU)", () => {
        // July skipped, Aug 12 counted => 1
        expect(
          countRemaining(
            createByDayRule(['2TU']),
            '2025-07-20', // after Jul 8
            '2025-08-31T23:59:59',
            100,
          ),
        ).to.equal(99); // 100 - 1
      });

      it('should count last Friday (-1FR) from July to October 2025', () => {
        // Jul 25, Aug 29, Sep 26, Oct 31 => 4
        expect(
          countRemaining(createByDayRule(['-1FR']), '2025-07-01', '2025-10-31T23:59:59', 100),
        ).to.equal(96); // 100 - 4
      });

      it('should count 2nd last Wednesday (-2WE) across months (Jul–Sep 2025)', () => {
        // Jul 23, Aug 20, Sep 17 => 3
        expect(
          countRemaining(createByDayRule(['-2WE']), '2025-07-01', '2025-09-30T23:59:59', 100),
        ).to.equal(97); // 100 - 3
      });

      it('should handle months without a 5th weekday: -5MO counts only months that have 5 Mondays', () => {
        // Jun: -5MO => Jun 2 (exists), Jul: no -5MO => skip => total 1
        expect(
          countRemaining(
            createByDayRule(['-5MO']),
            '2025-06-01', // Jun 2025 has 5 Mondays
            '2025-07-31T23:59:59',
            100,
          ),
        ).to.equal(99); // 100 - 1
      });

      it('should keep counting when the next matching month is decades away', () => {
        // February has a 5th Tuesday in 2000 and 2028 only.
        expect(
          countRemaining(
            { freq: 'MONTHLY', interval: 12, byDay: ['5TU'] },
            '2000-02-29',
            '2055-12-31T23:59:59',
            100,
          ),
        ).to.equal(98);
      });
    });
  });

  describe('countOccurrencesBefore: YEARLY', () => {
    const createRule = (interval = 1): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'YEARLY',
      interval,
    });

    it('should return count when target year is before start year', () => {
      expect(countRemaining(createRule(), '2025-06-10', '2024-12-31T23:59:59', 100)).to.equal(100);
    });

    it('should return count when target is earlier in the start year', () => {
      expect(countRemaining(createRule(), '2025-06-10', '2025-01-01T00:00:00', 100)).to.equal(100);
    });

    it('should return remaining after first occurrence when target is same calendar day', () => {
      expect(countRemaining(createRule(), '2025-03-15', '2025-03-15T23:59:59', 100)).to.equal(99); // 100 - 1
    });

    it('should return remaining for all occurrences up to inclusive target (interval=1)', () => {
      expect(
        countRemaining(
          createRule(),
          '2023-02-05',
          '2026-02-05T09:00:00', // 2023,24,25,26 => 4 occurrences
          100,
        ),
      ).to.equal(96); // 100 - 4
    });

    it('should respect interval > 1 (every 2 years)', () => {
      expect(
        countRemaining(
          createRule(2),
          '2022-07-20',
          '2030-07-20T09:00:00', // 2022,24,26,28,30 => 5 occurrences
          100,
        ),
      ).to.equal(95); // 100 - 5
    });

    it('should skip non-leap years for Feb 29 start', () => {
      expect(
        countRemaining(
          createRule(),
          '2024-02-29',
          '2032-12-31T23:59:59', // 2024, 2028, 2032 => 3 occurrences
          100,
        ),
      ).to.equal(97); // 100 - 3
    });

    it('should skip consecutive non-leap years for Feb 29 with a long interval', () => {
      // 2100, 2200 and 2300 aren't leap years: the next occurrence after 2000 is in 2400.
      expect(countRemaining(createRule(25), '2000-02-29', '2400-12-31T23:59:59', 100)).to.equal(98);
    });

    it('should return 0 when count is lower than the number of occurrences', () => {
      expect(
        countRemaining(
          createRule(),
          '2023-02-05',
          '2030-02-05T09:00:00', // 2023–2030 => 8 occurrences
          5,
        ),
      ).to.equal(0); // 5 - 8 = -3, clamped to 0
    });
  });
});
