import { adapter, createProcessedEvent } from 'test/utils/scheduler';
import {
  SchedulerProcessedEvent,
  SchedulerEvent,
  RecurringEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import { diffIn } from '@mui/x-scheduler-headless/use-adapter';
import {
  buildEndGuard,
  getRecurringEventOccurrencesForVisibleDays,
  matchesRecurrence,
} from './getRecurringEventOccurrencesForVisibleDays';
import { getWeekDayCode } from './internal-utils';

describe('recurring-events/getRecurringEventOccurrencesForVisibleDays', () => {
  describe('getRecurringEventOccurrencesForVisibleDays', () => {
    const createEvent = (overrides: Partial<SchedulerEvent>) =>
      createProcessedEvent(
        {
          id: 'base-event',
          title: 'Recurring Test Event',
          start: adapter.date('2025-01-01T09:00:00Z', 'default'),
          end: adapter.date('2025-01-01T10:30:00Z', 'default'),
          allDay: false,
          rrule: {
            freq: 'DAILY',
            interval: 1,
          },
          ...overrides,
        },
        'default',
      );

    it('generates daily timed occurrences within visible range preserving duration', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z', 'default'),
        end: adapter.date('2025-01-10T10:30:00Z', 'default'),
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
        expect(occ.start.key).to.equal(
          adapter.format(adapter.addDays(visibleStart, i), 'localizedNumericDate'),
        );
        expect(diffIn(adapter, occ.end.value, occ.start.value, 'minutes')).to.equal(90);
        expect(occ.key).to.equal(`${event.id}::${occ.start.key}`);
      }
    });

    it('includes last day defined by "until" but excludes the following day', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const until = adapter.date('2025-01-05T23:59:59Z', 'default');
      const event = createEvent({
        start: adapter.date('2025-01-01T09:00:00Z', 'default'),
        end: adapter.date('2025-01-01T09:30:00Z', 'default'),
        rrule: { freq: 'DAILY', interval: 1, until },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 9),
        adapter,
      );
      // Jan 1..5 inclusive
      expect(result.map((o) => adapter.getDate(o.start.value))).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('respects "count" end rule (count=3 gives 3 occurrences)', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
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
      expect(result.map((o) => adapter.getDate(o.start.value))).to.deep.equal([1, 2, 3]);
    });

    it('applies weekly interval > 1 (e.g. every 2 weeks)', () => {
      const visibleStart = adapter.date('2025-01-03T09:00:00Z', 'default'); // Friday
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
      const dates = result.map((o) => adapter.getDate(o.start.value));
      expect(dates).to.deep.equal([3, 17, 31]);
    });

    it('generates monthly byMonthDay occurrences only on matching day and within visible range', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z', 'default'),
        end: adapter.date('2025-01-10T09:30:00Z', 'default'),
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
      const daysOfMonth = result.map((o) => adapter.getDate(o.start.value));
      expect(daysOfMonth).to.deep.equal([10, 10, 10, 10]);
    });

    it('generates yearly occurrences with interval', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = createEvent({
        start: adapter.date('2025-07-20T09:00:00Z', 'default'),
        end: adapter.date('2025-07-20T10:00:00Z', 'default'),
        rrule: { freq: 'YEARLY', interval: 2 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 5),
        adapter,
      );
      const years = result.map((o) => adapter.getYear(o.start.value));
      expect(years).to.deep.equal([2025, 2027, 2029]);
    });

    it('creates all-day multi-day occurrence spanning into visible range even if start precedes first visible day', () => {
      // Visible: Jan 05-09
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default');
      // All-day multi-day spanning Jan 03-06
      const event = createEvent({
        id: 'all-day-multi-day',
        allDay: true,
        start: adapter.date('2025-01-03T00:00:00Z', 'default'),
        end: adapter.date('2025-01-06T23:59:59Z', 'default'),
        rrule: { freq: 'DAILY', interval: 7 },
      });

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
      );
      expect(result).to.have.length(1);
      expect(adapter.getDate(result[0].start.value)).to.equal(3);
      expect(adapter.getDate(result[0].end.value)).to.equal(6);
    });

    it('does not generate occurrences earlier than DTSTART within the first week even if byDay spans the week', () => {
      // Take the full week (Mon–Sun) and set DTSTART on Wednesday
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default');
      const weekStart = adapter.addDays(adapter.startOfWeek(visibleStart), 1); // Monday

      // DTSTART on Wednesday of that same week
      const start = adapter.addDays(weekStart, 2); // Wednesday
      const event: SchedulerProcessedEvent = createEvent({
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
      const dows = result.map((o) => getWeekDayCode(adapter, o.start.value));

      // Only WE, TH, FR in the first week
      expect(dows).to.deep.equal(['WE', 'TH', 'FR']);
    });

    it('returns empty array when no dates match recurrence in visible window', () => {
      const visibleStart = adapter.date('2025-02-01T00:00:00Z', 'default');
      const event = createEvent({
        start: adapter.date('2025-01-10T09:00:00Z', 'default'),
        end: adapter.date('2025-01-10T10:00:00Z', 'default'),
        rrule: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [10],
          until: adapter.date('2025-01-31T23:59:59Z', 'default'),
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

  describe('matchesRecurrence', () => {
    const baseStart = adapter.date('2025-01-10T09:30:00Z', 'default'); // Friday
    const createEvent = (start = baseStart) =>
      createProcessedEvent(
        {
          id: 'event-1',
          title: 'Test Event',
          start,
          end: adapter.addHours(start, 1),
        },
        'default',
      );

    describe('daily frequency', () => {
      it('returns false for date before series start', () => {
        const event = createEvent();
        const rule: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 1 };
        const date = adapter.addDays(baseStart, -1);
        expect(matchesRecurrence(rule, date, adapter, event)).to.equal(false);
      });

      it('returns true on start day and respects interval > 1', () => {
        const event = createEvent();
        const rule: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 2 };
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
        const code = getWeekDayCode(adapter, event.start.value);
        const rule: RecurringEventRecurrenceRule = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [code],
        };
        expect(matchesRecurrence(rule, event.start.value, adapter, event)).to.equal(true);
      });

      it('returns false when the weekday is not in byDay', () => {
        const event = createEvent();
        const rule: RecurringEventRecurrenceRule = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['MO'], // Monday
        };
        expect(matchesRecurrence(rule, event.start.value, adapter, event)).to.equal(false); // Friday start
      });

      it('interval > 1 (every 2 weeks) includes only correct weeks', () => {
        const event = createEvent(baseStart);
        const code = getWeekDayCode(adapter, event.start.value); // FR
        const rule: RecurringEventRecurrenceRule = {
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
        const rule: RecurringEventRecurrenceRule = {
          freq: 'WEEKLY',
          interval: 1,
          byDay: ['MO', 'TU', 'FR'],
        };
        expect(matchesRecurrence(rule, event.start.value, adapter, event)).to.equal(true); // Friday
      });

      it('does not match days before DTSTART within the first week', () => {
        const event = createEvent(baseStart);
        const rule: RecurringEventRecurrenceRule = {
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
        const rule: RecurringEventRecurrenceRule = { freq: 'WEEKLY', interval: 1 }; // no byDay
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
        const bad: RecurringEventRecurrenceRule = { freq: 'WEEKLY', byDay: ['1MO'] };
        expect(() => matchesRecurrence(bad, event.start.value, adapter, event)).to.throw();
      });
    });

    describe('monthly frequency', () => {
      describe('byMonthDay', () => {
        it('returns true on start month/day', () => {
          const event = createEvent();
          const day = adapter.getDate(event.start.value);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [day],
          };
          expect(matchesRecurrence(rule, event.start.value, adapter, event)).to.equal(true);
        });

        it('interval > 1 (every 2 months) includes only correct months', () => {
          const start = baseStart;
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = {
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
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byMonthDay: [25],
          };
          const nextMonthSameOriginalDay = adapter.addMonths(baseStart, 1);
          expect(matchesRecurrence(rule, nextMonthSameOriginalDay, adapter, event)).to.equal(false);
        });

        it('falls back to DTSTART day-of-month when byMonthDay is omitted', () => {
          const start = adapter.date('2025-03-15T09:00:00Z', 'default');
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = { freq: 'MONTHLY', interval: 1 }; // no byMonthDay
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
          const start = adapter.date('2025-07-01T09:00:00Z', 'default');
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };

          const secondTue = adapter.addWeeks(start, 1);
          const nextTue = adapter.addWeeks(start, 2);

          expect(matchesRecurrence(rule, secondTue, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, nextTue, adapter, event)).to.equal(false);
        });

        it('matches the 2nd last Wednesday of the month (-2WE)', () => {
          // July 2025: Wednesdays are 2,9,16,23,30 → 2nd last is 23
          const start = adapter.date('2025-07-01T09:00:00Z', 'default');
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['-2WE'],
          };

          const secondLastWed = adapter.date('2025-07-23T09:00:00Z', 'default');
          const lastWed = adapter.addWeeks(secondLastWed, 1);

          expect(matchesRecurrence(rule, secondLastWed, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, lastWed, adapter, event)).to.equal(false);
        });

        it('respects interval > 1 (every 2 months)', () => {
          // July 1st Friday: Jul 4 → with interval=2 starting in Jul, Jul & Sep match
          const start = adapter.date('2025-07-01T09:00:00Z', 'default');
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 2,
            byDay: ['1FR'],
          };

          const julFirstFri = adapter.date('2025-07-04T09:00:00Z', 'default'); // included
          const augFirstFri = adapter.date('2025-08-01T09:00:00Z', 'default'); // skipped
          const sepFirstFri = adapter.date('2025-09-05T09:00:00Z', 'default'); // included

          expect(matchesRecurrence(rule, julFirstFri, adapter, event)).to.equal(true);
          expect(matchesRecurrence(rule, augFirstFri, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, sepFirstFri, adapter, event)).to.equal(true);
        });

        it('does not match an ordinal that occurred before DTSTART within the same month', () => {
          // DTSTART: 20 July 2025. 2nd Tuesday in July is 8 July (before DTSTART)
          // Next valid is 12 August
          const start = adapter.date('2025-07-20T09:00:00Z', 'default'); // 20 July
          const event = createEvent(start);
          const rule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            interval: 1,
            byDay: ['2TU'],
          };

          const julSecondTue = adapter.date('2025-07-08T09:00:00Z', 'default'); // before DTSTART
          const augSecondTue = adapter.date('2025-08-12T09:00:00Z', 'default');

          expect(matchesRecurrence(rule, julSecondTue, adapter, event)).to.equal(false);
          expect(matchesRecurrence(rule, augSecondTue, adapter, event)).to.equal(true);
        });

        it('throws when BYDAY is mixed with BYMONTHDAY', () => {
          const start = adapter.date('2025-07-01T09:00:00Z', 'default');
          const event = createEvent(start);
          const mixedRule: RecurringEventRecurrenceRule = {
            freq: 'MONTHLY',
            byDay: ['2TU'],
            byMonthDay: [10],
          };
          const candidate = adapter.date('2025-07-08T09:00:00Z', 'default'); // 2nd Tue

          expect(() => matchesRecurrence(mixedRule, candidate, adapter, event)).to.throw();
        });
      });
    });

    describe('yearly frequency', () => {
      it('returns true on start year', () => {
        const event = createEvent();
        const rule: RecurringEventRecurrenceRule = { freq: 'YEARLY', interval: 1 };
        expect(matchesRecurrence(rule, event.start.value, adapter, event)).to.equal(true);
      });

      it('interval > 1 (every 2 years) includes only correct years', () => {
        const start = adapter.date('2025-03-15T09:00:00Z', 'default');
        const event = createEvent(start);
        const rule: RecurringEventRecurrenceRule = { freq: 'YEARLY', interval: 2 };
        const plus1 = adapter.addYears(start, 1); // skipped
        const plus2 = adapter.addYears(start, 2); // included
        expect(matchesRecurrence(rule, plus1, adapter, event)).to.equal(false);
        expect(matchesRecurrence(rule, plus2, adapter, event)).to.equal(true);
      });

      it('returns false when day differs despite interval', () => {
        const start = adapter.date('2025-07-20T09:00:00Z', 'default');
        const event = createEvent(start);
        const rule: RecurringEventRecurrenceRule = { freq: 'YEARLY', interval: 1 };
        const diffDay = adapter.addDays(adapter.addYears(start, 1), 1);
        expect(matchesRecurrence(rule, diffDay, adapter, event)).to.equal(false);
      });

      it('yearly throws when BY* selectors are provided', () => {
        const event = createEvent();
        const bad1: RecurringEventRecurrenceRule = { freq: 'YEARLY', byMonth: [7] };
        const bad2: RecurringEventRecurrenceRule = { freq: 'YEARLY', byMonthDay: [20] };
        const bad3: RecurringEventRecurrenceRule = { freq: 'YEARLY', byDay: ['MO'] };
        expect(() => matchesRecurrence(bad1, event.start.value, adapter, event)).to.throw();
        expect(() => matchesRecurrence(bad2, event.start.value, adapter, event)).to.throw();
        expect(() => matchesRecurrence(bad3, event.start.value, adapter, event)).to.throw();
      });
    });
  });

  describe('buildEndGuard', () => {
    const baseStart = adapter.date('2025-01-01T09:00:00Z', 'default');
    const createDailyRule = (
      overrides: Partial<RecurringEventRecurrenceRule> = {},
    ): RecurringEventRecurrenceRule => ({
      freq: 'DAILY',
      interval: 1,
      ...overrides,
    });

    it('throws when COUNT and UNTIL are both set (RFC 5545)', () => {
      const until = adapter.addDays(baseStart, 5);
      const rule: RecurringEventRecurrenceRule = { freq: 'DAILY', interval: 1, count: 10, until };

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
        const until = adapter.date('2025-01-05T09:00:00Z', 'default'); // inclusive boundary
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
});
