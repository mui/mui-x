import { adapter, EventBuilder, setSystemTimezone } from 'test/utils/scheduler';
import { beforeEach, describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import { processDate } from '@mui/x-scheduler-internals/process-date';
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
        'default',
      );
      expect(result).to.have.length(5);
      for (let i = 0; i < result.length; i += 1) {
        const occ = result[i];
        expect(occ.displayTimezone.start.key).to.equal(
          adapter.formatByString(adapter.addDays(visibleStart, i), 'yyyy-MM-dd'),
        );
        expect(
          adapter.differenceInMinutes(
            occ.displayTimezone.end.value,
            occ.displayTimezone.start.value,
          ),
        ).to.equal(90);
        expect(occ.key).to.equal(`${event.id}::${occ.displayTimezone.start.key}`);
      }
    });

    it('includes last day defined by "until" but excludes the following day', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, until: '2025-01-05T23:59:59Z' })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 9),
        adapter,
        'default',
      );
      // Jan 1..5 inclusive
      expect(result.map((o) => adapter.getDate(o.displayTimezone.start.value))).to.deep.equal([
        1, 2, 3, 4, 5,
      ]);
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
        'default',
      );
      expect(result).to.have.length(3);
      expect(result.map((o) => adapter.getDate(o.displayTimezone.start.value))).to.deep.equal([
        1, 2, 3,
      ]);
    });

    it('applies weekly interval > 1 (e.g. every 2 weeks)', () => {
      const visibleStart = adapter.date('2025-01-03T09:00:00Z', 'default'); // Friday
      const event = EventBuilder.new()
        .singleDay('2025-01-03T09:00:00Z')
        .rrule({ freq: 'WEEKLY', interval: 2 }) // byDay omitted -> defaults to start weekday
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 29),
        adapter,
        'default',
      );
      // Expect Fridays at week 0, 2 and 4
      const dates = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(dates).to.deep.equal([3, 17, 31]);
    });

    it('generates monthly byMonthDay occurrences only on matching day and within visible range', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-01T00:00:00Z')
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
        'default',
      );
      const daysOfMonth = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
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
        'default',
      );
      const years = result.map((o) => adapter.getYear(o.displayTimezone.start.value));
      expect(years).to.deep.equal([2025, 2027, 2029]);
    });

    it('creates all-day multi-day occurrence spanning into visible range even if start precedes first visible day', () => {
      // Visible: Jan 05-09
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default');
      // All-day multi-day spanning Jan 03-06
      const event = EventBuilder.new()
        .span('2025-01-03T00:00:00Z', '2025-01-06T00:00:00Z', { allDay: true })
        .rrule({ freq: 'DAILY', interval: 7 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
        'default',
      );
      expect(result).to.have.length(1);
      expect(adapter.getDate(result[0].displayTimezone.start.value)).to.equal(3);
      expect(adapter.getDate(result[0].displayTimezone.end.value)).to.equal(6);
    });

    it('normalizes all-day occurrences to whole days even when authored with sub-day times', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      // All-day daily event authored with non-midnight times (09:00 -> 18:00).
      const event = EventBuilder.new()
        .span('2025-01-10T09:00:00Z', '2025-01-10T18:00:00Z', { allDay: true })
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
        'default',
      );

      expect(result).to.have.length(5);
      for (const occ of result) {
        expect(occ.displayTimezone.start.minutesInDay).to.equal(0);
        expect(occ.displayTimezone.end.minutesInDay).to.equal(1439);
      }
    });

    it('keeps multi-day all-day occurrences whole-day on both ends when authored with sub-day times', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      // All-day event spanning Jan 10-12 with non-midnight times.
      const event = EventBuilder.new()
        .span('2025-01-10T09:00:00Z', '2025-01-12T18:00:00Z', { allDay: true })
        .rrule({ freq: 'DAILY', interval: 7 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 4),
        adapter,
        'default',
      );

      expect(result).to.have.length(1);
      expect(adapter.getDate(result[0].displayTimezone.start.value)).to.equal(10);
      expect(adapter.getDate(result[0].displayTimezone.end.value)).to.equal(12);
      expect(result[0].displayTimezone.start.minutesInDay).to.equal(0);
      expect(result[0].displayTimezone.end.minutesInDay).to.equal(1439);
    });

    it('does not generate occurrences earlier than DTSTART within the first week even if byDay spans the week', () => {
      // Take the full week (Mon–Sun) and set DTSTART on Wednesday
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default');

      // DTSTART on Wednesday of that same week
      const event = EventBuilder.new()
        .singleDay('2025-01-08T00:00:00Z')
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 7),
        adapter,
        'default',
      );
      const dows = result.map((o) => getWeekDayCode(adapter, o.displayTimezone.start.value));

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
          until: '2025-01-31T23:59:59Z',
        })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 28),
        adapter,
        'default',
      );
      expect(result).to.have.length(0);
    });
  });

  describe('daily frequency', () => {
    it('does not generate occurrences before series start', () => {
      const visibleStart = adapter.date('2025-01-05T00:00:00Z', 'default'); // before event start
      const event = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 10),
        adapter,
        'default',
      );
      // Should only have occurrences from Jan 10 onwards (6 days: 10,11,12,13,14,15)
      expect(result).to.have.length(6);
      expect(adapter.getDate(result[0].displayTimezone.start.value)).to.equal(10);
    });

    it('respects interval > 1 (every 2 days)', () => {
      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-01T00:00:00Z')
        .rrule({ freq: 'DAILY', interval: 2 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6),
        adapter,
        'default',
      );
      // Days: 1, 3, 5, 7 => 4 occurrences
      expect(result.map((o) => adapter.getDate(o.displayTimezone.start.value))).to.deep.equal([
        1, 3, 5, 7,
      ]);
    });

    it('should round a fractional COUNT up', () => {
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', count: 1.5 })
        .toProcessed();
      const expand = (start: string, end: string) =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          adapter.date(start, 'default'),
          adapter.date(end, 'default'),
          adapter,
          'default',
        ).map((o) => adapter.getDate(o.displayTimezone.start.value));

      expect(expand('2025-01-01T00:00:00Z', '2025-01-31T00:00:00Z')).to.deep.equal([1, 2]);
      expect(expand('2025-01-03T00:00:00Z', '2025-01-05T00:00:00Z')).to.deep.equal([]);
    });
  });

  describe('weekly frequency', () => {
    it('generates occurrences only on weekdays specified in byDay', () => {
      const visibleStart = adapter.date('2025-01-06T00:00:00Z', 'default'); // Monday
      const event = EventBuilder.new()
        .singleDay('2025-01-06T00:00:00Z')
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['MO', 'WE', 'FR'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6), // Mon-Sun
        adapter,
        'default',
      );
      const dows = result.map((o) => getWeekDayCode(adapter, o.displayTimezone.start.value));
      expect(dows).to.deep.equal(['MO', 'WE', 'FR']);
    });

    it('does not generate occurrences when weekday is not in byDay', () => {
      const visibleStart = adapter.date('2025-01-06T00:00:00Z', 'default'); // Monday
      const event = EventBuilder.new()
        .singleDay('2025-01-06T00:00:00Z')
        .rrule({ freq: 'WEEKLY', interval: 1, byDay: ['TU', 'TH'] }) // Tue, Thu only
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 6),
        adapter,
        'default',
      );
      const dows = result.map((o) => getWeekDayCode(adapter, o.displayTimezone.start.value));
      // Monday is DTSTART but not in byDay, so Tue(7) and Thu(9) are generated
      expect(dows).to.deep.equal(['TU', 'TH']);
    });

    it('defaults to DTSTART weekday when byDay is omitted', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default'); // Friday
      const event = EventBuilder.new()
        .singleDay('2025-01-10T00:00:00Z')
        .rrule({ freq: 'WEEKLY', interval: 1 }) // no byDay
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 14),
        adapter,
        'default',
      );
      // Should only generate Fridays: Jan 10, 17, 24
      const dows = result.map((o) => getWeekDayCode(adapter, o.displayTimezone.start.value));
      expect(dows).to.deep.equal(['FR', 'FR', 'FR']);
    });

    it('does not go backwards when BYDAY includes SU + another day with enUS week start and COUNT', () => {
      // DTSTART: Sunday Mar 2, 2025
      const visibleStart = adapter.date('2025-03-01T00:00:00Z', 'default');
      const visibleEnd = adapter.addDays(visibleStart, 20);

      const event = EventBuilder.new(adapter)
        .singleDay('2025-03-02T09:00:00Z')
        .rrule({ freq: 'WEEKLY', byDay: ['TU', 'SU'], count: 5 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'default',
      );

      // Expected occurrences in chronological order:
      // SU 2, TU 4, SU 9, TU 11, SU 16
      const days = result.map((o) =>
        adapter.formatByString(o.displayTimezone.start.value, 'yyyy-MM-dd'),
      );
      expect(days).to.deep.equal([
        '2025-03-02',
        '2025-03-04',
        '2025-03-09',
        '2025-03-11',
        '2025-03-16',
      ]);

      // And ensure they are strictly increasing (no backwards/duplicates)
      for (let i = 1; i < result.length; i += 1) {
        expect(
          adapter.isAfter(
            result[i].displayTimezone.start.value,
            result[i - 1].displayTimezone.start.value,
          ),
        ).to.equal(true);
      }
    });
  });

  describe('monthly frequency - byMonthDay', () => {
    it('respects interval > 1 (every 2 months)', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-10T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 2, byMonthDay: [10] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 6),
        adapter,
        'default',
      );
      // Jan, Mar, May, Jul => 4 occurrences
      const months = result.map((o) => adapter.getMonth(o.displayTimezone.start.value));
      expect(months).to.deep.equal([0, 2, 4, 6]); // 0-indexed months
    });

    it('falls back to DTSTART day-of-month when byMonthDay is omitted', () => {
      const visibleStart = adapter.date('2025-03-15T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-03-15T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 1 }) // no byMonthDay
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3),
        adapter,
        'default',
      );
      // Should generate on the 15th: Mar, Apr, May, Jun
      const days = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(days).to.deep.equal([15, 15, 15, 15]);
    });

    it('skips months where the day does not exist (e.g., 31st)', () => {
      const visibleStart = adapter.date('2025-01-31T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-31T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 1, byMonthDay: [31] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 5),
        adapter,
        'default',
      );
      // Jan(31), Feb(skip), Mar(31), Apr(skip), May(31), Jun(skip)
      const months = result.map((o) => adapter.getMonth(o.displayTimezone.start.value));
      expect(months).to.deep.equal([0, 2, 4]); // Jan, Mar, May
    });
  });

  describe('monthly frequency - byDay ordinals', () => {
    it('generates the 2nd Tuesday of each month (2TU)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-01T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['2TU'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 4), // Jul, Aug, Sep, Oct
        adapter,
        'default',
      );
      // Jul 8, Aug 12, Sep 9, Oct 14
      const dates = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(dates).to.deep.equal([8, 12, 9, 14]);
    });

    it('generates the 2nd last Wednesday of each month (-2WE)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-01T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['-2WE'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3), // Jul, Aug, Sep
        adapter,
        'default',
      );
      // July: Wednesdays are 2,9,16,23,30 → 2nd last is 23
      // Aug: Wednesdays are 6,13,20,27 → 2nd last is 20
      // Sep: Wednesdays are 3,10,17,24 → 2nd last is 17
      const dates = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(dates).to.deep.equal([23, 20, 17]);
    });

    it('respects interval > 1 with byDay ordinals (every 2 months)', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-01T00:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 2, byDay: ['1FR'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 5),
        adapter,
        'default',
      );
      // Jul 4, Sep 5, Nov 7 (every 2 months)
      const dates = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(dates).to.deep.equal([4, 5, 7]);
    });

    it('does not generate ordinal occurrence that falls before DTSTART within the same month', () => {
      // DTSTART: July 20. 2nd Tuesday in July is July 8 (before DTSTART)
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-20T09:00:00Z')
        .rrule({ freq: 'MONTHLY', interval: 1, byDay: ['2TU'] })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addMonths(visibleStart, 3), // Jul, Aug, Sep
        adapter,
        'default',
      );
      // July 8 is skipped (before DTSTART), Aug 12, Sep 9
      const dates = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(dates).to.deep.equal([12, 9]);
    });
  });

  describe('yearly frequency', () => {
    it('generates occurrences only on the same month/day as DTSTART', () => {
      const visibleStart = adapter.date('2025-07-20T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-20T00:00:00Z')
        .rrule({ freq: 'YEARLY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 3),
        adapter,
        'default',
      );
      // Jul 20 each year: 2025, 2026, 2027, 2028
      const years = result.map((o) => adapter.getYear(o.displayTimezone.start.value));
      const months = result.map((o) => adapter.getMonth(o.displayTimezone.start.value));
      const days = result.map((o) => adapter.getDate(o.displayTimezone.start.value));
      expect(years).to.deep.equal([2025, 2026, 2027, 2028]);
      expect(months).to.deep.equal([6, 6, 6, 6]); // July (0-indexed)
      expect(days).to.deep.equal([20, 20, 20, 20]);
    });

    it('skips non-leap years for Feb 29 start', () => {
      const visibleStart = adapter.date('2024-02-29T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2024-02-29T00:00:00Z')
        .rrule({ freq: 'YEARLY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addYears(visibleStart, 8),
        adapter,
        'default',
      );
      // Only leap years: 2024, 2028, 2032
      const years = result.map((o) => adapter.getYear(o.displayTimezone.start.value));
      expect(years).to.deep.equal([2024, 2028, 2032]);
    });

    it('finds yearly Feb-29 occurrence spanning the century non-leap year 2100 (8 consecutive non-leap years)', () => {
      // 2096 is a leap year. The following years 2097–2103 are NOT leap years:
      // 2100 is a century year not divisible by 400, so it is NOT a leap year.
      // This creates 8 consecutive non-leap years (2097–2103), with 2104 being the next leap year.
      const event = EventBuilder.new()
        .singleDay('2096-02-29T09:00:00Z')
        .rrule({ freq: 'YEARLY', interval: 1 })
        .toProcessed();

      const visibleStart = adapter.date('2097-01-01T00:00:00Z', 'default');
      const visibleEnd = adapter.date('2105-01-01T00:00:00Z', 'default');

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'default',
      );

      // The only Feb 29 in [2097, 2105) is 2104 (leap year)
      const years = result.map((o) => adapter.getYear(o.displayTimezone.start.value));
      expect(years).to.deep.equal([2104]);
    });

    it.each([
      { freq: 'YEARLY', interval: 10_000, count: 1 },
      { freq: 'YEARLY', interval: 300_000 },
      { freq: 'DAILY', interval: 200_000_000 },
    ] as const)(
      'should only return DTSTART when the next occurrence of %j is after the last supported day',
      (rule) => {
        const event = EventBuilder.new(adapter)
          .withDataTimezone('America/New_York')
          .singleDay('2024-01-01T09:00:00')
          .rrule(rule)
          .toProcessed();
        const expand = (start: string, end: string) =>
          getRecurringEventOccurrencesForVisibleDays(
            event,
            adapter.date(start, 'America/New_York'),
            adapter.date(end, 'America/New_York'),
            adapter,
            'America/New_York',
          ).map((o) => o.dataTimezone.start.key);

        expect(expand('2024-01-01T00:00:00', '2024-01-31T23:59:59')).to.deep.equal(['2024-01-01']);
        expect(expand('2025-01-01T00:00:00', '2025-01-31T23:59:59')).to.deep.equal([]);
      },
    );
  });

  describe('timezone handling', () => {
    it('converts recurring occurrences from the data timezone into the display timezone before grouping', () => {
      // DTSTART in New York
      // 2024-01-10 23:00 NY = 2024-01-11 04:00 UTC
      // Display timezone = Europe/Madrid (UTC+1 in January)
      // → final rendering = 2024-01-11 05:00 → should fall on day 11, 12 and 13.

      const event = EventBuilder.new(adapter)
        .singleDay('2024-01-10T23:00:00Z')
        .withDataTimezone('America/New_York')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const visibleStart = adapter.date('2024-01-10T00:00:00Z', 'default');
      const visibleEnd = adapter.addDays(visibleStart, 3);

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'Europe/Madrid',
      );

      // Should appear only on the 11th, 12th and 13th in Europe/Madrid
      const days = result.map((o) => adapter.format(o.displayTimezone.start.value, 'dayOfMonth'));
      expect(days).to.deep.equal(['11', '12', '13']);
    });

    it('keeps each recurrence tied to the event’s original local day even when display timezone conversion crosses midnight', () => {
      // Event at 00:30 in Tokyo (UTC+9)
      // In Madrid this becomes 16:30 of the previous day.
      // Recurrence must still belong to the original day (Tokyo's day), not Madrid's previous day.

      const event = EventBuilder.new(adapter)
        // 2025-01-10 00:30 JST → 2025-01-09T15:30:00Z
        .singleDay('2025-01-09T15:30:00Z', 30)
        .withDataTimezone('Asia/Tokyo')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const visibleStart = adapter.date('2025-01-09T00:00:00Z', 'default');
      const visibleEnd = adapter.addDays(visibleStart, 3);

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'Europe/Madrid',
      );

      // Only three occurrences, still belonging to Jan 10
      expect(result).to.have.length(3);
      // Check local day in the data timezone (Tokyo)
      expect(
        adapter.getDate(adapter.setTimezone(result[0].dataTimezone.start.value, 'Asia/Tokyo')),
      ).to.equal(10);
    });

    it('preserves multi-day duration when converting occurrences to the display timezone', () => {
      // 48-hour event starting in Los Angeles
      // LA UTC−8 → Madrid UTC+1 → +9 hours
      // Duration must remain exactly 48h after expanding + converting.

      const event = EventBuilder.new(adapter)
        .span('2025-03-01T08:00:00Z', '2025-03-03T08:00:00Z') // 48h
        .withDataTimezone('America/Los_Angeles')
        .withDisplayTimezone('Europe/Madrid')
        .rrule({ freq: 'DAILY' })
        .toProcessed();

      const visibleStart = adapter.date('2025-03-01T00:00:00Z', 'default');
      const visibleEnd = adapter.addDays(visibleStart, 4);

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'Europe/Madrid',
      );

      result.forEach((occ) => {
        expect(
          adapter.isWithinRange(occ.displayTimezone.start.value, [visibleStart, visibleEnd]),
        ).to.equal(true);
      });
      // Duration must remain exactly 48h
      result.forEach((occ) => {
        const hours = adapter.differenceInHours(
          occ.displayTimezone.end.value,
          occ.displayTimezone.start.value,
        );
        expect(hours).to.equal(48);
      });
    });

    it('weekly BYDAY + COUNT stays correct when data tz day differs from display tz day', () => {
      // Pick a time that is Sunday in LA but Monday in Paris:
      // 2025-03-03T00:30Z = 2025-03-02 16:30 in America/Los_Angeles (Sunday)
      //                 = 2025-03-03 01:30 in Europe/Paris (Monday)
      const event = EventBuilder.new(adapter)
        .singleDay('2025-03-03T00:30:00Z', 60)
        .withDataTimezone('America/Los_Angeles')
        .withDisplayTimezone('Europe/Paris')
        .rrule({ freq: 'WEEKLY', byDay: ['SU', 'TU'], count: 5 })
        .toProcessed();

      const visibleStart = adapter.date('2025-03-01T00:00:00Z', 'default');
      const visibleEnd = adapter.addDays(visibleStart, 25);

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        visibleEnd,
        adapter,
        'Europe/Paris',
      );

      // In data tz (LA): SU Mar2, TU Mar4, SU Mar9, TU Mar11, SU Mar16
      // In display tz (Paris): MO Mar3, WE Mar5, MO Mar10, WE Mar12, MO Mar17
      const displayDays = result.map((o) =>
        adapter.formatByString(o.displayTimezone.start.value, 'yyyy-MM-dd'),
      );

      expect(displayDays).to.deep.equal([
        '2025-03-03',
        '2025-03-05',
        '2025-03-10',
        '2025-03-12',
        '2025-03-17',
      ]);

      // Sanity: COUNT respected
      expect(result).to.have.length(5);
    });

    it('should exclude an instant-string exDate on its data-timezone day', () => {
      // July 12th 03:00Z is July 11th 23:00 in New York: the exDate excludes the
      // data-timezone day, not the UTC one.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .singleDay('2025-07-04T13:00:00Z')
        .exDates(['2025-07-12T03:00:00Z'])
        .rrule({ freq: 'WEEKLY', byDay: ['FR'] })
        .toProcessed();

      const visibleStart = adapter.date('2025-07-04T00:00:00Z', 'default');
      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 15),
        adapter,
        'default',
      );

      expect(
        result.map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd')),
      ).to.deep.equal(['2025-07-04', '2025-07-18']);
    });

    it('should exclude an instant-string exDate across the DST fall-back on its data-timezone day', () => {
      // Nov 3rd 04:30Z is Nov 2nd 23:30 in New York — EST, after the fall-back.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .singleDay('2025-10-26T13:00:00Z')
        .exDates(['2025-11-03T04:30:00Z'])
        .rrule({ freq: 'WEEKLY', byDay: ['SU'] })
        .toProcessed();

      const visibleStart = adapter.date('2025-10-26T00:00:00Z', 'default');
      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 15),
        adapter,
        'default',
      );

      expect(
        result.map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd')),
      ).to.deep.equal(['2025-10-26', '2025-11-09']);
    });

    it('should include the last day of an instant-string UNTIL on its data-timezone day', () => {
      // Jan 5th 05:00Z is Jan 5th 00:00 in New York: the series runs through Jan 5th.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .singleDay('2025-01-01T14:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, until: '2025-01-05T05:00:00Z' })
        .toProcessed();

      const visibleStart = adapter.date('2025-01-01T00:00:00Z', 'default');
      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 9),
        adapter,
        'default',
      );

      expect(
        result.map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd')),
      ).to.deep.equal(['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05']);
    });
  });

  it('should keep expanding a monthly rule whose next matching month is decades away', () => {
    // February has a 5th Tuesday in 2000, 2028 and 2056.
    const event = EventBuilder.new(adapter)
      .withDataTimezone('UTC')
      .singleDay('2000-02-29T09:00:00')
      .rrule({ freq: 'MONTHLY', interval: 12, byDay: ['5TU'] })
      .toProcessed();

    const result = getRecurringEventOccurrencesForVisibleDays(
      event,
      adapter.date('2000-01-01T00:00:00Z', 'default'),
      adapter.date('2060-12-31T00:00:00Z', 'default'),
      adapter,
      'UTC',
    );

    expect(
      result.map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd')),
    ).to.deep.equal(['2000-02-29', '2028-02-29', '2056-02-29']);
  });

  describe('days skipped by the timezone', () => {
    // Pacific/Apia skipped December 30th, 2011 when it moved across the date line.
    function expandDailyInApia(start: string, count: number | undefined, visibleStart: string) {
      const event = EventBuilder.new(adapter)
        .withDataTimezone('Pacific/Apia')
        .singleDay(start)
        .rrule({ freq: 'DAILY', count })
        .toProcessed();
      const rangeStart = adapter.date(visibleStart, 'default');
      return getRecurringEventOccurrencesForVisibleDays(
        event,
        rangeStart,
        adapter.addDays(rangeStart, 6),
        adapter,
        'Pacific/Apia',
      ).map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm'));
    }

    it('should not create an occurrence on a day the timezone skips', () => {
      expect(
        expandDailyInApia('2011-12-29T09:00:00', undefined, '2011-12-28T12:00:00Z'),
      ).to.deep.equal([
        '2011-12-29 09:00',
        '2011-12-31 09:00',
        '2012-01-01 09:00',
        '2012-01-02 09:00',
        '2012-01-03 09:00',
        '2012-01-04 09:00', // The range ends on January 3rd at 12:00 UTC, which is January 4th in Apia.
      ]);
    });

    it('should find a skipped day even when the timezone repeated a day earlier in the series', () => {
      // Pacific/Kwajalein repeated a day in September 1969 and skipped August 21st, 1993.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('Pacific/Kwajalein')
        .singleDay('1969-09-29T09:00:00')
        .rrule({ freq: 'DAILY', count: 8728 })
        .toProcessed();
      const expand = (visibleStart: string) =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          adapter.date(visibleStart, 'default'),
          adapter.date('1993-08-25T00:00:00Z', 'default'),
          adapter,
          'Pacific/Kwajalein',
        ).map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd'));

      // 8728 days from September 29th, 1969 without August 21st, 1993 end on August 22nd, 1993.
      expect(expand('1993-08-19T12:00:00Z')).to.deep.equal([
        '1993-08-19',
        '1993-08-20',
        '1993-08-22',
      ]);
      expect(expand('1993-08-21T12:00:00Z')).to.deep.equal(['1993-08-22']);
    });

    it('should not count a day the timezone skips toward COUNT', () => {
      expect(expandDailyInApia('2011-12-29T09:00:00', 4, '2011-12-28T12:00:00Z')).to.deep.equal([
        '2011-12-29 09:00',
        '2011-12-31 09:00',
        '2012-01-01 09:00',
        '2012-01-02 09:00',
      ]);
      // Dec 25 to 29, then Dec 31: Jan 4th is the 10th occurrence.
      expect(expandDailyInApia('2011-12-25T09:00:00', 10, '2012-01-01T12:00:00Z')).to.deep.equal([
        '2012-01-02 09:00',
        '2012-01-03 09:00',
        '2012-01-04 09:00',
      ]);
    });

    it('should not count a skipped day toward COUNT in a weekly rule', () => {
      // Friday, December 30th was skipped: Dec 23, Jan 6 and Jan 13 are the 3 occurrences.
      const event = EventBuilder.new(adapter)
        .withDataTimezone('Pacific/Apia')
        .singleDay('2011-12-23T09:00:00')
        .rrule({ freq: 'WEEKLY', count: 3 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDays(
        event,
        adapter.date('2012-01-01T00:00:00', 'Pacific/Apia'),
        adapter.date('2012-01-31T00:00:00', 'Pacific/Apia'),
        adapter,
        'Pacific/Apia',
      );

      expect(
        result.map((occurrence) => adapter.getDate(occurrence.dataTimezone.start.value)),
      ).to.deep.equal([6, 13]);
    });
  });

  it('should copy the data dates of the occurrences as the display dates in the data timezone', () => {
    // Europe/Paris springs forward on March 30th, 2025.
    const event = EventBuilder.new(adapter)
      .withDataTimezone('Europe/Paris')
      .withDisplayTimezone('Europe/Paris')
      .span('2025-03-29T01:30:00', '2025-03-29T03:30:00')
      .rrule({ freq: 'DAILY', count: 3 })
      .toProcessed();

    const result = getRecurringEventOccurrencesForVisibleDays(
      event,
      adapter.date('2025-03-29T00:00:00Z', 'default'),
      adapter.date('2025-03-31T23:00:00Z', 'default'),
      adapter,
      'Europe/Paris',
    );

    expect(result).to.have.length(3);
    for (const occurrence of result) {
      for (const bound of ['start', 'end'] as const) {
        const { value, ...display } = occurrence.displayTimezone[bound];
        const { value: processedValue, ...processed } = processDate(value, adapter);
        expect(display).to.deep.equal(processed);
        expect(adapter.getTimezone(value)).to.equal('Europe/Paris');
        expect(value).to.equal(occurrence.dataTimezone[bound].value);
      }
    }
  });

  it('should read the dates like the adapter for offsets between -01:00 and 00:00', () => {
    // TZDate reads -00:30 as +00:30: the occurrences follow the adapter values.
    const event = EventBuilder.new(adapter)
      .withDataTimezone('-00:30')
      .singleDay('2026-01-01T00:30:00')
      .rrule({ freq: 'MONTHLY', count: 3 })
      .toProcessed();

    const result = getRecurringEventOccurrencesForVisibleDays(
      event,
      adapter.date('2025-12-31T00:00:00Z', 'default'),
      adapter.date('2026-04-30T00:00:00Z', 'default'),
      adapter,
      '-00:30',
    );

    expect(
      result.map((o) => adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm')),
    ).to.deep.equal(['2026-01-01 00:30', '2026-02-01 00:30', '2026-03-01 00:30']);
    expect(result.map((o) => o.dataTimezone.start.key)).to.deep.equal([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
    ]);
  });

  // TZDate resolves DST transitions with the timezone of the system, the plain dates don't.
  describe.each(['UTC', 'America/New_York', 'Australia/Lord_Howe', 'Europe/London'])(
    'system timezone: %s',
    (systemTimezone) => {
      beforeEach(() => {
        // Browsers cannot change their timezone through process.env.TZ.
        if (isJSDOM) {
          setSystemTimezone(systemTimezone);
        }
      });

      describe.skipIf(!isJSDOM && systemTimezone !== 'UTC')('week days', () => {
        it('should expand BYDAY on the matching days of the data timezone', () => {
          // A new adapter, as adapters cache data computed in the current system timezone.
          const systemAdapter = new TemporalAdapterDateFns();
          const event = EventBuilder.new(systemAdapter)
            .withDataTimezone('America/New_York')
            .singleDay('2025-10-21T09:00:00')
            .rrule({ freq: 'WEEKLY', byDay: ['TU', 'SA'] })
            .toProcessed();

          const result = getRecurringEventOccurrencesForVisibleDays(
            event,
            systemAdapter.date('2025-10-20T00:00:00Z', 'default'),
            systemAdapter.date('2025-11-02T00:00:00Z', 'default'),
            systemAdapter,
            'America/New_York',
          );

          expect(
            result.map((o) =>
              systemAdapter.formatByString(o.dataTimezone.start.value, 'EEE yyyy-MM-dd'),
            ),
          ).to.deep.equal(['Tue 2025-10-21', 'Sat 2025-10-25', 'Tue 2025-10-28', 'Sat 2025-11-01']);
          expect(
            result.map((o) => getWeekDayCode(systemAdapter, o.dataTimezone.start.value)),
          ).to.deep.equal(['TU', 'SA', 'TU', 'SA']);
        });
      });

      // RFC 5545 §3.3.5 and §3.8.5.3: a recurrence instance whose local time is repeated refers to its
      // first occurrence, and one whose local time is skipped uses the UTC offset before the gap.
      describe.skipIf(!isJSDOM && systemTimezone !== 'UTC')('DST transitions', () => {
        function expandDaily(
          start: string,
          timezone: string,
          visibleStart: string,
          visibleDays: number,
          allDay = false,
        ) {
          const builder = EventBuilder.new(adapter)
            .withDataTimezone(timezone)
            .withDisplayTimezone(timezone);
          if (allDay) {
            builder.span(start, `${start.slice(0, 10)}T23:59:59`, { allDay: true });
          } else {
            builder.singleDay(start);
          }
          const event = builder.rrule({ freq: 'DAILY' }).toProcessed();
          const rangeStart = adapter.date(visibleStart, 'default');
          return getRecurringEventOccurrencesForVisibleDays(
            event,
            rangeStart,
            adapter.addDays(rangeStart, visibleDays),
            adapter,
            timezone,
          );
        }

        it('should start an occurrence on the first instant of a local time repeated by the transition', () => {
          // Europe/Paris falls back from 03:00 CEST to 02:00 CET on October 25th, 2026.
          const result = expandDaily(
            '2026-10-01T02:30:00',
            'Europe/Paris',
            '2026-10-25T00:00:00Z',
            1,
          );

          expect(
            result.map((o) => new Date(o.dataTimezone.start.timestamp).toISOString()),
          ).to.deep.equal(['2026-10-25T00:30:00.000Z', '2026-10-26T01:30:00.000Z']);
        });

        it('should move an occurrence on a local time skipped by the transition forward by the gap', () => {
          // Europe/Paris springs forward from 02:00 CET to 03:00 CEST on March 29th, 2026.
          const result = expandDaily(
            '2026-03-01T02:30:00',
            'Europe/Paris',
            '2026-03-29T00:00:00Z',
            1,
          );

          expect(
            result.map((o) => new Date(o.dataTimezone.start.timestamp).toISOString()),
          ).to.deep.equal(['2026-03-29T01:30:00.000Z', '2026-03-30T00:30:00.000Z']);
          expect(result[0].dataTimezone.start.minutesInDay).to.equal(3 * 60 + 30);
        });

        it('should keep the last visible day after a transition at midnight', () => {
          // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
          const result = expandDaily(
            '2026-03-01T09:00:00',
            'America/Havana',
            '2026-03-08T12:00:00Z',
            8,
          );

          expect(
            result.map((o) =>
              adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm'),
            ),
          ).to.deep.equal([
            '2026-03-08 09:00',
            '2026-03-09 09:00',
            '2026-03-10 09:00',
            '2026-03-11 09:00',
            '2026-03-12 09:00',
            '2026-03-13 09:00',
            '2026-03-14 09:00',
            '2026-03-15 09:00',
            '2026-03-16 09:00',
          ]);
        });

        it('should move an occurrence on a local time skipped at midnight forward by the gap', () => {
          // America/Asuncion springs forward from 00:00 to 01:00 on October 6th, 2024.
          const result = expandDaily(
            '2024-09-01T00:30:00',
            'America/Asuncion',
            '2024-10-06T12:00:00Z',
            0,
          );

          expect(
            result.map((o) => new Date(o.dataTimezone.start.timestamp).toISOString()),
          ).to.deep.equal(['2024-10-06T04:30:00.000Z']); // 01:30 -03:00
          expect(result[0].dataTimezone.start.minutesInDay).to.equal(90);
        });

        it('should start an occurrence on the first instant of a local time repeated by a transition in the southern hemisphere', () => {
          // Pacific/Auckland falls back from 03:00 NZDT to 02:00 NZST on April 5th, 2026.
          const result = expandDaily(
            '2026-03-01T02:30:00',
            'Pacific/Auckland',
            '2026-04-04T12:00:00Z',
            1,
          );

          expect(
            result.map((o) => new Date(o.dataTimezone.start.timestamp).toISOString()),
          ).to.deep.equal(['2026-04-04T13:30:00.000Z', '2026-04-05T14:30:00.000Z']);
        });

        it('should end an all-day occurrence on the last instant of a day whose last hour is repeated in Santiago', () => {
          // America/Santiago falls back from 00:00 to 23:00 on the night of April 6th, 2024.
          const result = expandDaily(
            '2024-04-01T00:00:00',
            'America/Santiago',
            '2024-04-06T12:00:00Z',
            0,
            true,
          );

          expect(new Date(result[0].displayTimezone.end.timestamp).toISOString()).to.equal(
            '2024-04-07T03:59:59.999Z', // 23:59:59.999 -04:00
          );
        });

        it('should keep the local time of an occurrence on a day the system timezone skips it', () => {
          // Australia/Lord_Howe springs forward from 02:00 to 02:30 on October 4th, 2026.
          // Europe/London has no transition that day.
          const result = expandDaily(
            '2026-09-01T02:00:00',
            'Europe/London',
            '2026-10-03T12:00:00Z',
            2,
          );

          expect(
            result.map((o) =>
              adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm'),
            ),
          ).to.deep.equal(['2026-10-03 02:00', '2026-10-04 02:00', '2026-10-05 02:00']);
        });

        it('should create one occurrence per day when the system timezone has its own transition', () => {
          // Australia/Lord_Howe falls back from 02:00 to 01:30 on April 5th, 2026 (April 4th, 15:00 UTC),
          // and America/Santiago falls back from 00:00 to 23:00 twelve hours later.
          const result = expandDaily(
            '2026-03-01T09:00:00',
            'America/Santiago',
            '2026-04-03T12:00:00Z',
            3,
          );

          expect(
            result.map((o) =>
              adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm'),
            ),
          ).to.deep.equal([
            '2026-04-03 09:00',
            '2026-04-04 09:00',
            '2026-04-05 09:00',
            '2026-04-06 09:00',
          ]);
        });

        it('should not loop forever on a weekly rule when the system timezone has its own transition', () => {
          // Australia/Lord_Howe falls back on April 4th, 2026 at 15:00 UTC,
          // and America/Santiago falls back twelve hours later.
          const event = EventBuilder.new(adapter)
            .withDataTimezone('America/Santiago')
            .withDisplayTimezone('America/Santiago')
            .singleDay('2026-03-01T09:00:00')
            .rrule({ freq: 'WEEKLY', byDay: ['SU'] })
            .toProcessed();

          const result = getRecurringEventOccurrencesForVisibleDays(
            event,
            adapter.date('2026-04-03T12:00:00Z', 'default'),
            adapter.date('2026-04-06T12:00:00Z', 'default'),
            adapter,
            'America/Santiago',
          );

          expect(
            result.map((o) =>
              adapter.formatByString(o.dataTimezone.start.value, 'yyyy-MM-dd HH:mm'),
            ),
          ).to.deep.equal(['2026-04-05 09:00']);
        });

        it('should end an all-day occurrence on the last instant of a day whose last hour is repeated', () => {
          // Asia/Beirut falls back from 00:00 to 23:00 on the night of October 26th, 2024.
          const result = expandDaily(
            '2024-10-01T00:00:00',
            'Asia/Beirut',
            '2024-10-26T12:00:00Z',
            0,
            true,
          );

          expect(new Date(result[0].displayTimezone.end.timestamp).toISOString()).to.equal(
            '2024-10-26T21:59:59.999Z', // 23:59:59.999 +02:00
          );
        });
      });
    },
  );
});
