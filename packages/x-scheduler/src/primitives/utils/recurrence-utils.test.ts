import { DateTime } from 'luxon';
import { adapter } from 'test/utils/scheduler';
import {
  ByDayCode,
  ByDayValue,
  CalendarEvent,
  RRuleSpec,
  SchedulerValidDate,
} from '@mui/x-scheduler/primitives/models';
import {
  getRecurringEventOccurrencesForVisibleDays,
  countMonthlyOccurrencesUpToExact,
  countWeeklyOccurrencesUpToExact,
  estimateOccurrencesUpTo,
  matchesRecurrence,
  buildEndGuard,
  getAllDaySpanDays,
  countYearlyOccurrencesUpToExact,
  getByDayMaps,
  tokenizeByDay,
  parseWeeklyByDayPlain,
  nthWeekdayOfMonth,
  parseMonthlyByDayOrdinalSingle,
  applyRecurringUpdateFollowing,
  decideSplitRRule,
  applyRecurringUpdateAll,
} from './recurrence-utils';
import { diffIn } from '../use-adapter';
import { Adapter } from '../use-adapter/useAdapter.types';

describe('recurrence-utils', () => {
  describe('getByDayMaps', () => {
    type MiniAdapter = Pick<Adapter<any>, 'date' | 'addDays' | 'getDayOfWeek'>;

    const ISO_ADAPTER = {
      date: (value?: string | null) => adapter.date(value as string),
      addDays: adapter.addDays,
      // TODO: Do not use Luxon APIs directly
      getDayOfWeek: (d: DateTime) => d.weekday,
    } as unknown as MiniAdapter;

    const SUNDAY_FIRST_ADAPTER = {
      date: (value?: string | null) => adapter.date(value as string),
      addDays: adapter.addDays,
      // TODO: Do not use Luxon APIs directly
      getDayOfWeek: (d: DateTime) => (d.weekday === 7 ? 1 : d.weekday + 1),
    } as unknown as MiniAdapter;

    const ALL_CODES: ByDayCode[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    it('respects ISO Mon=1 numbering', () => {
      const { byDayToNum, numToByDay } = getByDayMaps(ISO_ADAPTER as Adapter);

      expect(byDayToNum.MO).to.equal(1);
      expect(byDayToNum.SU).to.equal(7);
      expect(Object.values(byDayToNum)).to.have.length(7);
      expect(Object.keys(numToByDay)).to.have.length(7);
      ALL_CODES.forEach((code) => {
        expect(numToByDay[byDayToNum[code]]).to.equal(code);
      });
    });

    it('respects Sunday=1 numbering', () => {
      const { byDayToNum, numToByDay } = getByDayMaps(SUNDAY_FIRST_ADAPTER as Adapter);

      expect(byDayToNum.SU).to.equal(1);
      expect(byDayToNum.MO).to.equal(2);
      expect(Object.values(byDayToNum)).to.have.length(7);
      expect(Object.keys(numToByDay)).to.have.length(7);

      ALL_CODES.forEach((code) => {
        expect(numToByDay[byDayToNum[code]]).to.equal(code);
      });
    });
  });

  describe('getAllDaySpanDays', () => {
    const createEvent = (overrides: Partial<CalendarEvent>): CalendarEvent => ({
      id: 'event-1',
      title: 'Test Event',
      start: adapter.date('2025-01-01T09:00:00Z'),
      end: adapter.date('2025-01-01T10:00:00Z'),
      allDay: false,
      ...overrides,
    });

    // TODO: This should change after we implement support for timed events that span multiple days
    it('returns 1 for non-allDay multi-day event', () => {
      const event = createEvent({
        end: adapter.date('2025-01-03T18:00:00Z'),
      });
      expect(getAllDaySpanDays(adapter, event)).to.equal(1);
    });

    it('returns 1 for allDay event on same calendar day', () => {
      const event = createEvent({
        start: adapter.date('2025-02-10T00:00:00Z'),
        end: adapter.date('2025-02-10T23:59:59Z'),
        allDay: true,
      });
      expect(getAllDaySpanDays(adapter, event)).to.equal(1);
    });

    it('returns inclusive day count for allDay multi-day event', () => {
      const event = createEvent({
        start: adapter.date('2025-01-01T00:00:00Z'),
        end: adapter.date('2025-01-04T23:59:59Z'),
        allDay: true,
      });
      // Jan 1,2,3,4 => 4 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(4);
    });

    it('handles month boundary correctly', () => {
      const event = createEvent({
        start: adapter.date('2025-01-30T00:00:00Z'),
        end: adapter.date('2025-02-02T23:59:59Z'),
        allDay: true,
      });
      // Jan 30,31, Feb 1,2 => 4 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(4);
    });

    it('handles leap day span', () => {
      const event = createEvent({
        start: adapter.date('2024-02-28T00:00:00Z'),
        end: adapter.date('2024-03-01T23:59:59Z'),
        allDay: true,
      });
      // Feb 28, Feb 29, Mar 1 => 3 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(3);
    });
  });

  describe('BYDAY parsers: tokenizeByDay / parseWeeklyByDayPlain / parseMonthlyByDayOrdinalSingle', () => {
    describe('tokenizeByDay', () => {
      it('parses plain byDay codes without ordinal', () => {
        const ALL_CODES: ByDayCode[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
        ALL_CODES.forEach((code) => {
          const res = tokenizeByDay(code);
          expect(res).to.deep.equal({ ord: null, code });
        });
      });

      it('parses positive ordinals', () => {
        const cases: Array<[ByDayValue, number, ByDayCode]> = [
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
        const cases: Array<[ByDayValue, number, ByDayCode]> = [
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
          expect(() => tokenizeByDay(input as ByDayCode)).to.throw();
        });
      });
    });

    describe('parseWeeklyByDayPlain', () => {
      it('returns fallback when ruleByDay is undefined or empty', () => {
        // ruleByDay is undefined
        const fallbackTU: ByDayCode[] = ['TU'];
        expect(parseWeeklyByDayPlain(undefined, fallbackTU)).to.deep.equal(fallbackTU);

        // ruleByDay is empty
        const fallbackMO: ByDayCode[] = ['MO'];
        expect(parseWeeklyByDayPlain([], fallbackMO)).to.deep.equal(fallbackMO);
      });

      it('accepts plain byDay codes and returns them unchanged', () => {
        const byDay: RRuleSpec['byDay'] = ['MO', 'WE', 'FR'];
        expect(parseWeeklyByDayPlain(byDay, ['TU'])).to.deep.equal(['MO', 'WE', 'FR']);
      });

      it('throws when any ordinal is provided (e.g., 1MO, -1FR)', () => {
        const withOrdinal: RRuleSpec['byDay'] = ['1MO', '-1FR'];
        expect(() => parseWeeklyByDayPlain(withOrdinal, ['MO'])).to.throw();
      });

      it('throws for invalid BYDAY values (e.g., XX)', () => {
        const invalid: RRuleSpec['byDay'] = ['XX' as any];
        expect(() => parseWeeklyByDayPlain(invalid, ['MO'])).to.throw();
      });
    });

    describe('parseMonthlyByDayOrdinalSingle', () => {
      it('throws when ruleByDay is undefined, empty or multiple', () => {
        expect(() => parseMonthlyByDayOrdinalSingle(undefined)).to.throw();
        expect(() => parseMonthlyByDayOrdinalSingle([])).to.throw();
        expect(() => parseMonthlyByDayOrdinalSingle(['1MO', '2TU'])).to.throw();
      });

      it('parses one ordinal byDay code (e.g., 1MO, 3WE, -1FR)', () => {
        const byDay: RRuleSpec['byDay'] = ['1FR'];
        expect(parseMonthlyByDayOrdinalSingle(byDay)).to.deep.equal({ ord: 1, code: 'FR' });
        const negativeByDay: RRuleSpec['byDay'] = ['-1MO'];
        expect(parseMonthlyByDayOrdinalSingle(negativeByDay)).to.deep.equal({
          ord: -1,
          code: 'MO',
        });
      });

      it('throws when any entry lacks an ordinal (e.g., plain MO)', () => {
        const mixed: RRuleSpec['byDay'] = ['2TU', 'MO'];
        expect(() => parseMonthlyByDayOrdinalSingle(mixed)).to.throw();
      });
    });
  });

  describe('buildEndGuard', () => {
    const baseStart = adapter.date('2025-01-01T09:00:00Z');
    const createDailyRule = (overrides: Partial<RRuleSpec> = {}): RRuleSpec => ({
      freq: 'DAILY',
      interval: 1,
      ...overrides,
    });

    it('throws when COUNT and UNTIL are both set (RFC 5545)', () => {
      const until = adapter.addDays(baseStart, 5);
      const rule: RRuleSpec = { freq: 'DAILY', interval: 1, count: 10, until };

      expect(() => buildEndGuard(rule, baseStart, adapter)).to.throw();
    });

    describe('no end (never)', () => {
      it('always returns true when count/until are not set', () => {
        const rule = createDailyRule(); // no count/until
        const guard = buildEndGuard(rule, baseStart, adapter);
        expect(guard(baseStart)).to.equal(true);
        expect(guard(adapter.addDays(baseStart, 30))).to.equal(true);
        expect(guard(adapter.addYears(baseStart, 3))).to.equal(true);
      });
    });

    describe('until', () => {
      it('returns true before/on boundary, false after boundary', () => {
        const until = adapter.date('2025-01-05T09:00:00Z'); // inclusive boundary
        const rule = createDailyRule({ until });
        const guard = buildEndGuard(rule, baseStart, adapter);

        expect(guard(baseStart)).to.equal(true); // start
        expect(guard(adapter.addDays(until, -1))).to.equal(true); // before boundary
        expect(guard(until)).to.equal(true); // on boundary
        expect(guard(adapter.addDays(until, 1))).to.equal(false); // after
      });
    });

    describe('count', () => {
      it('stops after specified number of occurrences (e.g. 3)', () => {
        const rule = createDailyRule({ count: 3 });
        const guard = buildEndGuard(rule, baseStart, adapter);

        // Occurrence dates: Jan 1,2,3. Guard should become false starting with Jan 4.
        const occ1 = baseStart;
        const occ2 = adapter.addDays(baseStart, 1);
        const occ3 = adapter.addDays(baseStart, 2);
        const after = adapter.addDays(baseStart, 3);

        expect(guard(occ1)).to.equal(true);
        expect(guard(occ2)).to.equal(true);
        expect(guard(occ3)).to.equal(true);
        expect(guard(after)).to.equal(false);
      });

      it('returns false after first occurrence when count=1', () => {
        const rule = createDailyRule({ count: 1 });
        const guard = buildEndGuard(rule, baseStart, adapter);
        expect(guard(baseStart)).to.equal(true);
        expect(guard(adapter.addDays(baseStart, 1))).to.equal(false);
      });
    });
  });

  describe('nthWeekdayOfMonth', () => {
    const expectYMD = (date: SchedulerValidDate, year: number, month: number, day: number) => {
      expect(adapter.getYear(date)).to.equal(year);
      // The adapter uses 0-based months
      expect(adapter.getMonth(date)).to.equal(month - 1);
      expect(adapter.getDate(date)).to.equal(day);
    };

    it('returns the 2nd Tuesday of July 2025 (positive ordinal from start)', () => {
      // 2nd Tuesday is 8
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'TU', 2);
      expectYMD(result!, 2025, 7, 8);
    });

    it('returns the last Friday of July 2025 (-1 from end)', () => {
      // Last Friday is 25
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'FR', -1);
      expectYMD(result!, 2025, 7, 25);
    });

    it('returns the 2nd last Wednesday of July 2025 (-2 from end)', () => {
      // 2nd last Wednesday is 23
      const monthStart = adapter.startOfMonth(adapter.date('2025-07-01T00:00:00Z'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'WE', -2);
      expectYMD(result!, 2025, 7, 23);
    });

    it('returns null when the 5th Friday does not exist (Feb 2025)', () => {
      // Feb 2025 has only 4 Fridays
      const monthStart = adapter.startOfMonth(adapter.date('2025-02-01T00:00:00Z'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'FR', 5);
      expect(result).to.equal(null);
    });

    it('handles a month with 5 Mondays for -5 (June 2025)', () => {
      // Mondays in Jun 2025: 2, 9, 16, 23, 30 → 5th from end = first = 2
      const monthStart = adapter.startOfMonth(adapter.date('2025-06-01T00:00:00Z'));
      const result = nthWeekdayOfMonth(adapter, monthStart, 'MO', -5);
      expectYMD(result!, 2025, 6, 2);
    });
  });

  describe('matchesRecurrence', () => {
    const baseStart = adapter.date('2025-01-10T09:30:00Z'); // Friday
    const createEvent = (start = baseStart): CalendarEvent => ({
      id: 'event-1',
      title: 'Test Event',
      start,
      end: adapter.addHours(start, 1),
    });

    describe('daily frequency', () => {
      it('returns false for date before series start', () => {
        const event = createEvent();
        const rule: RRuleSpec = { freq: 'DAILY', interval: 1 };
        const date = adapter.addDays(baseStart, -1);
        expect(matchesRecurrence(rule, date, adapter, event)).to.equal(false);
      });

      it('returns true on start day and respects interval > 1', () => {
        const event = createEvent();
        const rule: RRuleSpec = { freq: 'DAILY', interval: 2 };
        const day0 = baseStart;
        const day1 = adapter.addDays(baseStart, 1);
        const day2 = adapter.addDays(baseStart, 2);
        expect(matchesRecurrence(rule, day0, adapter, event)).to.equal(true);
        expect(matchesRecurrence(rule, day1, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, day2, adapter, event)).to.equal(true);
      });
    });

    describe('weekly frequency', () => {
      it('returns true when the weekday is in byDay', () => {
        const event = createEvent();
        const { numToByDay } = getByDayMaps(adapter);
        const code = numToByDay[adapter.getDayOfWeek(event.start)];
        const rule: RRuleSpec = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [code],
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
      });

      it('returns false when the weekday is not in byDay', () => {
        const event = createEvent();
        const rule: RRuleSpec = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['MO'], // Monday
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(false); // Friday start
      });

      it('interval > 1 (every 2 weeks) includes only correct weeks', () => {
        const event = createEvent(baseStart);
        const { numToByDay } = getByDayMaps(adapter);
        const code = numToByDay[adapter.getDayOfWeek(event.start)]; // FR
        const rule: RRuleSpec = {
          freq: 'WEEKLY',
          interval: 2,
          byDay: [code],
        };
        const sameWeek = baseStart; // included
        const nextWeek = adapter.addWeeks(baseStart, 1); // skipped
        const week2 = adapter.addWeeks(baseStart, 2); // included
        expect(matchesRecurrence(rule, sameWeek, adapter, event)).to.equal(true);
        expect(matchesRecurrence(rule, nextWeek, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, week2, adapter, event)).to.equal(true);
      });

      it('multiple byDay matches any of them', () => {
        const event = createEvent();
        const rule: RRuleSpec = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['MO', 'TU', 'FR'],
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true); // Friday
      });

      it('does not match days before DTSTART within the first week', () => {
        const event = createEvent(baseStart);
        const rule: RRuleSpec = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['MO', 'TU', 'WE', 'TH', 'FR'],
        };

        // same week of DTSTART
        const mon = adapter.addDays(baseStart, -4); // Mon 2025-01-06
        const tue = adapter.addDays(baseStart, -3); // Tue 2025-01-07
        const wed = adapter.addDays(baseStart, -2); // Wed 2025-01-08
        const thu = adapter.addDays(baseStart, -1); // Thu 2025-01-09
        const fri = baseStart; // Fri 2025-01-10 (DTSTART)

        expect(matchesRecurrence(rule, mon, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, tue, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, wed, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, thu, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, fri, adapter, event)).to.equal(true);
        const nextMon = adapter.addDays(adapter.addWeeks(baseStart, 1), -4);
        expect(matchesRecurrence(rule, nextMon, adapter, event)).to.equal(true);
      });

      it('defaults to DTSTART weekday when byDay is omitted', () => {
        const event = createEvent(baseStart);
        const rule: RRuleSpec = { freq: 'WEEKLY', interval: 1 }; // no byDay
        expect(matchesRecurrence(rule, baseStart, adapter, event)).to.equal(true); // same friday
        expect(matchesRecurrence(rule, adapter.addDays(baseStart, 1), adapter, event)).to.equal(
          false,
        ); // saturday
        expect(matchesRecurrence(rule, adapter.addWeeks(baseStart, 1), adapter, event)).to.equal(
          true,
        ); // next friday
      });

      it('throws an error for ordinal BYDAY values (e.g., 1MO)', () => {
        const event = createEvent();
        const bad: RRuleSpec = { freq: 'WEEKLY', byDay: ['1MO'] };
        expect(() => matchesRecurrence(bad, event.start, adapter, event)).to.throw();
      });
    });

    describe('monthly frequency', () => {
      describe('byMonthDay', () => {
        it('returns true on start month/day', () => {
          const event = createEvent();
          const day = adapter.getDate(event.start);
          const rule: RRuleSpec = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [day],
          };
          expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
        });

        it('interval > 1 (every 2 months) includes only correct months', () => {
          const start = baseStart;
          const event = createEvent(start);
          const rule: RRuleSpec = {
            freq: 'MONTHLY',
            interval: 2,
            byMonthDay: [adapter.getDate(start)],
          };
          const month1 = adapter.addMonths(start, 1); // skipped
          const month2 = adapter.addMonths(start, 2); // included
          expect(matchesRecurrence(rule, month1, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, month2, adapter, event)).to.equal(true);
        });

        it('returns false when day does not match', () => {
          const event = createEvent();
          const rule: RRuleSpec = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [25],
          };
          const nextMonthSameOriginalDay = adapter.addMonths(baseStart, 1);
          expect(matchesRecurrence(rule, nextMonthSameOriginalDay, adapter, event)).to.equal(false);
        });

        it('falls back to DTSTART day-of-month when byMonthDay is omitted', () => {
          const start = adapter.date('2025-03-15T09:00:00Z');
          const event = createEvent(start);
          const rule: RRuleSpec = { freq: 'MONTHLY', interval: 1 }; // no byMonthDay
          expect(matchesRecurrence(rule, adapter.addMonths(start, 1), adapter, event)).to.equal(
            true,
          ); // 15 Apr
          expect(
            matchesRecurrence(
              rule,
              adapter.addDays(adapter.addMonths(start, 1), 1),
              adapter,
              event,
            ),
          ).to.equal(false);
        });
      });
      describe('byDay ordinals', () => {
        it('matches the 2nd Tuesday of the month (2TU)', () => {
          // July 2025: 2nd Tuesday is Jul 8
          const start = adapter.date('2025-07-01T09:00:00Z');
          const event = createEvent(start);
          const rule: RRuleSpec = { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] };

          const secondTue = adapter.addWeeks(start, 1);
          const nextTue = adapter.addWeeks(start, 2);

          expect(matchesRecurrence(rule, secondTue, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, nextTue, adapter, event)).to.equal(false);
        });

        it('matches the 2nd last Wednesday of the month (-2WE)', () => {
          // July 2025: Wednesdays are 2,9,16,23,30 → 2nd last is 23
          const start = adapter.date('2025-07-01T09:00:00Z');
          const event = createEvent(start);
          const rule: RRuleSpec = { freq: 'MONTHLY', interval: 1, byDay: ['-2WE'] };

          const secondLastWed = adapter.date('2025-07-23T09:00:00Z');
          const lastWed = adapter.addWeeks(secondLastWed, 1);

          expect(matchesRecurrence(rule, secondLastWed, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, lastWed, adapter, event)).to.equal(false);
        });

        it('respects interval > 1 (every 2 months)', () => {
          // July 1st Friday: Jul 4 → with interval=2 starting in Jul, Jul & Sep match
          const start = adapter.date('2025-07-01T09:00:00Z');
          const event = createEvent(start);
          const rule: RRuleSpec = { freq: 'MONTHLY', interval: 2, byDay: ['1FR'] };

          const julFirstFri = adapter.date('2025-07-04T09:00:00Z'); // included
          const augFirstFri = adapter.date('2025-08-01T09:00:00Z'); // skipped
          const sepFirstFri = adapter.date('2025-09-05T09:00:00Z'); // included

          expect(matchesRecurrence(rule, julFirstFri, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, augFirstFri, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, sepFirstFri, adapter, event)).to.equal(true);
        });

        it('does not match an ordinal that occurred before DTSTART within the same month', () => {
          // DTSTART: 20 July 2025. 2nd Tuesday in July is 8 July (before DTSTART)
          // Next valid is 12 August
          const start = adapter.date('2025-07-20T09:00:00Z'); // 20 July
          const event = createEvent(start);
          const rule: RRuleSpec = { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] };

          const julSecondTue = adapter.date('2025-07-08T09:00:00Z'); // before DTSTART
          const augSecondTue = adapter.date('2025-08-12T09:00:00Z');

          expect(matchesRecurrence(rule, julSecondTue, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, augSecondTue, adapter, event)).to.equal(true);
        });

        it('throws when BYDAY is mixed with BYMONTHDAY', () => {
          const start = adapter.date('2025-07-01T09:00:00Z');
          const event = createEvent(start);
          const mixedRule: RRuleSpec = { freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] };
          const candidate = adapter.date('2025-07-08T09:00:00Z'); // 2nd Tue

          expect(() => matchesRecurrence(mixedRule, candidate, adapter, event)).to.throw();
        });
      });
    });

    describe('yearly frequency', () => {
      it('returns true on start year', () => {
        const event = createEvent();
        const rule: RRuleSpec = { freq: 'YEARLY', interval: 1 };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
      });

      it('interval > 1 (every 2 years) includes only correct years', () => {
        const start = adapter.date('2025-03-15T09:00:00Z');
        const event = createEvent(start);
        const rule: RRuleSpec = { freq: 'YEARLY', interval: 2 };
        const plus1 = adapter.addYears(start, 1); // skipped
        const plus2 = adapter.addYears(start, 2); // included
        expect(matchesRecurrence(rule, plus1, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, plus2, adapter, event)).to.equal(true);
      });

      it('returns false when day differs despite interval', () => {
        const start = adapter.date('2025-07-20T09:00:00Z');
        const event = createEvent(start);
        const rule: RRuleSpec = { freq: 'YEARLY', interval: 1 };
        const diffDay = adapter.addDays(adapter.addYears(start, 1), 1);
        expect(matchesRecurrence(rule, diffDay, adapter, event)).to.equal(false);
      });

      it('yearly throws when BY* selectors are provided', () => {
        const event = createEvent();
        const bad1: RRuleSpec = { freq: 'YEARLY', byMonth: [7] };
        const bad2: RRuleSpec = { freq: 'YEARLY', byMonthDay: [20] };
        const bad3: RRuleSpec = { freq: 'YEARLY', byDay: ['MO'] };
        expect(() => matchesRecurrence(bad1, event.start, adapter, event)).to.throw();
        expect(() => matchesRecurrence(bad2, event.start, adapter, event)).to.throw();
        expect(() => matchesRecurrence(bad3, event.start, adapter, event)).to.throw();
      });
    });
  });

  describe('estimateOccurrencesUpTo', () => {
    const createDailyRule = (interval = 1): RRuleSpec => ({
      freq: 'DAILY',
      interval,
    });

    it('returns 0 when target is before start', () => {
      const start = adapter.date('2025-03-10T12:00:00Z');
      const target = adapter.date('2025-03-09T23:59:59Z');
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(), start, target)).to.equal(0);
    });

    it('daily interval=1 returns inclusive day span count', () => {
      const start = adapter.date('2025-01-01T00:00:00Z');
      const target = adapter.date('2025-01-05T23:59:59Z'); // 1,2,3,4,5 = 5
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(), start, target)).to.equal(5);
    });

    it('daily interval=2 counts every other day inclusive', () => {
      const start = adapter.date('2025-01-01T00:00:00Z');
      const target = adapter.date('2025-01-11T00:00:00Z'); // Days: 1,3,5,7,9,11 => 6
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(2), start, target)).to.equal(6);
    });

    it('throws an error on unknown frequency', () => {
      const badRule = { freq: 'FOO', interval: 1 } as any;
      const start = adapter.date('2025-01-01T00:00:00Z');
      const target = adapter.date('2025-01-02T00:00:00Z');
      expect(() => estimateOccurrencesUpTo(adapter, badRule, start, target)).to.throw();
    });
  });

  describe('countWeeklyOccurrencesUpToExact', () => {
    const createRule = (by: ByDayCode[], interval = 1): RRuleSpec => ({
      freq: 'WEEKLY',
      interval,
      byDay: by,
    });

    it('returns 0 when target date is before series start', () => {
      const start = adapter.date('2025-06-10T09:00:00Z'); // Tuesday
      const target = adapter.date('2025-06-09T23:59:59Z'); // Mon before start
      const { numToByDay } = getByDayMaps(adapter);
      const code = numToByDay[adapter.getDayOfWeek(start)]; // TU
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule([code]), start, target)).to.equal(
        0,
      );
    });

    it('counts first occurrence when target is same day', () => {
      const start = adapter.date('2025-06-10T09:00:00Z'); // Tuesday
      const target = adapter.date('2025-06-10T23:59:59Z');
      const { numToByDay } = getByDayMaps(adapter);
      const code = numToByDay[adapter.getDayOfWeek(start)]; // TU
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule([code]), start, target)).to.equal(
        1,
      );
    });

    it('counts occurrences for a single weekday across several weeks (interval=1)', () => {
      const start = adapter.date('2025-06-10T09:00:00Z'); // Tuesday
      const target = adapter.date('2025-07-08T12:00:00Z'); // 5 Tuesdays inclusive
      const { numToByDay } = getByDayMaps(adapter);
      const code = numToByDay[adapter.getDayOfWeek(start)]; // TU
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule([code]), start, target)).to.equal(
        5,
      );
    });

    it('counts multiple days per week (e.g. Mon & Wed) up to target inclusive', () => {
      const start = adapter.date('2025-06-02T09:00:00Z'); // Monday
      const byDay: ByDayCode[] = ['MO', 'WE'];
      const target = adapter.date('2025-06-18T23:59:59Z'); // includes weeks of Jun 2,9,16
      // Occurrences: Mon(2), Wed(4), Mon(9), Wed(11), Mon(16), Wed(18) = 6
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule(byDay), start, target)).to.equal(
        6,
      );
    });

    it('respects interval > 1 (every 2 weeks)', () => {
      const start = adapter.date('2025-06-10T09:00:00Z'); // Tuesday
      const target = adapter.date('2025-07-22T12:00:00Z');
      const { numToByDay } = getByDayMaps(adapter);
      const code = numToByDay[adapter.getDayOfWeek(start)]; // TU
      expect(
        countWeeklyOccurrencesUpToExact(adapter, createRule([code], 2), start, target),
      ).to.equal(4);
    });

    it('does not count weekday in target week occurring after target day', () => {
      const start = adapter.date('2025-06-10T09:00:00Z'); // Tuesday
      const target = adapter.date('2025-06-23T12:00:00Z'); // Monday of week containing Tue 24
      const { numToByDay } = getByDayMaps(adapter);
      const code = numToByDay[adapter.getDayOfWeek(start)]; // TU
      // Occurrences counted: Jun 10, Jun 17 => 2 (Jun 24 excluded)
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule([code]), start, target)).to.equal(
        2,
      );
    });

    it('handles unordered byDay array', () => {
      const start = adapter.date('2025-06-02T09:00:00Z'); // Monday
      const byDay: ByDayCode[] = ['FR', 'MO'];
      const target = adapter.date('2025-06-13T23:59:59Z'); // Mon 2, Fri 6, Mon 9, Fri 13 => 4
      expect(countWeeklyOccurrencesUpToExact(adapter, createRule(byDay), start, target)).to.equal(
        4,
      );
    });
  });

  describe('countMonthlyOccurrencesUpToExact', () => {
    describe('byMonthDay', () => {
      const createRule = (day: number, interval = 1): RRuleSpec => ({
        freq: 'MONTHLY',
        interval,
        byMonthDay: [day],
      });

      it('returns 0 when target month is before start month', () => {
        const start = adapter.date('2025-06-10T09:00:00Z');
        const target = adapter.date('2025-05-31T23:59:59Z');
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(10), start, target)).to.equal(
          0,
        );
      });

      it('counts all byMonthDay occurrences up to inclusive target (interval=1)', () => {
        const start = adapter.date('2025-01-10T09:00:00Z');
        const target = adapter.date('2025-04-10T12:00:00Z'); // Jan, Feb, Mar, Apr
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(10), start, target)).to.equal(
          4,
        );
      });

      it('respects interval > 1 (e.g. every 2 months)', () => {
        const start = adapter.date('2025-01-10T09:00:00Z');
        const target = adapter.date('2025-11-10T09:00:00Z'); // Jan, Mar, May, Jul, Sep, Nov
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createRule(10, 2), start, target),
        ).to.equal(6);
      });

      it('skips months lacking the day (e.g. day 31)', () => {
        const start = adapter.date('2025-01-31T09:00:00Z');
        const target = adapter.date('2025-05-31T09:00:00Z'); // Jan(31), Mar(31), May(31)
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(31), start, target)).to.equal(
          3,
        );
      });

      it('does not count occurrence after target day in same month', () => {
        const start = adapter.date('2025-01-20T09:00:00Z');
        const target = adapter.date('2025-02-15T09:00:00Z'); // Feb 20 not reached
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(20), start, target)).to.equal(
          1,
        );
      });
    });

    describe('ByDay (ordinal: Nth / last weekday)', () => {
      const createByDayRule = (byDay: ByDayValue[], interval = 1): RRuleSpec => ({
        freq: 'MONTHLY',
        interval,
        byDay,
      });

      it('counts 2nd Tuesday from July to October 2025 (interval=1)', () => {
        const start = adapter.date('2025-07-01T09:00:00Z'); // before 2nd Tuesday (Jul 8)
        const target = adapter.date('2025-10-31T23:59:59Z');
        // Jul 8, Aug 12, Sep 9, Oct 14 => 4
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['2TU']), start, target),
        ).to.equal(4);
      });

      it('respects interval > 1 (e.g., 2nd Tuesday every 2 months)', () => {
        const start = adapter.date('2025-07-01T09:00:00Z'); // before 2nd Tuesday (Jul 8)
        const target = adapter.date('2025-10-31T23:59:59Z');
        // Jul 8, Sep 9 => 2
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['2TU'], 2), start, target),
        ).to.equal(2);
      });

      it('skips the start month if DTSTART is after that month’s occurrence (2TU)', () => {
        const start = adapter.date('2025-07-20T09:00:00Z'); // after Jul 8
        const target = adapter.date('2025-08-31T23:59:59Z');
        // July skipped, Aug 12 counted => 1
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['2TU']), start, target),
        ).to.equal(1);
      });

      it('counts last Friday (-1FR) from July to October 2025', () => {
        const start = adapter.date('2025-07-01T00:00:00Z');
        const target = adapter.date('2025-10-31T23:59:59Z');
        // Jul 25, Aug 29, Sep 26, Oct 31 => 4
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['-1FR']), start, target),
        ).to.equal(4);
      });

      it('counts 2nd last Wednesday (-2WE) across months (Jul–Sep 2025)', () => {
        const start = adapter.date('2025-07-01T00:00:00Z');
        const target = adapter.date('2025-09-30T23:59:59Z');
        // Jul 23, Aug 20, Sep 17 => 3
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['-2WE']), start, target),
        ).to.equal(3);
      });

      it('handles months without a 5th weekday: -5MO counts only months that have 5 Mondays', () => {
        const start = adapter.date('2025-06-01T00:00:00Z'); // Jun 2025 has 5 Mondays
        const target = adapter.date('2025-07-31T23:59:59Z'); // Jul 2025 has 4 Mondays
        // Jun: -5MO => Jun 2 (exists), Jul: no -5MO => skip => total 1
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createByDayRule(['-5MO']), start, target),
        ).to.equal(1);
      });

      it('throws when BYDAY and BYMONTHDAY are both provided', () => {
        const start = adapter.date('2025-07-01T00:00:00Z');
        const target = adapter.date('2025-07-31T23:59:59Z');
        const bad: RRuleSpec = { freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] };
        expect(() => countMonthlyOccurrencesUpToExact(adapter, bad, start, target)).to.throw();
      });
    });
  });

  describe('countYearlyOccurrencesUpToExact', () => {
    const createRule = (interval = 1): RRuleSpec => ({
      freq: 'YEARLY',
      interval,
    });

    it('returns 0 when target year is before start year', () => {
      const start = adapter.date('2025-06-10T10:00:00Z');
      const target = adapter.date('2024-12-31T23:59:59Z');
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(0);
    });

    it('counts first occurrence when target is same calendar day', () => {
      const start = adapter.date('2025-03-15T08:00:00Z');
      const target = adapter.date('2025-03-15T23:59:59Z');
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(1);
    });

    it('counts all occurrences up to inclusive target (interval=1)', () => {
      const start = adapter.date('2023-02-05T09:00:00Z');
      const target = adapter.date('2026-02-05T09:00:00Z'); // 2023,24,25,26
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(4);
    });

    it('respects interval > 1 (every 2 years)', () => {
      const start = adapter.date('2022-07-20T09:00:00Z');
      const target = adapter.date('2030-07-20T09:00:00Z'); // 2022,24,26,28,30
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(2), start, target)).to.equal(5);
    });

    it('skips non-leap years for Feb 29 start', () => {
      const start = adapter.date('2024-02-29T10:00:00Z');
      const target = adapter.date('2032-12-31T23:59:59Z'); // 2024, 2028, 2032
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(3);
    });
  });

  describe('getRecurringEventOccurrencesForVisibleDays', () => {
    const createEvent = (overrides: Partial<CalendarEvent>): CalendarEvent => ({
      id: 'base-event',
      title: 'Recurring Test Event',
      start: adapter.date('2025-01-01T09:00:00Z'),
      end: adapter.date('2025-01-01T10:30:00Z'),
      allDay: false,
      rrule: {
        freq: 'DAILY',
        interval: 1,
      },
      ...overrides,
    });

    it('generates daily timed occurrences within visible range preserving duration', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z'),
        end: adapter.date('2025-01-10T10:30:00Z'),
        rrule: { freq: 'DAILY', interval: 1 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
      );
      expect(result).to.have.length(5);
      for (let i = 0; i < result.length; i += 1) {
        const occ = result[i];
        expect(adapter.format(occ.start, 'keyboardDate')).to.equal(
          adapter.format(adapter.addDays(visibleStart, i), 'keyboardDate'),
        );
        expect(diffIn(adapter, occ.end, occ.start, 'minutes')).to.equal(90);
        expect(occ.key).to.equal(`${event.id}::${adapter.format(occ.start, 'keyboardDate')}`);
      }
    });

    it('includes last day defined by "until" but excludes the following day', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z');
      const until = adapter.date('2025-01-05T23:59:59Z');
      const event = createEvent({
        start: adapter.date('2025-01-01T09:00:00Z'),
        end: adapter.date('2025-01-01T09:30:00Z'),
        rrule: { freq: 'DAILY', interval: 1, until },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 9),
        adapter,
      );
      // Jan 1..5 inclusive
      expect(result.map((o) => adapter.getDate(o.start))).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('respects "count" end rule (count=3 gives 3 occurrences)', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z');
      const event = createEvent({
        rrule: { freq: 'DAILY', interval: 1, count: 3 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6),
        adapter,
      );
      expect(result).to.have.length(3);
      expect(result.map((o) => adapter.getDate(o.start))).to.deep.equal([1, 2, 3]);
    });

    it('applies weekly interval > 1 (e.g. every 2 weeks)', () => {
      const visibleStart = adapter.date('2025-01-03T09:00:00Z'); // Friday
      const event = createEvent({
        start: visibleStart,
        end: adapter.addMinutes(visibleStart, 30),
        rrule: { freq: 'WEEKLY', interval: 2 }, // byDay omitted -> defaults to start weekday
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 29),
        adapter,
      );
      // Expect Fridays at week 0, 2 and 4
      const dates = result.map((o) => adapter.getDate(o.start));
      expect(dates).to.deep.equal([3, 17, 31]);
    });

    it('generates monthly byMonthDay occurrences only on matching day and within visible range', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z'),
        end: adapter.date('2025-01-10T09:30:00Z'),
        rrule: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [10],
        },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 119),
        adapter,
      );
      const daysOfMonth = result.map((o) => adapter.getDate(o.start));
      expect(daysOfMonth).to.deep.equal([10, 10, 10, 10]);
    });

    it('generates yearly occurrences with interval', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z');
      const event = createEvent({
        start: adapter.date('2025-07-20T09:00:00Z'),
        end: adapter.date('2025-07-20T10:00:00Z'),
        rrule: { freq: 'YEARLY', interval: 2 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 5),
        adapter,
      );
      const years = result.map((o) => adapter.getYear(o.start));
      expect(years).to.deep.equal([2025, 2027, 2029]);
    });

    it('creates all-day multi-day occurrence spanning into visible range even if start precedes first visible day', () => {
      // Visible: Jan 05-09
      const visibleStart = adapter.date('2025-01-05T00:00:00Z');
      // All-day multi-day spanning Jan 03-06
      const event = createEvent({
        id: 'all-day-multi-day',
        allDay: true,
        start: adapter.date('2025-01-03T00:00:00Z'),
        end: adapter.date('2025-01-06T23:59:59Z'),
        rrule: { freq: 'DAILY', interval: 7 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
      );
      expect(result).to.have.length(1);
      expect(adapter.getDate(result[0].start)).to.equal(3);
      expect(adapter.getDate(result[0].end)).to.equal(6);
    });

    it('does not generate occurrences earlier than DTSTART within the first week even if byDay spans the week', () => {
      // Take the full week (Mon–Sun) and set DTSTART on Wednesday
      const visibleStart = adapter.date('2025-01-05T00:00:00Z');
      const weekStart = adapter.addDays(adapter.startOfWeek(visibleStart), 1); // Monday

      // DTSTART on Wednesday of that same week
      const start = adapter.addDays(weekStart, 2); // Wednesday
      const event: CalendarEvent = createEvent({
        id: 'standup',
        title: 'Standup',
        start,
        end: adapter.addMinutes(start, 30),
        rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 7),
        adapter,
      );
      const { numToByDay } = getByDayMaps(adapter);
      const dows = result.map((o) => numToByDay[adapter.getDayOfWeek(o.start)]);

      // Only WE, TH, FR in the first week
      expect(dows).to.deep.equal(['WE', 'TH', 'FR']);
    });

    it('returns empty array when no dates match recurrence in visible window', () => {
      const visibleStart = adapter.date('2025-02-01T00:00:00Z');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z'),
        end: adapter.date('2025-01-10T10:00:00Z'),
        rrule: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [10],
          until: adapter.date('2025-01-31T23:59:59Z'),
        },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 28),
        adapter,
      );
      expect(result).to.have.length(0);
    });
  });

  describe('decideSplitRRule', () => {
    const seriesStart = adapter.date('2025-01-01T09:00:00Z'); // DTSTART
    const splitStart = adapter.date('2025-01-06T15:00:00Z'); // "this and following" starts here

    const call = (
      originalRule: RRuleSpec,
      changes: Partial<CalendarEvent> = {},
      originalSeriesStart: SchedulerValidDate = seriesStart,
      split: SchedulerValidDate = splitStart,
    ) => decideSplitRRule(adapter, originalRule, originalSeriesStart, split, changes);

    it('should return changes.rrule as is when user explicitly changed recurrence', () => {
      const original: RRuleSpec = { freq: 'DAILY', interval: 1 };
      const newRule: RRuleSpec = { freq: 'WEEKLY', interval: 2, count: 5 };

      const res = call(original, { rrule: newRule });
      expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 2, count: 5 });
    });

    it('should return undefined when user explicitly removed recurrence', () => {
      const original: RRuleSpec = { freq: 'DAILY', interval: 1 };
      const res = call(original, { rrule: undefined });
      expect(res).to.equal(undefined);
    });

    describe('should inherit base pattern when RRULE not explicitly changed', () => {
      it('should inherit base pattern when RRULE not touched and there are no boundaries', () => {
        const original: RRuleSpec = { freq: 'DAILY', interval: 2 };
        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 2 });
      });

      it('should inherit base pattern and recomputes COUNT to remaining occurrences when RRULE not touched', () => {
        // Original: daily with count 42 from Jan 01
        // Split on Jan 06 => Jan 01..05 consumed => remaining 37 => new COUNT=37
        const original: RRuleSpec = { freq: 'DAILY', interval: 1, count: 42 };

        const dayBeforeSplit = adapter.addDays(adapter.startOfDay(splitStart), -1);
        const consumed = estimateOccurrencesUpTo(adapter, original, seriesStart, dayBeforeSplit);
        const remaining = (original.count as number) - consumed;

        const res = call(original, { title: 'New Event Title' });
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, count: remaining });
      });

      it('should keep the original UNTIL when inheriting (untouched RRULE)', () => {
        const originalUntil = adapter.date('2025-01-20T23:59:59Z');
        const original: RRuleSpec = { freq: 'DAILY', interval: 1, until: originalUntil };

        const res = call(original, { title: 'New Event Title' })!;
        expect(adapter.isSameDay(res.until!, originalUntil)).to.equal(true);
        expect(res).to.deep.equal({ freq: 'DAILY', interval: 1, until: originalUntil });
      });

      describe('weekly realignment (BYDAY swap)', () => {
        it('should keep pattern selectors when inheriting (e.g., WEEKLY BYDAY)', () => {
          const original: RRuleSpec = { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] };
          const res = call(original, { title: 'New Event Title' });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] });
        });

        it('should realign WEEKLY BYDAY when moving the day of the occurrence', () => {
          // Expect MO,WE → TU,WE (preserve pattern, swap only the edited weekday).
          const original: RRuleSpec = { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'] };
          const movedStart = adapter.date('2025-01-07T15:00:00Z');
          const res = call(original, { start: movedStart });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['TU', 'WE'] });
        });

        it('should avoid duplicates when new weekday already exists (MO→TU with TU present)', () => {
          // Expect MO,TU and moving MO → TU to result in just TU (no duplicate).
          const original: RRuleSpec = { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU'] };
          const movedStart = adapter.date('2025-01-07T10:00:00Z');
          const res = call(original, { start: movedStart });
          expect(res).to.deep.equal({ freq: 'WEEKLY', interval: 1, byDay: ['TU'] });
        });
      });

      describe('monthly realignment (BYMONTHDAY swap / ordinal BYDAY)', () => {
        it('should realign to new day of month (10th → 12th) (BYMONTHDAY)', () => {
          const original: RRuleSpec = { freq: 'MONTHLY', interval: 1, byMonthDay: [10] };
          const movedStart = adapter.date('2025-03-12T10:00:00Z');
          expect(call(original, { start: movedStart })).to.deep.equal({
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [12],
          });
        });

        it('should recompute ordinal+weekday (2TU → 3WE) (ordinal BYDAY)', () => {
          const startMonth = adapter.date('2025-07-01T00:00:00Z');
          const original: RRuleSpec = { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] };
          const thirdWed = adapter.date('2025-07-16T10:00:00Z'); // 3rd Wednesday
          expect(
            call(original, { start: thirdWed }, startMonth, adapter.startOfDay(thirdWed)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['3WE'] });
        });

        it('should use -1 for last weekday of month (→ -1FR) (ordinal BYDAY)', () => {
          const monthStart = adapter.date('2025-10-01T00:00:00Z');
          const original: RRuleSpec = { freq: 'MONTHLY', interval: 1, byDay: ['2TU'] };
          const lastFri = adapter.date('2025-10-31T09:00:00Z'); // last Friday
          expect(
            call(original, { start: lastFri }, monthStart, adapter.startOfDay(lastFri)),
          ).to.deep.equal({ freq: 'MONTHLY', interval: 1, byDay: ['-1FR'] });
        });
      });
    });
  });

  describe('applyRecurringUpdateFollowing', () => {
    const makeRecurringEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
      id: 'recurring',
      title: 'Recurring Event',
      start: adapter.date('2025-01-01T09:00:00Z'),
      end: adapter.date('2025-01-01T10:00:00Z'),
      allDay: false,
      rrule: { freq: 'DAILY', interval: 1 },
      ...overrides,
    });

    const makeOtherEvent = (): CalendarEvent => ({
      id: 'other',
      title: 'Other Event',
      start: adapter.date('2025-02-01T09:00:00Z'),
      end: adapter.date('2025-02-01T10:00:00Z'),
    });

    it('should set extractedFromId for the new series', () => {
      // Original: daily from Jan 01
      const original = makeRecurringEvent();
      const events = [original];

      const occurrenceStart = adapter.date('2025-01-07T09:00:00Z');
      const changes: CalendarEvent = {
        ...original,
        start: adapter.date('2025-01-07T10:00:00Z'),
        end: adapter.date('2025-01-07T11:00:00Z'),
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      const newId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      const newSeries = updated.find((event) => event.id === newId)!;

      expect(newSeries.extractedFromId).to.equal(original.id);
    });

    it('should truncate the original series at the day before the edited occurrence and appends the new series', () => {
      // Original: daily from Jan 01
      const original = makeRecurringEvent();
      const events = [original, makeOtherEvent()];

      // Edit an occurrence on Jan 05
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z');
      const changes: CalendarEvent = {
        ...original,
        // New timing for the split series
        start: adapter.date('2025-01-05T11:00:00Z'),
        end: adapter.date('2025-01-05T12:00:00Z'),
        title: 'Edited Event',
        // rrule omitted → inherit from original
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      // Original remains but with truncated rule, new series appended, other event unchanged
      expect(updated).to.have.length(3);

      const truncatedOriginalEvent = updated.find((event) => event.id === original.id)!;
      expect(truncatedOriginalEvent).to.have.property('rrule');
      // UNTIL = day(occurrenceStart) - 1
      const expectedUntil = adapter.addDays(adapter.startOfDay(occurrenceStart), -1);
      // The function sets rrule.until to expectedUntil
      expect(
        adapter.isSameDay((truncatedOriginalEvent.rrule as RRuleSpec).until!, expectedUntil),
      ).to.equal(true);

      const newSeriesId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      const newSeries = updated.find((event) => event.id === newSeriesId)!;
      expect(newSeries.title).to.equal('Edited Event');
      expect(adapter.isEqual(newSeries.start, changes.start)).to.equal(true);
      expect(adapter.isEqual(newSeries.end, changes.end)).to.equal(true);
      expect(newSeries.rrule).to.deep.equal({ freq: 'DAILY', interval: 1 });
      expect(newSeries.extractedFromId).to.equal(original.id);

      // Unrelated event preserved
      const other = updated.find((event) => event.id === 'other')!;
      expect(other.title).to.equal('Other Event');
    });

    it('should drop the original series when occurrence is on the DTSTART day (no remaining occurrences)', () => {
      // Original: daily from Jan 10
      const original = makeRecurringEvent({
        start: adapter.date('2025-01-10T09:00:00Z'),
        end: adapter.date('2025-01-10T10:00:00Z'),
      });
      const events = [makeOtherEvent(), original];

      // occurrenceStart same calendar day as DTSTART → shouldDropOldSeries = true
      const occurrenceStart = adapter.date('2025-01-10T09:00:00Z');
      const changes: CalendarEvent = {
        ...original,
        start: adapter.date('2025-01-10T12:00:00Z'),
        end: adapter.date('2025-01-10T13:00:00Z'),
        title: 'Edited First',
        // rrule omitted → inherit
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      // Original removed, new series added, other keeps
      expect(updated.map((event) => event.id)).to.not.include(original.id);
      const newId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      expect(updated.map((event) => event.id)).to.include(newId);
      expect(updated.map((event) => event.id)).to.include('other');
    });

    it('should use provided changes.rrule for the new series', () => {
      // Original: daily from Jan 01
      const original = makeRecurringEvent();
      const events = [original];

      const occurrenceStart = adapter.date('2025-01-03T09:00:00Z');
      const changes: CalendarEvent = {
        ...original,
        start: adapter.date('2025-01-03T10:00:00Z'),
        end: adapter.date('2025-01-03T11:00:00Z'),
        rrule: {
          freq: 'WEEKLY',
          interval: 2,
          count: 5,
        },
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      const newId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      const newSeries = updated.find((event) => event.id === newId)!;
      expect(newSeries.rrule).to.deep.equal({ freq: 'WEEKLY', interval: 2, count: 5 });
    });

    it('should remove recurrence for the new series when changes.rrule is explicitly undefined', () => {
      // Original: daily from Jan 01
      const original = makeRecurringEvent();
      const events = [original];

      const occurrenceStart = adapter.date('2025-01-04T09:00:00Z');

      const changes = {
        ...original,
        start: adapter.date('2025-01-04T12:00:00Z'),
        end: adapter.date('2025-01-04T13:00:00Z'),
        rrule: undefined,
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      const newId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      const newSeries = updated.find((event) => event.id === newId)!;
      expect(newSeries.rrule).to.equal(undefined);
    });

    it('should inherit the original rule when changes.rrule is omitted', () => {
      // Original: daily from Jan 01
      const original = makeRecurringEvent({ rrule: { freq: 'DAILY', interval: 2 } });
      const events = [original];
      const { rrule, ...rest } = original;

      const occurrenceStart = adapter.date('2025-01-06T09:00:00Z');
      const changes: CalendarEvent = {
        ...rest,
        start: adapter.date('2025-01-06T15:00:00Z'),
        end: adapter.date('2025-01-06T16:00:00Z'),
      };

      const updated = applyRecurringUpdateFollowing(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      // New series has inherited rule
      const newId = `${original.id}::${adapter.format(changes.start, 'keyboardDate')}`;
      const newSeries = updated.find((event) => event.id === newId)!;
      expect(newSeries.rrule).to.deep.equal({ freq: 'DAILY', interval: 2 });

      // Original series is truncated with UNTIL = day(occurrenceStart) - 1
      const truncated = updated.find((event) => event.id === original.id)!;
      const expectedUntil = adapter.addDays(adapter.startOfDay(occurrenceStart), -1);
      expect(adapter.isSameDay((truncated.rrule as RRuleSpec).until!, expectedUntil)).to.equal(
        true,
      );
    });
  });

  describe('applyRecurringUpdateAll', () => {
    const makeRecurringEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
      id: 'recurring',
      title: 'Recurring Event',
      start: adapter.date('2025-01-01T09:00:00Z'),
      end: adapter.date('2025-01-01T10:00:00Z'),
      allDay: false,
      rrule: { freq: 'DAILY', interval: 1 },
      ...overrides,
    });

    it('should replace exactly one event without creating duplicates', () => {
      const first = makeRecurringEvent({ id: 'rec-1' });
      const second = makeRecurringEvent({ id: 'rec-2' });
      const third = {
        id: 'single',
        title: 'Single Event',
        start: adapter.date('2025-01-03T09:00:00Z'),
        end: adapter.date('2025-01-03T10:00:00Z'),
      };

      const events = [first, second, third];

      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z');
      const changes = {
        ...first,
        title: 'Rec 1 Updated',
      };

      const updatedEventsList = applyRecurringUpdateAll(
        adapter,
        events,
        first,
        occurrenceStart,
        changes,
      );

      expect(updatedEventsList).to.have.length(3);

      const rec1 = updatedEventsList.find((event) => event.id === 'rec-1')!;
      expect(rec1.title).to.equal('Rec 1 Updated');

      const rec2 = updatedEventsList.find((event) => event.id === 'rec-2')!;
      expect(rec2).to.deep.equal(second);

      const single = updatedEventsList.find((event) => event.id === 'single')!;
      expect(single).to.deep.equal(third);
    });

    it('should use the rrule provided in changes when present', () => {
      const original = makeRecurringEvent();

      const events = [original];

      const occurrenceStart = original.start;
      const changes: CalendarEvent = {
        ...original,
        title: 'Now Weekly',
        rrule: { freq: 'WEEKLY', interval: 2, byDay: ['MO'] },
        start: adapter.date('2025-01-01T10:00:00Z'),
        end: adapter.date('2025-01-01T11:00:00Z'),
      };

      const updatedEventsList = applyRecurringUpdateAll(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      const updatedEvent = updatedEventsList[0];
      expect(updatedEvent.title).to.equal('Now Weekly');
      expect(updatedEvent.rrule).to.deep.equal({ freq: 'WEEKLY', interval: 2, byDay: ['MO'] });
    });

    it('should remove recurrence when changes.rrule is explicitly undefined', () => {
      const original = makeRecurringEvent();

      const events = [original];

      const occurrenceStart = original.start;
      const changes: CalendarEvent = {
        ...original,
        title: 'One-off',
        rrule: undefined,
      };

      const updatedEventsList = applyRecurringUpdateAll(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );

      expect(updatedEventsList[0].title).to.equal('One-off');
      expect(updatedEventsList[0].rrule).to.equal(undefined);
    });

    it('should keep the original date and just update hours/minutes when changing the time of a later occurrence', () => {
      const original = makeRecurringEvent();
      const events = [original];

      // Edited the Jan 05 occurrence and changed only the time
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z');
      const newStart = adapter.date('2025-01-05T11:15:00Z');
      const newEnd = adapter.date('2025-01-05T12:15:00Z');
      const changes: CalendarEvent = {
        ...original,
        start: newStart,
        end: newEnd,
      };

      const updatedEventsList = applyRecurringUpdateAll(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );
      const updatedEvent = updatedEventsList[0];

      // Date stays anchored to root (Jan 01), times come from changes
      expect(adapter.isSameDay(updatedEvent.start, original.start)).to.equal(true);
      expect(adapter.isSameDay(updatedEvent.end, original.end)).to.equal(true);
      expect(adapter.getHours(updatedEvent.start)).to.equal(adapter.getHours(newStart));
      expect(adapter.getMinutes(updatedEvent.start)).to.equal(adapter.getMinutes(newStart));
      expect(adapter.getHours(updatedEvent.end)).to.equal(adapter.getHours(newEnd));
      expect(adapter.getMinutes(updatedEvent.end)).to.equal(adapter.getMinutes(newEnd));
    });

    it('should move the series when the caller changes the date part (uses provided start/end as-is)', () => {
      const original = makeRecurringEvent();
      const events = [original];

      // Edited the Jan 05 occurrence but explicitly picked a different date
      const occurrenceStart = adapter.date('2025-01-05T09:00:00Z');
      const changes: CalendarEvent = {
        ...original,
        start: adapter.date('2025-01-12T11:00:00Z'),
        end: adapter.date('2025-01-12T12:00:00Z'),
      };

      const updatedEventsList = applyRecurringUpdateAll(
        adapter,
        events,
        original,
        occurrenceStart,
        changes,
      );
      const updatedEvent = updatedEventsList[0];

      // Uses the provided values as-is (new startDate on Jan 12)
      expect(adapter.isEqual(updatedEvent.start, changes.start)).to.equal(true);
      expect(adapter.isEqual(updatedEvent.end, changes.end)).to.equal(true);
    });
  });
});
