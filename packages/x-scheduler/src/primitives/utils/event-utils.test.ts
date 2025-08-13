import { DateTime } from 'luxon';
import { CalendarEvent, RecurrenceRule } from '@mui/x-scheduler/primitives/models';
import {
  estimateOccurrencesUpTo,
  countYearlyOccurrencesUpToExact,
  countMonthlyOccurrencesUpToExact,
  countWeeklyOccurrencesUpToExact,
  matchesRecurrence,
  buildEndGuard,
  getAllDaySpanDays,
  expandRecurringEventForVisibleDays,
} from './event-utils';
import { getAdapter } from './adapter/getAdapter';
import { diffIn } from './date-utils';

describe('event-utils', () => {
  const adapter = getAdapter();

  describe('getEventWithLargestRowIndex', () => {
    // TODO: Implement tests for getEventWithLargestRowIndex
  });

  describe('isDayWithinRange', () => {
    // TODO: Implement tests for isDayWithinRange
  });

  describe('getEventRowIndex', () => {
    // TODO: Implement tests for getEventRowIndex
  });

  describe('getEventDays', () => {
    // TODO: Implement tests for getEventDays
  });

  describe('getAllDaySpanDays', () => {
    const createEvent = (overrides: Partial<CalendarEvent>): CalendarEvent => ({
      id: 'event-1',
      title: 'Test Event',
      start: DateTime.fromISO('2025-01-01T09:00:00Z'),
      end: DateTime.fromISO('2025-01-01T10:00:00Z'),
      allDay: false,
      ...overrides,
    });

    // TODO: This should change after we implement support for timed events that span multiple days
    it('returns 1 for non-allDay multi-day event', () => {
      const event = createEvent({
        end: DateTime.fromISO('2025-01-03T18:00:00Z'),
      });
      expect(getAllDaySpanDays(adapter, event)).to.equal(1);
    });

    it('returns 1 for allDay event on same calendar day', () => {
      const event = createEvent({
        start: DateTime.fromISO('2025-02-10T00:00:00Z'),
        end: DateTime.fromISO('2025-02-10T23:59:59Z'),
        allDay: true,
      });
      expect(getAllDaySpanDays(adapter, event)).to.equal(1);
    });

    it('returns inclusive day count for allDay multi-day event', () => {
      const event = createEvent({
        start: DateTime.fromISO('2025-01-01T00:00:00Z'),
        end: DateTime.fromISO('2025-01-04T23:59:59Z'),
        allDay: true,
      });
      // Jan 1,2,3,4 => 4 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(4);
    });

    it('handles month boundary correctly', () => {
      const event = createEvent({
        start: DateTime.fromISO('2025-01-30T00:00:00Z'),
        end: DateTime.fromISO('2025-02-02T23:59:59Z'),
        allDay: true,
      });
      // Jan 30,31, Feb 1,2 => 4 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(4);
    });

    it('handles leap day span', () => {
      const event = createEvent({
        start: DateTime.fromISO('2024-02-28T00:00:00Z'),
        end: DateTime.fromISO('2024-03-01T23:59:59Z'),
        allDay: true,
      });
      // Feb 28, Feb 29, Mar 1 => 3 days
      expect(getAllDaySpanDays(adapter, event)).to.equal(3);
    });
  });

  describe('buildEndGuard', () => {
    const baseStart = DateTime.fromISO('2025-01-01T09:00:00Z');
    const createDailyRule = (end: RecurrenceRule['end']): RecurrenceRule => ({
      frequency: 'daily',
      interval: 1,
      end,
    });

    describe('type never', () => {
      it('always returns true (no end)', () => {
        const rule = createDailyRule({ type: 'never' });
        const guard = buildEndGuard(rule, baseStart, adapter);
        // A range of dates far into future should remain false
        expect(guard(baseStart)).to.equal(true);
        expect(guard(baseStart.plus({ days: 30 }))).to.equal(true);
        expect(guard(baseStart.plus({ years: 3 }))).to.equal(true);
      });
    });

    describe('type until', () => {
      it('returns false before or on boundary, true after boundary', () => {
        const until = DateTime.fromISO('2025-01-05T09:00:00Z'); // inclusive boundary
        const rule = createDailyRule({ type: 'until', date: until });
        const guard = buildEndGuard(rule, baseStart, adapter);

        expect(guard(baseStart)).to.equal(true); // start
        expect(guard(until.minus({ days: 1 }))).to.equal(true); // before boundary
        expect(guard(until)).to.equal(true); // on boundary
        expect(guard(until.plus({ days: 1 }))).to.equal(false); // after
      });
    });

    describe('type after', () => {
      it('stops after specified number of occurrences (e.g. 3)', () => {
        const rule = createDailyRule({ type: 'after', count: 3 });
        const guard = buildEndGuard(rule, baseStart, adapter);

        // Occurrence dates: Jan 1,2,3. Guard should become false starting with Jan 4.
        const occ1 = baseStart;
        const occ2 = baseStart.plus({ days: 1 });
        const occ3 = baseStart.plus({ days: 2 });
        const after = baseStart.plus({ days: 3 });

        expect(guard(occ1)).to.equal(true);
        expect(guard(occ2)).to.equal(true);
        expect(guard(occ3)).to.equal(true);
        expect(guard(after)).to.equal(false);
      });

      it('returns false after first occurrence', () => {
        const rule = createDailyRule({ type: 'after', count: 1 });
        const guard = buildEndGuard(rule, baseStart, adapter);
        expect(guard(baseStart)).to.equal(true); // first occurrence allowed
        expect(guard(baseStart.plus({ days: 1 }))).to.equal(false); // second blocked
      });
    });
  });

  describe('matchesRecurrence', () => {
    const baseStart = DateTime.fromISO('2025-01-10T09:30:00Z'); // Friday
    const createEvent = (start = baseStart): CalendarEvent => ({
      id: 'event-1',
      title: 'Test Event',
      start,
      end: start.plus({ hours: 1 }),
    });

    describe('daily frequency', () => {
      it('returns false for date before series start', () => {
        const event = createEvent();
        const rule: RecurrenceRule = { frequency: 'daily', interval: 1, end: { type: 'never' } };
        const date = baseStart.minus({ days: 1 });
        expect(matchesRecurrence(rule, date, adapter, event)).to.equal(false);
      });

      it('returns true on start day and respects interval > 1', () => {
        const event = createEvent();
        const rule: RecurrenceRule = { frequency: 'daily', interval: 2, end: { type: 'never' } };
        const day0 = baseStart;
        const day1 = baseStart.plus({ days: 1 });
        const day2 = baseStart.plus({ days: 2 });
        expect(matchesRecurrence(rule, day0, adapter, event)).to.equal(true);
        expect(matchesRecurrence(rule, day1, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, day2, adapter, event)).to.equal(true);
      });
    });

    describe('weekly frequency', () => {
      it('returns true when the weekday is in daysOfWeek', () => {
        const event = createEvent();
        const rule: RecurrenceRule = {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [5],
          end: { type: 'never' },
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
      });

      it('returns false when the weekday is not in daysOfWeek', () => {
        const event = createEvent();
        const rule: RecurrenceRule = {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [1],
          end: { type: 'never' },
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(false);
      });

      it('interval > 1 (every 2 weeks) includes only correct weeks', () => {
        const event = createEvent(baseStart);
        const rule: RecurrenceRule = {
          frequency: 'weekly',
          interval: 2,
          daysOfWeek: [5],
          end: { type: 'never' },
        };
        const sameWeek = baseStart; // week 0 (included)
        const nextWeek = baseStart.plus({ weeks: 1 }); // week 1 (skipped)
        const week2 = baseStart.plus({ weeks: 2 }); // week 2 (included)
        expect(matchesRecurrence(rule, sameWeek, adapter, event)).to.equal(true);
        expect(matchesRecurrence(rule, nextWeek, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, week2, adapter, event)).to.equal(true);
      });

      it('multiple daysOfWeek matches any of them', () => {
        const event = createEvent();
        const rule: RecurrenceRule = {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [1, 2, 5],
          end: { type: 'never' },
        };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
      });
    });

    describe('monthly frequency', () => {
      describe('"onDate" mode', () => {
        it('returns true on start month/day', () => {
          const event = createEvent();
          const rule: RecurrenceRule = {
            frequency: 'monthly',
            interval: 1,
            monthly: { mode: 'onDate', day: 10 },
            end: { type: 'never' },
          };
          expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
        });

        it('interval > 1 (every 2 months) includes only correct months', () => {
          const start = baseStart;
          const event = createEvent(start);
          const rule: RecurrenceRule = {
            frequency: 'monthly',
            interval: 2,
            monthly: { mode: 'onDate', day: 10 },
            end: { type: 'never' },
          };
          const month1 = start.plus({ months: 1 }); // +1 month (skipped)
          const month2 = start.plus({ months: 2 }); // +2 months (included)
          expect(matchesRecurrence(rule, month1, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, month2, adapter, event)).to.equal(true);
        });

        it('returns false when day does not match', () => {
          const event = createEvent();
          const rule: RecurrenceRule = {
            frequency: 'monthly',
            interval: 1,
            monthly: { mode: 'onDate', day: 25 },
            end: { type: 'never' },
          };
          const nextMonthSameOriginalDay = baseStart.plus({ months: 1 });
          expect(matchesRecurrence(rule, nextMonthSameOriginalDay, adapter, event)).to.equal(false);
        });
      });

      describe('"onWeekday" mode', () => {
        // TODO: Issue #19128 - Implement support for 'onWeekday' mode.
      });

      describe('"onLastWeekday" mode', () => {
        // TODO: Issue #19128 - Implement support for 'onLastWeekday' mode.
      });
    });

    describe('yearly frequency', () => {
      it('returns true on start year', () => {
        const event = createEvent();
        const rule: RecurrenceRule = { frequency: 'yearly', interval: 1, end: { type: 'never' } };
        expect(matchesRecurrence(rule, event.start, adapter, event)).to.equal(true);
      });

      it('interval > 1 (every 2 years) includes only correct years', () => {
        const start = DateTime.fromISO('2025-03-15T09:00:00Z');
        const event = createEvent(start);
        const rule: RecurrenceRule = { frequency: 'yearly', interval: 2, end: { type: 'never' } };
        const plus1 = start.plus({ years: 1 }); // +1 year (skipped)
        const plus2 = start.plus({ years: 2 }); // +2 years (included)
        expect(matchesRecurrence(rule, plus1, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, plus2, adapter, event)).to.equal(true);
      });

      it('returns false when day differs despite interval', () => {
        const start = DateTime.fromISO('2025-07-20T09:00:00Z');
        const event = createEvent(start);
        const rule: RecurrenceRule = { frequency: 'yearly', interval: 1, end: { type: 'never' } };
        const diffDay = start.plus({ years: 1 }).plus({ days: 1 });
        expect(matchesRecurrence(rule, diffDay, adapter, event)).to.equal(false);
      });
    });
  });

  describe('estimateOccurrencesUpTo', () => {
    const createDailyRule = (interval = 1): RecurrenceRule => ({
      frequency: 'daily',
      interval,
      end: { type: 'never' },
    });

    it('returns 0 when target is before start', () => {
      const start = DateTime.fromISO('2025-03-10T12:00:00Z');
      const target = DateTime.fromISO('2025-03-09T23:59:59Z');
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(), start, target)).to.equal(0);
    });

    it('daily interval=1 returns inclusive day span count', () => {
      const start = DateTime.fromISO('2025-01-01T00:00:00Z');
      const target = DateTime.fromISO('2025-01-05T23:59:59Z'); // 1,2,3,4,5 = 5
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(), start, target)).to.equal(5);
    });

    it('daily interval=2 counts every other day inclusive', () => {
      const start = DateTime.fromISO('2025-01-01T00:00:00Z');
      const target = DateTime.fromISO('2025-01-11T00:00:00Z'); // Days: 1,3,5,7,9,11 => 6
      expect(estimateOccurrencesUpTo(adapter, createDailyRule(2), start, target)).to.equal(6);
    });

    it('throws an error on unknown frequency', () => {
      const badRule = { frequency: 'foo', interval: 1, end: { type: 'never' } } as any;
      const start = DateTime.fromISO('2025-01-01T00:00:00Z');
      const target = DateTime.fromISO('2025-01-02T00:00:00Z');
      expect(() => estimateOccurrencesUpTo(adapter, badRule, start, target)).to.throw();
    });
  });

  describe('countWeeklyOccurrencesUpToExact', () => {
    const createRule = (daysOfWeek: number[], interval = 1): RecurrenceRule => ({
      frequency: 'weekly',
      interval,
      daysOfWeek,
      end: { type: 'never' },
    });

    it('returns 0 when target date is before series start', () => {
      const start = DateTime.fromISO('2025-06-10T09:00:00Z'); // Tue
      const target = DateTime.fromISO('2025-06-09T23:59:59Z'); // Mon before start
      expect(
        countWeeklyOccurrencesUpToExact(
          adapter,
          createRule([adapter.getDayOfWeek(start)]),
          start,
          target,
        ),
      ).to.equal(0);
    });

    it('counts first occurrence when target is same day', () => {
      const start = DateTime.fromISO('2025-06-10T09:00:00Z'); // Tue
      const target = DateTime.fromISO('2025-06-10T23:59:59Z');
      expect(
        countWeeklyOccurrencesUpToExact(
          adapter,
          createRule([adapter.getDayOfWeek(start)]),
          start,
          target,
        ),
      ).to.equal(1);
    });

    it('counts occurrences for a single weekday across several weeks (interval=1)', () => {
      const start = DateTime.fromISO('2025-06-10T09:00:00Z'); // Tue
      const target = DateTime.fromISO('2025-07-08T12:00:00Z'); // 5 Tuesdays inclusive (Jun 10,17,24, Jul 1,8)
      expect(
        countWeeklyOccurrencesUpToExact(
          adapter,
          createRule([adapter.getDayOfWeek(start)]),
          start,
          target,
        ),
      ).to.equal(5);
    });

    it('counts multiple days per week (e.g. Mon & Wed) up to target inclusive', () => {
      const start = DateTime.fromISO('2025-06-02T09:00:00Z'); // Monday
      const daysOfWeek = [1, 3];
      const target = DateTime.fromISO('2025-06-18T23:59:59Z'); // Includes weeks of Jun 2,9,16
      // Occurrences: Mon(2), Wed(4), Mon(9), Wed(11), Mon(16), Wed(18) = 6
      expect(
        countWeeklyOccurrencesUpToExact(adapter, createRule(daysOfWeek), start, target),
      ).to.equal(6);
    });

    it('respects interval > 1 (every 2 weeks)', () => {
      const start = DateTime.fromISO('2025-06-10T09:00:00Z'); // Tue
      const target = DateTime.fromISO('2025-07-22T12:00:00Z'); // Tuesdays: Jun 10,17,24, Jul1,8,15,22
      // Every 2 weeks from Jun 10: Jun 10, Jun 24, Jul 8, Jul 22 => 4
      expect(
        countWeeklyOccurrencesUpToExact(
          adapter,
          createRule([adapter.getDayOfWeek(start)], 2),
          start,
          target,
        ),
      ).to.equal(4);
    });

    it('does not count weekday in target week occurring after target day', () => {
      const start = DateTime.fromISO('2025-06-10T09:00:00Z'); // Tue
      const target = DateTime.fromISO('2025-06-23T12:00:00Z'); // Monday of week containing Tue 24
      // Occurrences counted: Jun 10, Jun 17 => 2 (Jun 24 excluded)
      expect(
        countWeeklyOccurrencesUpToExact(
          adapter,
          createRule([adapter.getDayOfWeek(start)]),
          start,
          target,
        ),
      ).to.equal(2);
    });

    it('handles unordered daysOfWeek array', () => {
      const start = DateTime.fromISO('2025-06-02T09:00:00Z'); // Monday
      const daysOfWeek = [5, 1]; // Friday(5), Monday(1)
      const target = DateTime.fromISO('2025-06-13T23:59:59Z'); // Cover Mon 2, Fri 6, Mon 9, Fri 13 => 4
      expect(
        countWeeklyOccurrencesUpToExact(adapter, createRule(daysOfWeek), start, target),
      ).to.equal(4);
    });
  });

  describe('countMonthlyOccurrencesUpToExact', () => {
    describe('onDate', () => {
      const createRule = (day: number, interval = 1): RecurrenceRule => ({
        frequency: 'monthly',
        interval,
        monthly: { mode: 'onDate', day },
        end: { type: 'never' },
      });

      it('returns 0 when target month is before start month', () => {
        const start = DateTime.fromISO('2025-06-10T09:00:00Z');
        const target = DateTime.fromISO('2025-05-31T23:59:59Z');
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(10), start, target)).to.equal(
          0,
        );
      });

      it('counts all onDate occurrences up to inclusive target (interval=1)', () => {
        const start = DateTime.fromISO('2025-01-10T09:00:00Z');
        const target = DateTime.fromISO('2025-04-10T12:00:00Z'); // Jan, Feb, Mar, Apr
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(10), start, target)).to.equal(
          4,
        );
      });

      it('respects interval > 1 (e.g. every 2 months)', () => {
        const start = DateTime.fromISO('2025-01-10T09:00:00Z');
        const target = DateTime.fromISO('2025-11-10T09:00:00Z'); // Jan, Mar, May, Jul, Sep, Nov
        expect(
          countMonthlyOccurrencesUpToExact(adapter, createRule(10, 2), start, target),
        ).to.equal(6);
      });

      it('skips months lacking the day (e.g. day 31)', () => {
        const start = DateTime.fromISO('2025-01-31T09:00:00Z');
        const target = DateTime.fromISO('2025-05-31T09:00:00Z'); // Jan(31), Mar(31), May(31)
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(31), start, target)).to.equal(
          3,
        );
      });

      it('does not count occurrence after target day in same month', () => {
        const start = DateTime.fromISO('2025-01-20T09:00:00Z');
        const target = DateTime.fromISO('2025-02-15T09:00:00Z'); // Feb 20 not reached
        expect(countMonthlyOccurrencesUpToExact(adapter, createRule(20), start, target)).to.equal(
          1,
        );
      });

      it('throws an error on unknown mode', () => {
        const badRule = {
          frequency: 'monthly',
          interval: 1,
          monthly: { mode: 'foo', day: 1 },
          end: { type: 'never' },
        } as any;
        const start = DateTime.fromISO('2025-01-01T00:00:00Z');
        const target = DateTime.fromISO('2025-01-02T00:00:00Z');
        expect(() => countMonthlyOccurrencesUpToExact(adapter, badRule, start, target)).to.throw();
      });
    });

    describe('onWeekday', () => {
      // TODO: Issue #19128 - Implement support for 'onWeekday' and 'onLastWeekday'
    });

    describe('onLastWeekday', () => {
      // TODO: Issue #19128 - Implement support for 'onWeekday' and 'onLastWeekday'
    });
  });

  describe('countYearlyOccurrencesUpToExact', () => {
    const createRule = (interval = 1): RecurrenceRule => ({
      frequency: 'yearly',
      interval,
      end: { type: 'never' },
    });

    it('returns 0 when target year is before start year', () => {
      const start = DateTime.fromISO('2025-06-10T10:00:00Z');
      const target = DateTime.fromISO('2024-12-31T23:59:59Z');
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(0);
    });

    it('counts first occurrence when target is same calendar day', () => {
      const start = DateTime.fromISO('2025-03-15T08:00:00Z');
      const target = DateTime.fromISO('2025-03-15T23:59:59Z');
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(1);
    });

    it('counts all occurrences up to inclusive target (interval=1)', () => {
      const start = DateTime.fromISO('2023-02-05T09:00:00Z');
      const target = DateTime.fromISO('2026-02-05T09:00:00Z'); // 2023,24,25,26
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(4);
    });

    it('respects interval > 1 (every 2 years)', () => {
      const start = DateTime.fromISO('2022-07-20T09:00:00Z');
      const target = DateTime.fromISO('2030-07-20T09:00:00Z'); // 2022,24,26,28,30
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(2), start, target)).to.equal(5);
    });

    it('skips non-leap years for Feb 29 start', () => {
      const start = DateTime.fromISO('2024-02-29T10:00:00Z');
      const target = DateTime.fromISO('2032-12-31T23:59:59Z'); // 2024, 2028, 2032
      expect(countYearlyOccurrencesUpToExact(adapter, createRule(), start, target)).to.equal(3);
    });
  });

  describe('expandRecurringEventForVisibleDays', () => {
    const makeDays = (start: DateTime, count: number) =>
      Array.from({ length: count }, (_, i) => start.plus({ days: i }));

    const createEvent = (overrides: Partial<CalendarEvent>): CalendarEvent => ({
      id: 'base-event',
      title: 'Recurring Test Event',
      start: DateTime.fromISO('2025-01-01T09:00:00Z'),
      end: DateTime.fromISO('2025-01-01T10:30:00Z'),
      allDay: false,
      recurrenceRule: {
        frequency: 'daily',
        interval: 1,
        end: { type: 'never' },
      },
      ...overrides,
    });

    it('generates daily timed occurrences within visible range preserving duration', () => {
      const visibleStart = DateTime.fromISO('2025-01-10T00:00:00Z');
      const days = makeDays(visibleStart, 5); // Jan 10-14
      const event = createEvent({
        start: DateTime.fromISO('2025-01-10T09:00:00Z'),
        end: DateTime.fromISO('2025-01-10T10:30:00Z'),
        recurrenceRule: { frequency: 'daily', interval: 1, end: { type: 'never' } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      expect(result).to.have.length(5);
      for (let i = 0; i < result.length; i += 1) {
        const occ = result[i];
        expect(adapter.format(occ.start, 'keyboardDate')).to.equal(
          adapter.format(days[i], 'keyboardDate'),
        );
        expect(diffIn(adapter, occ.end, occ.start, 'minutes')).to.equal(90);
        expect(occ.occurrenceId).to.equal(
          `${event.id}::${adapter.format(occ.start, 'keyboardDate')}`,
        );
      }
    });

    it('includes last day defined by an "until" end rule but excludes the following day', () => {
      const visibleStart = DateTime.fromISO('2025-01-01T00:00:00Z');
      const days = makeDays(visibleStart, 10);
      const until = DateTime.fromISO('2025-01-05T23:59:59Z');
      const event = createEvent({
        start: DateTime.fromISO('2025-01-01T09:00:00Z'),
        end: DateTime.fromISO('2025-01-01T09:30:00Z'),
        recurrenceRule: { frequency: 'daily', interval: 1, end: { type: 'until', date: until } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      // Jan 1..5 inclusive
      expect(result.map((o) => adapter.getDate(o.start))).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('respects "after" (count) end rule (count=3 gives 3 occurrences)', () => {
      const visibleStart = DateTime.fromISO('2025-01-01T00:00:00Z');
      const days = makeDays(visibleStart, 7);
      const event = createEvent({
        recurrenceRule: { frequency: 'daily', interval: 1, end: { type: 'after', count: 3 } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      expect(result).to.have.length(3);
      expect(result.map((o) => adapter.getDate(o.start))).to.deep.equal([1, 2, 3]);
    });

    it('applies weekly interval > 1 (e.g. every 2 weeks)', () => {
      const start = DateTime.fromISO('2025-01-03T09:00:00Z'); // Friday
      const days = makeDays(start.startOf('day'), 30);
      const event = createEvent({
        start,
        end: start.plus({ minutes: 30 }),
        recurrenceRule: { frequency: 'weekly', interval: 2, end: { type: 'never' } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      // Expect Fridays at week 0, 2 and 4
      const dates = result.map((o) => adapter.getDate(o.start));
      expect(dates).to.deep.equal([3, 17, 31]);
    });

    it('generates monthly "onDate" occurrences only on matching day and within visible range', () => {
      const visibleStart = DateTime.fromISO('2025-01-01T00:00:00Z');
      const days = makeDays(visibleStart, 120); // ~4 months
      const event = createEvent({
        start: DateTime.fromISO('2025-01-10T09:00:00Z'),
        end: DateTime.fromISO('2025-01-10T09:30:00Z'),
        recurrenceRule: {
          frequency: 'monthly',
          interval: 1,
          monthly: { mode: 'onDate', day: 10 },
          end: { type: 'never' },
        },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      const daysOfMonth = result.map((o) => adapter.getDate(o.start));
      expect(daysOfMonth).to.deep.equal([10, 10, 10, 10]);
    });

    it('generates yearly occurrences with interval', () => {
      const visibleStart = DateTime.fromISO('2025-01-01T00:00:00Z');
      // Visible range spans multiple years
      const days = makeDays(visibleStart, 365 * 5 + 2); // ~5 years
      const event = createEvent({
        start: DateTime.fromISO('2025-07-20T09:00:00Z'),
        end: DateTime.fromISO('2025-07-20T10:00:00Z'),
        recurrenceRule: { frequency: 'yearly', interval: 2, end: { type: 'never' } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      const years = result.map((o) => adapter.getYear(o.start));
      expect(years).to.deep.equal([2025, 2027, 2029]);
    });

    it('creates all-day multi-day occurrence spanning into visible range even if start precedes first visible day', () => {
      // Visible: Jan 05-09
      const visibleStart = DateTime.fromISO('2025-01-05T00:00:00Z');
      const days = makeDays(visibleStart, 5);
      // All-day event spanning 4 days starting Jan 03 (covers 3,4,5,6)
      const event = createEvent({
        id: 'all-day-multi-day',
        allDay: true,
        start: DateTime.fromISO('2025-01-03T00:00:00Z'),
        end: DateTime.fromISO('2025-01-06T23:59:59Z'),
        recurrenceRule: { frequency: 'daily', interval: 7, end: { type: 'never' } },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      expect(result).to.have.length(1);
      expect(adapter.getDate(result[0].start)).to.equal(3); // original start day retained
      expect(adapter.getDate(result[0].end)).to.equal(6); // End should be end of Jan 06
    });

    it('returns empty array when no dates match recurrence in visible window', () => {
      const visibleStart = DateTime.fromISO('2025-02-01T00:00:00Z');
      const days = makeDays(visibleStart, 28);
      const event = createEvent({
        start: DateTime.fromISO('2025-01-10T09:00:00Z'),
        end: DateTime.fromISO('2025-01-10T10:00:00Z'),
        recurrenceRule: {
          frequency: 'monthly',
          interval: 1,
          monthly: { mode: 'onDate', day: 10 },
          end: { type: 'until', date: DateTime.fromISO('2025-01-31T23:59:59Z') },
        },
      });

      const result = expandRecurringEventForVisibleDays(event, days, adapter);
      expect(result).to.have.length(0);
    });
  });
});
