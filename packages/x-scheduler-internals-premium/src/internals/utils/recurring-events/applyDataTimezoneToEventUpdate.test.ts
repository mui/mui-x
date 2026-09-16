import { adapter, EventBuilder, utcJuly4AllDayBuilder } from 'test/utils/scheduler';
import type { SchedulerProcessedEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import { applyDataTimezoneToEventUpdate } from './applyDataTimezoneToEventUpdate';

describe('applyDataTimezoneToEventUpdate', () => {
  it('projects UNTIL to data timezone when updating recurrence rule', () => {
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-07T04:30:00Z')
      .recurrent('WEEKLY')
      .withDataTimezone('America/New_York')
      .withDisplayTimezone('Europe/Madrid')
      .toProcessed();

    const untilInDisplay = adapter.date('2025-02-01T00:00:00Z', 'Europe/Madrid');

    const changes = {
      id: originalEvent.id,
      rrule: {
        freq: 'WEEKLY' as const,
        byDay: ['TU' as const],
        until: untilInDisplay,
      },
    };

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes,
    });

    expect(
      adapter.getTimezone((result.rrule as SchedulerProcessedEventRecurrenceRule).until!),
    ).to.equal('America/New_York');
  });

  it('projects multiple BYDAY from display timezone back to data timezone using DTSTART as anchor', () => {
    const originalEvent = EventBuilder.new(adapter)
      // 2025-01-07T04:30:00Z represents:
      // - Monday 23:30 in New York (UTC-5)
      // - Tuesday 05:30 in Madrid (UTC+1)
      .startAt('2025-01-07T04:30:00Z')
      .recurrent('WEEKLY', { byDay: ['MO'] })
      .withDataTimezone('America/New_York')
      .withDisplayTimezone('Europe/Madrid')
      .toProcessed();

    const changes = {
      id: originalEvent.id,
      rrule: {
        freq: 'WEEKLY' as const,
        byDay: ['WE' as const, 'TH' as const], // What the user selects in the UI (Madrid)
      },
    };

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes,
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule)!.byDay).to.deep.equal([
      'TU',
      'WE',
    ]);
  });

  it('should project BYDAY from the given rule start instead of the stored one', () => {
    // Friday 00:00 UTC shows on Thursday 20:00 in New York.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-07-04T00:00:00Z')
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    // The edit moves it to Thursday 10:00 in New York, which is Thursday 14:00 UTC.
    const editedStart = adapter.date('2025-07-03T10:00:00', 'America/New_York');

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: editedStart,
        rrule: { freq: 'WEEKLY' as const, byDay: ['TH' as const] },
      },
      ruleStart: editedStart,
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal(['TH']);
  });

  it('should project a BYMONTHDAY anchored on the start to the data-timezone day', () => {
    // July 4 00:00 UTC shows on July 3 in New York.
    const originalEvent = utcJuly4AllDayBuilder()
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([4]);
  });

  it('should keep the stored BYMONTHDAY when the selection was left as read', () => {
    // Stored on the 3rd with a July 4 UTC start: the display projection leaves the 3rd in
    // place (it is not the start's day), which is also New York's start day. Editing only
    // the count must not project that 3rd onto the 4th.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byMonthDay: [3] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byMonthDay).to.deep.equal([3]);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3], count: 5 },
      },
    });

    expect(result.rrule).to.deep.equal({
      freq: 'MONTHLY',
      interval: 1,
      byMonthDay: [3],
      count: 5,
    });
  });

  it('should project a BYMONTHDAY anchored on the edited start instead of the stored one', () => {
    // July 4 00:00 UTC shows on July 3 in New York; edited to July 3 10:00 New York it is
    // July 3 14:00 UTC, so the 3rd picked against it stays the 3rd.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('DAILY')
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    const editedStart = adapter.date('2025-07-03T10:00:00', 'America/New_York');

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: editedStart,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3] },
      },
      ruleStart: editedStart,
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([3]);
  });

  it('should project the read BYMONTHDAY again when the edited start moves onto its display day', () => {
    // Stored on the 4th with a July 4 UTC start, read as the 3rd from New York. Moving the
    // start to July 3 10:00 New York (July 3 UTC) makes the untouched 3rd the start's own
    // day in both timezones, so the stored 4th must not be kept.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byMonthDay: [4] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byMonthDay).to.deep.equal([3]);
    const editedStart = adapter.date('2025-07-03T10:00:00', 'America/New_York');

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: editedStart,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3] },
      },
      ruleStart: editedStart,
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([3]);
  });

  it('should keep the stored BYMONTHDAY when the edited start stays on its data-timezone day', () => {
    // Stored on the 3rd (a custom day) with a July 4 UTC start. Moving the start to July 3
    // 21:00 New York (July 4 01:00 UTC) keeps it on the 4th in UTC, so the read 3rd still
    // stands for the stored 3rd.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byMonthDay: [3] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    const editedStart = adapter.date('2025-07-03T21:00:00', 'America/New_York');

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: editedStart,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3] },
      },
      ruleStart: editedStart,
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([3]);
  });

  it('should project a BYMONTHDAY selection that changed from the read one', () => {
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byMonthDay: [15] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([4]);
  });

  it('should keep a BYMONTHDAY not anchored on the start as is', () => {
    const originalEvent = utcJuly4AllDayBuilder()
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [15] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([15]);
  });
});
