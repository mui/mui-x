import { adapter, EventBuilder } from 'test/utils/scheduler';
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
});
