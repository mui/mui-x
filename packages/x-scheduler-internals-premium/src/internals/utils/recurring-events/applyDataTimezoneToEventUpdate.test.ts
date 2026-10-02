import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { applyDataTimezoneToEventUpdate } from './applyDataTimezoneToEventUpdate';

describe('applyDataTimezoneToEventUpdate', () => {
  const originalEvent = EventBuilder.new(adapter)
    .startAt('2025-01-07T04:30:00Z')
    .recurrent('WEEKLY')
    .withDataTimezone('America/New_York')
    .withDisplayTimezone('Europe/Madrid')
    .toProcessed();

  it('should relabel the bounds and the exception dates into the data timezone', () => {
    const start = adapter.date('2025-01-08T10:00:00', 'Europe/Madrid');
    const end = adapter.date('2025-01-08T11:00:00', 'Europe/Madrid');
    const exDate = adapter.date('2025-01-15T10:00:00', 'Europe/Madrid');

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: { id: originalEvent.id, start, end, exDates: [exDate] },
    });

    // Relabeled, not converted: the instants are kept.
    expect(adapter.getTimezone(result.start!)).to.equal('America/New_York');
    expect(adapter.isEqual(result.start!, start)).to.equal(true);
    expect(adapter.getTimezone(result.end!)).to.equal('America/New_York');
    expect(adapter.isEqual(result.end!, end)).to.equal(true);
    expect(adapter.getTimezone(result.exDates![0])).to.equal('America/New_York');
    expect(adapter.isEqual(result.exDates![0], exDate)).to.equal(true);
  });

  it('should leave the rule as is', () => {
    // The rule is picked in the data timezone; a relabel would move UNTIL onto another day.
    const rrule = {
      freq: 'WEEKLY' as const,
      byDay: ['TU' as const],
      until: adapter.date('2025-02-01T23:59:59', 'America/New_York'),
    };

    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: { id: originalEvent.id, rrule },
    });

    expect(result.rrule).to.equal(rrule);
  });

  it('should leave a bound the update does not carry untouched', () => {
    const result = applyDataTimezoneToEventUpdate({
      adapter,
      originalEvent,
      changes: { id: originalEvent.id, title: 'Renamed' },
    });

    expect(result).to.deep.equal({ id: originalEvent.id, title: 'Renamed' });
  });
});
