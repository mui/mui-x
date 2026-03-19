import { adapter, EventBuilder } from 'test/utils/scheduler';
import { SchedulerEventRecurrenceRule } from '@mui/x-scheduler-headless/models';
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
          adapter.format(adapter.addDays(visibleStart, i), 'localizedNumericDate'),
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

    it('throws an error for ordinal BYDAY values (e.g., 1MO)', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-10T00:00:00Z')
        .rrule({ freq: 'WEEKLY', byDay: ['1MO'] } as SchedulerEventRecurrenceRule)
        .toProcessed();

      expect(() =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          visibleStart,
          adapter.addDays(visibleStart, 7),
          adapter,
          'default',
        ),
      ).to.throw();
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

    it('throws when BYDAY is mixed with BYMONTHDAY', () => {
      const visibleStart = adapter.date('2025-07-01T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-07-01T00:00:00Z')
        .rrule({ freq: 'MONTHLY', byDay: ['2TU'], byMonthDay: [10] })
        .toProcessed();

      expect(() =>
        getRecurringEventOccurrencesForVisibleDays(
          event,
          visibleStart,
          adapter.addMonths(visibleStart, 1),
          adapter,
          'default',
        ),
      ).to.throw();
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
  });
});
