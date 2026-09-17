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

  it('should keep every stored BYMONTHDAY read as the same day when the selection was left as read', () => {
    // Stored on the 3rd and the 4th with a July 4 UTC start: the 4th is read as the 3rd from
    // New York, so both collapse into one selected day. Editing only the count must keep both.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byMonthDay: [3, 4] })
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

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([
      3, 4,
    ]);
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

  it('should anchor a rule on the edited occurrence instead of the series start', () => {
    // A daily series from July 4 00:00 UTC; the July 20 occurrence shows on July 19 in New
    // York, so a monthly rule picked from it on the 19th must repeat on the 20th.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('DAILY')
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [19] },
      },
      occurrenceStart: adapter.date('2025-07-20T00:00:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([20]);
  });

  it('should keep the stored BYDAY when the selection was left as read across a DST change', () => {
    // Stored on Fridays 04:30 UTC from January: Thursday 23:30 in New York, read as [TH].
    // The July occurrence is Friday 00:30 New York (no day shift). Editing its time and the
    // count without touching the weekday must keep the series on Fridays.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-10T04:30:00Z')
      .recurrent('WEEKLY', { byDay: ['FR'] })
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byDay).to.deep.equal(['TH']);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: adapter.date('2025-07-11T10:00:00', 'America/New_York'),
        rrule: { freq: 'WEEKLY' as const, byDay: ['TH' as const], count: 5 },
      },
      occurrenceStart: adapter.date('2025-07-11T04:30:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal(['FR']);
  });

  it('should keep the stored BYMONTHDAY when the selection was left as read across a DST change', () => {
    // Stored on the 15th at 04:30 UTC from January (the 14th 23:30 in New York, read as [14]).
    // The July occurrence is the 15th 00:30 New York. Editing its time and the count must keep
    // the series on the 15th.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-15T04:30:00Z')
      .recurrent('MONTHLY', { byMonthDay: [15] })
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byMonthDay).to.deep.equal([14]);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        start: adapter.date('2025-07-15T10:00:00', 'America/New_York'),
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [14], count: 5 },
      },
      occurrenceStart: adapter.date('2025-07-15T04:30:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([15]);
  });

  it('should keep the stored BYMONTHDAY when both rules carry an empty BYDAY', () => {
    // The dialog stores every custom rule with both selector arrays, so a monthly rule saved
    // from it carries `byDay: []`. That must not bypass the BYMONTHDAY read selection.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-15T04:30:00Z')
      .recurrent('MONTHLY', { byDay: [], byMonthDay: [15] })
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byMonthDay).to.deep.equal([14]);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byDay: [], byMonthDay: [14], count: 5 },
      },
      occurrenceStart: adapter.date('2025-07-15T04:30:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([15]);
  });

  it('should keep the read BYDAY and project only the added one across a DST change', () => {
    // Stored on Fridays 04:30 UTC from January, read as [TH] in New York. From the July
    // occurrence (Friday 00:30 New York) the user adds Wednesday: Friday must stay.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-10T04:30:00Z')
      .recurrent('WEEKLY', { byDay: ['FR'] })
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'WEEKLY' as const, byDay: ['TH' as const, 'WE' as const] },
      },
      occurrenceStart: adapter.date('2025-07-11T04:30:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal([
      'FR',
      'WE',
    ]);
  });

  it('should keep the read BYMONTHDAY and project only the added one across a DST change', () => {
    // Stored on the 15th at 04:30 UTC from January, read as [14] in New York. From the July
    // occurrence (the 15th 00:30 New York) the user adds the 20th: the 15th must stay.
    const originalEvent = EventBuilder.new(adapter)
      .startAt('2025-01-15T04:30:00Z')
      .recurrent('MONTHLY', { byMonthDay: [15] })
      .withDataTimezone('UTC')
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [14, 20] },
      },
      occurrenceStart: adapter.date('2025-07-15T04:30:00', 'UTC'),
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([
      15, 20,
    ]);
  });

  it('should merge a BYMONTHDAY that projects onto another selected day', () => {
    // July 4 00:00 UTC shows on July 3 in New York: the 3rd projects onto the 4th.
    const originalEvent = utcJuly4AllDayBuilder()
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byMonthDay: [3, 4] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byMonthDay).to.deep.equal([4]);
  });

  it('should project an ordinal BYDAY picked on the display start to the data-timezone position', () => {
    // Friday July 4 00:00 UTC shows on Thursday July 3 in New York: "first Thursday" picked
    // there is the first Friday the series is stored on.
    const originalEvent = utcJuly4AllDayBuilder()
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byDay: ['1TH' as const] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal(['1FR']);
  });

  it('should keep the stored ordinal BYDAY when the selection was left as read', () => {
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byDay: ['1FR'] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byDay).to.deep.equal(['1TH']);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byDay: ['1TH' as const], count: 5 },
      },
    });

    expect(result.rrule).to.deep.equal({
      freq: 'MONTHLY',
      interval: 1,
      byDay: ['1FR'],
      count: 5,
    });
  });

  it('should keep every stored ordinal BYDAY read as the same position when the selection was left as read', () => {
    // Stored on 1FR and 1TH with a July 4 UTC start: 1FR is read as 1TH from New York, so
    // both collapse into one selected position. Editing only the count must keep both.
    const originalEvent = utcJuly4AllDayBuilder()
      .recurrent('MONTHLY', { byDay: ['1FR', '1TH'] })
      .withDisplayTimezone('America/New_York')
      .toProcessed();
    expect(originalEvent.displayTimezone.rrule!.byDay).to.deep.equal(['1TH']);

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byDay: ['1TH' as const], count: 5 },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal([
      '1FR',
      '1TH',
    ]);
  });

  it('should keep an ordinal BYDAY not anchored on the start as is', () => {
    const originalEvent = utcJuly4AllDayBuilder()
      .withDisplayTimezone('America/New_York')
      .toProcessed();

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: {
        id: originalEvent.id,
        rrule: { freq: 'MONTHLY' as const, interval: 1, byDay: ['-1MO' as const] },
      },
    });

    expect((result.rrule as SchedulerProcessedEventRecurrenceRule).byDay).to.deep.equal(['-1MO']);
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
