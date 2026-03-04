import { adapter, adapterFr, EventBuilder } from 'test/utils/scheduler';
import {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import {
  getRemainingMonthlyOccurrences,
  getRemainingWeeklyOccurrences,
  getRemainingOccurrences,
  getEventDurationInDays,
  getRemainingYearlyOccurrences,
  tokenizeByDay,
  parsesByDayForWeeklyFrequency,
  nthWeekdayOfMonth,
  parsesByDayForMonthlyFrequency,
  NOT_LOCALIZED_WEEK_DAYS,
  getWeekDayCode,
  getWeekDayNumberFromCode,
  getRemainingDailyOccurrences,
} from './internal-utils';

describe('recurring-events/internal-utils', () => {
  describe('getWeekDayCode', () => {
    it('should work with fr (week starts on Monday)', () => {
      const testMonday = adapterFr.date('2025-10-20T00:00:00Z', 'default'); // Monday
      expect(getWeekDayCode(adapterFr, testMonday)).to.equal('MO');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 1))).to.equal('TU');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 2))).to.equal('WE');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 3))).to.equal('TH');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 4))).to.equal('FR');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 5))).to.equal('SA');
      expect(getWeekDayCode(adapterFr, adapterFr.addDays(testMonday, 6))).to.equal('SU');
    });

    it('should work with enUS (week starts on Sunday)', () => {
      const testMonday = adapter.date('2025-10-20T00:00:00Z', 'default'); // Monday
      expect(getWeekDayCode(adapter, testMonday)).to.equal('MO');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 1))).to.equal('TU');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 2))).to.equal('WE');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 3))).to.equal('TH');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 4))).to.equal('FR');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 5))).to.equal('SA');
      expect(getWeekDayCode(adapter, adapter.addDays(testMonday, 6))).to.equal('SU');
    });
  });

  describe('getWeekDayNumberFromCode', () => {
    it('should work with fr (week starts on Monday)', () => {
      expect(getWeekDayNumberFromCode(adapterFr, 'MO')).to.equal(1);
      expect(getWeekDayNumberFromCode(adapterFr, 'TU')).to.equal(2);
      expect(getWeekDayNumberFromCode(adapterFr, 'WE')).to.equal(3);
      expect(getWeekDayNumberFromCode(adapterFr, 'TH')).to.equal(4);
      expect(getWeekDayNumberFromCode(adapterFr, 'FR')).to.equal(5);
      expect(getWeekDayNumberFromCode(adapterFr, 'SA')).to.equal(6);
      expect(getWeekDayNumberFromCode(adapterFr, 'SU')).to.equal(7);
    });

    it('should work with enUS (week starts on Sunday)', () => {
      expect(getWeekDayNumberFromCode(adapter, 'SU')).to.equal(1);
      expect(getWeekDayNumberFromCode(adapter, 'MO')).to.equal(2);
      expect(getWeekDayNumberFromCode(adapter, 'TU')).to.equal(3);
      expect(getWeekDayNumberFromCode(adapter, 'WE')).to.equal(4);
      expect(getWeekDayNumberFromCode(adapter, 'TH')).to.equal(5);
      expect(getWeekDayNumberFromCode(adapter, 'FR')).to.equal(6);
      expect(getWeekDayNumberFromCode(adapter, 'SA')).to.equal(7);
    });
  });

  describe('getEventDurationInDays', () => {
    it('returns inclusive day count for non-allDay multi-day event', () => {
      const event = EventBuilder.new()
        .span('2025-01-01T09:00:00Z', '2025-01-03T18:00:00Z')
        .toProcessed();
      expect(getEventDurationInDays(adapter, event)).to.equal(3);
    });

    it('returns 1 for allDay event on same calendar day', () => {
      const event = EventBuilder.new().fullDay('2025-02-10Z').toProcessed();
      expect(getEventDurationInDays(adapter, event)).to.equal(1);
    });

    it('returns inclusive day count for multi-day event', () => {
      const event = EventBuilder.new().span('2025-01-01Z', '2025-01-04Z').toProcessed();
      // Jan 1,2,3,4 => 4 days
      expect(getEventDurationInDays(adapter, event)).to.equal(4);
    });

    it('handles month boundary correctly', () => {
      const event = EventBuilder.new().span('2025-01-30Z', '2025-02-02Z').toProcessed();
      // Jan 30,31, Feb 1,2 => 4 days
      expect(getEventDurationInDays(adapter, event)).to.equal(4);
    });

    it('handles leap day span', () => {
      const event = EventBuilder.new().span('2024-02-28Z', '2024-03-01Z').toProcessed();
      // Feb 28, Feb 29, Mar 1 => 3 days
      expect(getEventDurationInDays(adapter, event)).to.equal(3);
    });
  });

  describe('BYDAY parsers: tokenizeByDay / parseWeeklyByDayPlain / parseMonthlyByDayOrdinalSingle', () => {
    describe('tokenizeByDay', () => {
      it('parses plain byDay codes without ordinal', () => {
        NOT_LOCALIZED_WEEK_DAYS.forEach((code) => {
          const res = tokenizeByDay(code);
          expect(res).to.deep.equal({ ord: null, code });
        });
      });

      it('parses positive ordinals', () => {
        const cases: Array<[RecurringEventByDayValue, number, RecurringEventWeekDayCode]> = [
          ['1MO', 1, 'MO'],
          ['2TU', 2, 'TU'],
          ['3WE', 3, 'WE'],
          ['4TH', 4, 'TH'],
          ['5FR', 5, 'FR'],
        ];
        cases.forEach(([input, ord, code]) => {
          const res = tokenizeByDay(input);
          expect(res.ord).to.equal(ord);
          expect(res.code).to.equal(code);
        });
      });

      it('parses negative ordinals (-1..-5)', () => {
        const cases: Array<[RecurringEventByDayValue, number, RecurringEventWeekDayCode]> = [
          ['-1MO', -1, 'MO'],
          ['-2TU', -2, 'TU'],
          ['-3WE', -3, 'WE'],
          ['-4TH', -4, 'TH'],
          ['-5FR', -5, 'FR'],
        ];
        cases.forEach(([input, ord, code]) => {
          const res = tokenizeByDay(input);
          expect(res.ord).to.equal(ord);
          expect(res.code).to.equal(code);
        });
      });

      it('throws on invalid ordinal range or malformed strings', () => {
        const invalidInputs = [
          '0MO',
          '6MO',
          '-6FR',
          'MO2',
          '2XX',
          '',
          '12MO',
          '--1MO',
          '1SUU',
          'mo',
        ];

        invalidInputs.forEach((input) => {
          expect(() => tokenizeByDay(input as RecurringEventWeekDayCode)).to.throw();
        });
      });
    });

    describe('parseWeeklyByDayPlain', () => {
      it('returns null when ruleByDay is undefined or empty', () => {
        // ruleByDay is undefined
        expect(parsesByDayForWeeklyFrequency(undefined)).to.deep.equal(null);

        // ruleByDay is empty
        expect(parsesByDayForWeeklyFrequency([])).to.deep.equal(null);
      });

      it('accepts plain byDay codes and returns them unchanged', () => {
        const byDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['MO', 'WE', 'FR'];
        expect(parsesByDayForWeeklyFrequency(byDay)).to.deep.equal(['MO', 'WE', 'FR']);
      });

      it('throws when any ordinal is provided (e.g., 1MO, -1FR)', () => {
        const withOrdinal: SchedulerProcessedEventRecurrenceRule['byDay'] = ['1MO', '-1FR'];
        expect(() => parsesByDayForWeeklyFrequency(withOrdinal)).to.throw();
      });

      it('throws for invalid BYDAY values (e.g., XX)', () => {
        expect(() => parsesByDayForWeeklyFrequency(['XX' as any])).to.throw();
      });
    });

    describe('parseMonthlyByDayOrdinalSingle', () => {
      it('throws when ruleByDay is empty or multiple', () => {
        expect(() => parsesByDayForMonthlyFrequency([])).to.throw();
        expect(() => parsesByDayForMonthlyFrequency(['1MO', '2TU'])).to.throw();
      });

      it('parses one ordinal byDay code (e.g., 1MO, 3WE, -1FR)', () => {
        const byDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['1FR'];
        expect(parsesByDayForMonthlyFrequency(byDay)).to.deep.equal({ ord: 1, code: 'FR' });
        const negativeByDay: SchedulerProcessedEventRecurrenceRule['byDay'] = ['-1MO'];
        expect(parsesByDayForMonthlyFrequency(negativeByDay)).to.deep.equal({
          ord: -1,
          code: 'MO',
        });
      });

      it('throws when any entry lacks an ordinal (e.g., plain MO)', () => {
        const mixed: SchedulerProcessedEventRecurrenceRule['byDay'] = ['2TU', 'MO'];
        expect(() => parsesByDayForMonthlyFrequency(mixed)).to.throw();
      });
    });
  });

  describe('nthWeekdayOfMonth', () => {
    const expectYMD = (date: TemporalSupportedObject, year: number, month: number, day: number) => {
      expect(adapter.getYear(date)).to.equal(year);
      // The adapter uses 0-based months
      expect(adapter.getMonth(date)).to.equal(month - 1);
      expect(adapter.getDate(date)).to.equal(day);
    };

    it('returns the 2nd Tuesday of July 2025 (positive ordinal from start)', () => {
      // 2nd Tuesday is 8
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z', 'default'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'TU', 2);
      expectYMD(result!, 2025, 7, 8);
    });

    it('returns the last Friday of July 2025 (-1 from end)', () => {
      // Last Friday is 25
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z', 'default'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'FR', -1);
      expectYMD(result!, 2025, 7, 25);
    });

    it('returns the 2nd last Wednesday of July 2025 (-2 from end)', () => {
      // 2nd last Wednesday is 23
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z', 'default'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'WE', -2);
      expectYMD(result!, 2025, 7, 23);
    });

    it('returns null when the 5th Friday does not exist (Feb 2025)', () => {
      // Feb 2025 has only 4 Fridays
      const monthStart = adapter.startOfMonth(adapter.date('2025-02-01T00:00:00Z', 'default'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'FR', 5);
      expect(result).to.equal(null);
    });

    it('handles a month with 5 Mondays for -5 (June 2025)', () => {
      // Mondays in Jun 2025: 2, 9, 16, 23, 30 → 5th from end = first = 2
      const monthStart = adapter.startOfMonth(adapter.date('2025-06-01T00:00:00Z', 'default'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'MO', -5);
      expectYMD(result!, 2025, 6, 2);
    });
  });

  describe('getRemainingOccurrences', () => {
    it('throws an error on unknown frequency', () => {
      const badRule = { freq: 'FOO', interval: 1 } as any;
      const start = adapter.date('2025-01-01T00:00:00Z', 'default');
      const target = adapter.date('2025-01-02T00:00:00Z', 'default');
      expect(() => getRemainingOccurrences(adapter, badRule, start, target, 100)).to.throw();
    });
  });

  describe('getRemainingDailyOccurrences', () => {
    const createRule = (interval = 1): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'DAILY',
      interval,
    });

    it('returns count when target is before start', () => {
      expect(
        getRemainingDailyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2025-03-10Z', 'default'),
          date: adapter.date('2025-03-09T23:59:59Z', 'default'),
          count: 100,
        }),
      ).to.equal(100);
    });

    it('interval=1 returns remaining after inclusive day span', () => {
      expect(
        getRemainingDailyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2025-01-01Z', 'default'),
          date: adapter.date('2025-01-05T23:59:59Z', 'default'), // 1,2,3,4,5 = 5 occurrences
          count: 100,
        }),
      ).to.equal(95); // 100 - 5
    });

    it('interval=2 returns remaining after every other day inclusive', () => {
      expect(
        getRemainingDailyOccurrences({
          adapter,
          rule: createRule(2),
          seriesStartDay: adapter.date('2025-01-01Z', 'default'),
          date: adapter.date('2025-01-11T00:00:00Z', 'default'), // Days: 1,3,5,7,9,11 => 6 occurrences
          count: 100,
        }),
      ).to.equal(94); // 100 - 6
    });

    it('returns 0 when count is lower than the number of occurrences', () => {
      expect(
        getRemainingDailyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2025-01-01Z', 'default'),
          date: adapter.date('2025-01-10T23:59:59Z', 'default'), // 10 occurrences
          count: 5,
        }),
      ).to.equal(0); // 5 - 10 = -5, clamped to 0
    });
  });

  describe('getRemainingWeeklyOccurrences', () => {
    const createRule = (
      by: RecurringEventWeekDayCode[],
      interval = 1,
    ): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'WEEKLY',
      interval,
      byDay: by,
    });

    it('returns count when target date is before series start', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU']),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'),
          date: adapter.date('2025-06-09T23:59:59Z', 'default'), // Mon before start,
          count: 100,
        }),
      ).to.equal(100);
    });

    it('returns remaining after first occurrence when target is same day', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU']),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'), // Tuesday
          date: adapter.date('2025-06-10T23:59:59Z', 'default'),
          count: 100,
        }),
      ).to.equal(99); // 100 - 1
    });

    it('returns remaining for a single weekday across several weeks (interval=1)', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU']),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'), // Tuesday
          date: adapter.date('2025-07-08T12:00:00Z', 'default'), // 5 Tuesdays inclusive
          count: 100,
        }),
      ).to.equal(95); // 100 - 5
    });

    it('returns remaining for multiple days per week (e.g. Mon & Wed) up to target inclusive', () => {
      // Occurrences: Mon(2), Wed(4), Mon(9), Wed(11), Mon(16), Wed(18) = 6
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['MO', 'WE']),
          seriesStartDay: adapter.date('2025-06-02Z', 'default'), // Monday,
          date: adapter.date('2025-06-18T23:59:59Z', 'default'), // includes weeks of Jun 2,9,16
          count: 100,
        }),
      ).to.equal(94); // 100 - 6
    });

    it('respects interval > 1 (every 2 weeks)', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU'], 2),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'), // Tuesday,
          date: adapter.date('2025-07-22T12:00:00Z', 'default'),
          count: 100,
        }),
      ).to.equal(96); // 100 - 4
    });

    it('does not count weekday in target week occurring after target day', () => {
      // Occurrences counted: Jun 10, Jun 17 => 2 (Jun 24 excluded)
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU']),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'), // Tuesday
          date: adapter.date('2025-06-23T12:00:00Z', 'default'), // Monday of week containing Tue 24
          count: 100,
        }),
      ).to.equal(98); // 100 - 2
    });

    it('handles unordered byDay array', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['FR', 'MO']),
          seriesStartDay: adapter.date('2025-06-02Z', 'default'), // Monday,
          date: adapter.date('2025-06-13T23:59:59Z', 'default'), // Mon 2, Fri 6, Mon 9, Fri 13 => 4
          count: 100,
        }),
      ).to.equal(96); // 100 - 4
    });

    it('returns 0 when count is lower than the number of occurrences', () => {
      expect(
        getRemainingWeeklyOccurrences({
          adapter,
          rule: createRule(['TU']),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'), // Tuesday
          date: adapter.date('2025-07-08T12:00:00Z', 'default'), // 5 Tuesdays inclusive
          count: 3,
        }),
      ).to.equal(0); // 3 - 5 = -2, clamped to 0
    });
  });

  describe('getRemainingMonthlyOccurrences', () => {
    describe('byMonthDay', () => {
      const createRule = (day: number, interval = 1): SchedulerProcessedEventRecurrenceRule => ({
        freq: 'MONTHLY',
        interval,
        byMonthDay: [day],
      });

      it('returns count when target month is before start month', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(10),
            seriesStartDay: adapter.date('2025-06-10Z', 'default'),
            date: adapter.date('2025-05-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(100);
      });

      it('returns remaining after byMonthDay occurrences up to inclusive target (interval=1)', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(10),
            seriesStartDay: adapter.date('2025-01-10Z', 'default'),
            date: adapter.date('2025-04-10T12:00:00Z', 'default'), // Jan, Feb, Mar, Apr = 4
            count: 100,
          }),
        ).to.equal(96); // 100 - 4
      });

      it('respects interval > 1 (e.g. every 2 months)', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(10, 2),
            seriesStartDay: adapter.date('2025-01-10Z', 'default'),
            date: adapter.date('2025-11-10T09:00:00Z', 'default'), // Jan, Mar, May, Jul, Sep, Nov = 6
            count: 100,
          }),
        ).to.equal(94); // 100 - 6
      });

      it('skips months lacking the day (e.g. day 31)', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(31),
            seriesStartDay: adapter.date('2025-01-31Z', 'default'),
            date: adapter.date('2025-05-31T09:00:00Z', 'default'), // Jan(31), Mar(31), May(31) = 3
            count: 100,
          }),
        ).to.equal(97); // 100 - 3
      });

      it('does not count occurrence after target day in same month', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(20),
            seriesStartDay: adapter.date('2025-01-20Z', 'default'),
            date: adapter.date('2025-02-15T09:00:00Z', 'default'), // Feb 20 not reached = 1
            count: 100,
          }),
        ).to.equal(99); // 100 - 1
      });

      it('returns 0 when count is lower than the number of occurrences', () => {
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createRule(10),
            seriesStartDay: adapter.date('2025-01-10Z', 'default'),
            date: adapter.date('2025-06-10T12:00:00Z', 'default'), // Jan–Jun = 6 occurrences
            count: 4,
          }),
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

      it('counts 2nd Tuesday from July to October 2025 (interval=1)', () => {
        // Jul 8, Aug 12, Sep 9, Oct 14 => 4
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['2TU']),
            seriesStartDay: adapter.date('2025-07-01Z', 'default'), // before 2nd Tuesday (Jul 8)
            date: adapter.date('2025-10-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(96); // 100 - 4
      });

      it('respects interval > 1 (e.g., 2nd Tuesday every 2 months)', () => {
        // Jul 8, Sep 9 => 2
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['2TU'], 2),
            seriesStartDay: adapter.date('2025-07-01Z', 'default'), // before 2nd Tuesday (Jul 8)
            date: adapter.date('2025-10-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(98); // 100 - 2
      });

      it("skips the start month if DTSTART is after that month's occurrence (2TU)", () => {
        // July skipped, Aug 12 counted => 1
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['2TU']),
            seriesStartDay: adapter.date('2025-07-20Z', 'default'), // after Jul 8
            date: adapter.date('2025-08-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(99); // 100 - 1
      });

      it('counts last Friday (-1FR) from July to October 2025', () => {
        // Jul 25, Aug 29, Sep 26, Oct 31 => 4
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['-1FR']),
            seriesStartDay: adapter.date('2025-07-01Z', 'default'),
            date: adapter.date('2025-10-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(96); // 100 - 4
      });

      it('counts 2nd last Wednesday (-2WE) across months (Jul–Sep 2025)', () => {
        // Jul 23, Aug 20, Sep 17 => 3
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['-2WE']),
            seriesStartDay: adapter.date('2025-07-01Z', 'default'),
            date: adapter.date('2025-09-30T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(97); // 100 - 3
      });

      it('handles months without a 5th weekday: -5MO counts only months that have 5 Mondays', () => {
        // Jun: -5MO => Jun 2 (exists), Jul: no -5MO => skip => total 1
        expect(
          getRemainingMonthlyOccurrences({
            adapter,
            rule: createByDayRule(['-5MO']),
            seriesStartDay: adapter.date('2025-06-01Z', 'default'), // Jun 2025 has 5 Mondays
            date: adapter.date('2025-07-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.equal(99); // 100 - 1
      });

      it('throws when BYDAY and BYMONTHDAY are both provided', () => {
        expect(() =>
          getRemainingMonthlyOccurrences({
            adapter,
            rule: { freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] },
            seriesStartDay: adapter.date('2025-07-01Z', 'default'),
            date: adapter.date('2025-07-31T23:59:59Z', 'default'),
            count: 100,
          }),
        ).to.throw();
      });
    });
  });

  describe('getRemainingYearlyOccurrences', () => {
    const createRule = (interval = 1): SchedulerProcessedEventRecurrenceRule => ({
      freq: 'YEARLY',
      interval,
    });

    it('returns count when target year is before start year', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2025-06-10Z', 'default'),
          date: adapter.date('2024-12-31T23:59:59Z', 'default'),
          count: 100,
        }),
      ).to.equal(100);
    });

    it('returns remaining after first occurrence when target is same calendar day', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2025-03-15Z', 'default'),
          date: adapter.date('2025-03-15T23:59:59Z', 'default'),
          count: 100,
        }),
      ).to.equal(99); // 100 - 1
    });

    it('returns remaining for all occurrences up to inclusive target (interval=1)', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2023-02-05Z', 'default'),
          date: adapter.date('2026-02-05T09:00:00Z', 'default'), // 2023,24,25,26 => 4 occurrences
          count: 100,
        }),
      ).to.equal(96); // 100 - 4
    });

    it('respects interval > 1 (every 2 years)', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(2),
          seriesStartDay: adapter.date('2022-07-20Z', 'default'),
          date: adapter.date('2030-07-20T09:00:00Z', 'default'), // 2022,24,26,28,30 => 5 occurrences
          count: 100,
        }),
      ).to.equal(95); // 100 - 5
    });

    it('skips non-leap years for Feb 29 start', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2024-02-29Z', 'default'),
          date: adapter.date('2032-12-31T23:59:59Z', 'default'), // 2024, 2028, 2032 => 3 occurrences
          count: 100,
        }),
      ).to.equal(97); // 100 - 3
    });

    it('returns 0 when count is lower than the number of occurrences', () => {
      expect(
        getRemainingYearlyOccurrences({
          adapter,
          rule: createRule(),
          seriesStartDay: adapter.date('2023-02-05Z', 'default'),
          date: adapter.date('2030-02-05T09:00:00Z', 'default'), // 2023–2030 => 8 occurrences
          count: 5,
        }),
      ).to.equal(0); // 5 - 8 = -3, clamped to 0
    });
  });
});
