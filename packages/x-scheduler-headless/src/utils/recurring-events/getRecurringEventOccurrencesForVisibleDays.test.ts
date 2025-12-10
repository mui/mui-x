import { adapter, EventBuilder } from 'test/utils/scheduler';
import { RecurringEventRecurrenceRule } from '@mui/x-scheduler-headless/models';
import { getRecurringEventOccurrencesForVisibleDays } from './getRecurringEventOccurrencesForVisibleDays';
import { getWeekDayCode } from './internal-utils';

describe('recurring-events/getRecurringEventOccurrencesForVisibleDays', () => {
  describe('getRecurringEventOccurrencesForVisibleDays', () => {
    it('generates daily timed occurrences within visible range preserving duration', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z', 90)
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

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
        expect(adapter.differenceInMinutes(occ.end.value, occ.start.value)).to.equal(90);
        expect(occ.key).to.equal(`${event.id}::${occ.start.key}`);
      }
    });

    it('includes last day defined by "until" but excludes the following day', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const until = adapter.date('2025-01-05T23:59:59Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, until })
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, count: 3 })
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'WEEKLY', interval: 2 }) // byDay omitted -> defaults to start weekday
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [10],
        })
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay('2025-07-20T09:00:00Z')
        .rrule({ freq: 'YEARLY', interval: 2 })
        .toProcessed();

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
      const event = EventBuilder.new()
        .span('2025-01-03', '2025-01-06', { allDay: true })
        .rrule({ freq: 'DAILY', interval: 7 })
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay(start)
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] })
        .toProcessed();

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
      const event = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z')
        .rrule({
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [10],
          until: adapter.date('2025-01-31T23:59:59Z', 'default'),
        })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 28),
        adapter,
      );
      expect(result).to.have.length(0);
    });
  });

  describe('daily frequency', () => {
    it('does not generate occurrences before series start', () => {
      const eventStart = adapter.date('2025-01-10T09:00:00Z', 'default');
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default'); // before event start
      const event = EventBuilder.new()
        .singleDay(eventStart)
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 10),
        adapter,
      );
      // Should only have occurrences from Jan 10 onwards (6 days: 10,11,12,13,14,15)
      expect(result).to.have.length(6);
      expect(adapter.getDate(result[0].start.value)).to.equal(10);
    });

    it('respects interval > 1 (every 2 days)', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'DAILY', interval: 2 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6),
        adapter,
      );
      // Days: 1, 3, 5, 7 => 4 occurrences
      expect(result.map((o) => adapter.getDate(o.start.value))).to.deep.equal([1, 3, 5, 7]);
    });
  });

  describe('weekly frequency', () => {
    it('generates occurrences only on weekdays specified in byDay', () => {
      const visibleStart = adapter.date('2025-01-06T00:00:00Z', 'default'); // Monday
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE', 'FR'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6), // Mon-Sun
        adapter,
      );
      const dows = result.map((o) => getWeekDayCode(adapter, o.start.value));
      expect(dows).to.deep.equal(['MO', 'WE', 'FR']);
    });

    it('does not generate occurrences when weekday is not in byDay', () => {
      const visibleStart = adapter.date('2025-01-06T00:00:00Z', 'default'); // Monday
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['TU', 'TH'] }) // Tue, Thu only
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6),
        adapter,
      );
      const dows = result.map((o) => getWeekDayCode(adapter, o.start.value));
      // Monday is DTSTART but not in byDay, so Tue(7) and Thu(9) are generated
      expect(dows).to.deep.equal(['TU', 'TH']);
    });

    it('defaults to DTSTART weekday when byDay is omitted', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default'); // Friday
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'WEEKLY', interval: 1 }) // no byDay
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 14),
        adapter,
      );
      // Should only generate Fridays: Jan 10, 17, 24
      const dows = result.map((o) => getWeekDayCode(adapter, o.start.value));
      expect(dows).to.deep.equal(['FR', 'FR', 'FR']);
    });

    it('throws an error for ordinal BYDAY values (e.g., 1MO)', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'WEEKLY', byDay: ['1MO'] } as RecurringEventRecurrenceRule)
        .toProcessed();

      expect(() =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          visibleStart,
          adapter.addDays(visibleStart, 7),
          adapter,
        ),
      ).to.throw();
    });
  });

  describe('monthly frequency - byMonthDay', () => {
    it('respects interval > 1 (every 2 months)', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 2, byMonthDay: [10] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 6),
        adapter,
      );
      // Jan, Mar, May, Jul => 4 occurrences
      const months = result.map((o) => adapter.getMonth(o.start.value));
      expect(months).to.deep.equal([0, 2, 4, 6]); // 0-indexed months
    });

    it('falls back to DTSTART day-of-month when byMonthDay is omitted', () => {
      const visibleStart = adapter.date('2025-03-15T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 1 }) // no byMonthDay
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3),
        adapter,
      );
      // Should generate on the 15th: Mar, Apr, May, Jun
      const days = result.map((o) => adapter.getDate(o.start.value));
      expect(days).to.deep.equal([15, 15, 15, 15]);
    });

    it('skips months where the day does not exist (e.g., 31st)', () => {
      const visibleStart = adapter.date('2025-01-31T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 1, byMonthDay: [31] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 5),
        adapter,
      );
      // Jan(31), Feb(skip), Mar(31), Apr(skip), May(31), Jun(skip)
      const months = result.map((o) => adapter.getMonth(o.start.value));
      expect(months).to.deep.equal([0, 2, 4]); // Jan, Mar, May
    });
  });

  describe('monthly frequency - byDay ordinals', () => {
    it('generates the 2nd Tuesday of each month (2TU)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['2TU'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 4), // Jul, Aug, Sep, Oct
        adapter,
      );
      // Jul 8, Aug 12, Sep 9, Oct 14
      const dates = result.map((o) => adapter.getDate(o.start.value));
      expect(dates).to.deep.equal([8, 12, 9, 14]);
    });

    it('generates the 2nd last Wednesday of each month (-2WE)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['-2WE'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3), // Jul, Aug, Sep
        adapter,
      );
      // July: Wednesdays are 2,9,16,23,30 → 2nd last is 23
      // Aug: Wednesdays are 6,13,20,27 → 2nd last is 20
      // Sep: Wednesdays are 3,10,17,24 → 2nd last is 17
      const dates = result.map((o) => adapter.getDate(o.start.value));
      expect(dates).to.deep.equal([23, 20, 17]);
    });

    it('respects interval > 1 with byDay ordinals (every 2 months)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', interval: 2, byDay: ['1FR'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 5),
        adapter,
      );
      // Jul 4, Sep 5, Nov 7 (every 2 months)
      const dates = result.map((o) => adapter.getDate(o.start.value));
      expect(dates).to.deep.equal([4, 5, 7]);
    });

    it('does not generate ordinal occurrence that falls before DTSTART within the same month', () => {
      // DTSTART: July 20. 2nd Tuesday in July is July 8 (before DTSTART)
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const eventStart = adapter.date('2025-07-20T09:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(eventStart)
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['2TU'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3), // Jul, Aug, Sep
        adapter,
      );
      // July 8 is skipped (before DTSTART), Aug 12, Sep 9
      const dates = result.map((o) => adapter.getDate(o.start.value));
      expect(dates).to.deep.equal([12, 9]);
    });

    it('throws when BYDAY is mixed with BYMONTHDAY', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] })
        .toProcessed();

      expect(() =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          visibleStart,
          adapter.addMonths(visibleStart, 1),
          adapter,
        ),
      ).to.throw();
    });
  });

  describe('yearly frequency', () => {
    it('generates occurrences only on the same month/day as DTSTART', () => {
      const visibleStart = adapter.date('2025-07-20T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'YEARLY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 3),
        adapter,
      );
      // Jul 20 each year: 2025, 2026, 2027, 2028
      const years = result.map((o) => adapter.getYear(o.start.value));
      const months = result.map((o) => adapter.getMonth(o.start.value));
      const days = result.map((o) => adapter.getDate(o.start.value));
      expect(years).to.deep.equal([2025, 2026, 2027, 2028]);
      expect(months).to.deep.equal([6, 6, 6, 6]); // July (0-indexed)
      expect(days).to.deep.equal([20, 20, 20, 20]);
    });

    it('skips non-leap years for Feb 29 start', () => {
      const visibleStart = adapter.date('2024-02-29T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay(visibleStart)
        .rrule({ freq: 'YEARLY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 8),
        adapter,
      );
      // Only leap years: 2024, 2028, 2032
      const years = result.map((o) => adapter.getYear(o.start.value));
      expect(years).to.deep.equal([2024, 2028, 2032]);
    });
  });
});
