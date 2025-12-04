import { adapter, EventBuilder } from 'test/utils/scheduler';
import { diffIn } from '@mui/x-scheduler-headless/use-adapter';
import { getRecurringEventOccurrencesForVisibleDaysV2 } from './getRecurringEventOccurrencesForVisibleDaysV2';
import { getWeekDayCode } from './internal-utils';

describe('recurring-events/getRecurringEventOccurrencesForVisibleDaysV2', () => {
  describe('getRecurringEventOccurrencesForVisibleDaysV2', () => {
    it('generates daily timed occurrences within visible range preserving duration', () => {
      const visibleStart = adapter.date('2025-01-10T00:00:00Z', 'default');
      const event = EventBuilder.new()
        .singleDay('2025-01-10T09:00:00Z', 90)
        .rrule({ freq: 'DAILY', interval: 1 })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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
      const event = EventBuilder.new()
        .singleDay('2025-01-01T09:00:00Z')
        .rrule({ freq: 'DAILY', interval: 1, until })
        .toProcessed();

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
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

      const result = getRecurringEventOccurrencesForVisibleDaysV2(
        event,
        visibleStart,
        adapter.addDays(visibleStart, 28),
        adapter,
      );
      expect(result).to.have.length(0);
    });
  });
});
