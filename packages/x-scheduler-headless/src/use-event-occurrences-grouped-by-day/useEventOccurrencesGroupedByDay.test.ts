import { adapter, EventBuilder } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { innerGetEventOccurrencesGroupedByDay } from './useEventOccurrencesGroupedByDay';
import { SchedulerProcessedDate, SchedulerProcessedEvent } from '../models';

describe('innerGetEventOccurrencesGroupedByDay', () => {
  const day0Str = '2024-01-10T00:00:00Z';
  const day1Str = '2024-01-11T00:00:00Z';
  const day2Str = '2024-01-12T00:00:00Z';
  const days: SchedulerProcessedDate[] = [
    processDate(adapter.date(day0Str, 'default'), adapter),
    processDate(adapter.date(day1Str, 'default'), adapter),
    processDate(adapter.date(day2Str, 'default'), adapter),
  ];

  const visible: Record<string, boolean> = {
    'Resource A': true,
    'Resource B': true,
  };

  function run(events: SchedulerProcessedEvent[]) {
    return innerGetEventOccurrencesGroupedByDay({
      adapter,
      days,
      events,
      visibleResources: visible,
      displayTimezone: 'default',
      plan: 'premium',
    });
  }

  it('should return empty arrays when no events exist', () => {
    const result = run([]);

    expect(result.get(days[0].key)).to.have.length(0);
    expect(result.get(days[1].key)).to.have.length(0);
    expect(result.get(days[2].key)).to.have.length(0);
  });

  it('should place a single-day event on the correct day', () => {
    const event = EventBuilder.new(adapter).singleDay(day1Str).toProcessed();

    const result = run([event]);

    expect(result.get(days[1].key)).to.have.length(1);
    expect(result.get(days[1].key)![0].id).to.equal(event.id);

    expect(result.get(days[0].key)).to.have.length(0);
    expect(result.get(days[2].key)).to.have.length(0);
  });

  it('should expand a multi-day event into each day', () => {
    const event = EventBuilder.new(adapter).span(day0Str, day2Str).toProcessed();

    const result = run([event]);

    expect(result.get(days[0].key)).to.have.length(1);
    expect(result.get(days[1].key)).to.have.length(1);
    expect(result.get(days[2].key)).to.have.length(1);
  });

  it('should exclude events whose resource is not visible', () => {
    const visibilityWithHidden: Record<string, boolean> = { ...visible, 'Resource X': false };

    const visibleEvent = EventBuilder.new(adapter)
      .resource('Resource A')
      .singleDay(day1Str)
      .toProcessed();

    const invisibleEvent = EventBuilder.new(adapter)
      .resource('Resource X')
      .singleDay(day1Str)
      .toProcessed();

    const result = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days,
      events: [visibleEvent, invisibleEvent],
      visibleResources: visibilityWithHidden,
      displayTimezone: 'default',
      plan: 'premium',
    });

    const list = result.get(days[1].key)!;

    expect(list).to.have.length(1);
    expect(list[0].id).to.equal(visibleEvent.id);
  });

  it('should handle multi-day all-day events correctly', () => {
    const event = EventBuilder.new(adapter).span(day0Str, day2Str, { allDay: true }).toProcessed();

    const result = run([event]);

    expect(result.get(days[0].key)![0].id).to.equal(event.id);
    expect(result.get(days[1].key)![0].id).to.equal(event.id);
    expect(result.get(days[2].key)![0].id).to.equal(event.id);
  });

  it('should support multiple events on multiple days', () => {
    const e1 = EventBuilder.new(adapter).singleDay(day1Str).toProcessed();
    const e2 = EventBuilder.new(adapter).span(day0Str, day2Str).toProcessed();
    const e3 = EventBuilder.new(adapter).singleDay(day2Str).toProcessed();

    const result = run([e1, e2, e3]);

    expect(result.get(days[0].key)!.map((o) => o.id)).to.deep.equal([e2.id]);
    expect(result.get(days[1].key)!.map((o) => o.id)).to.deep.equal([e1.id, e2.id]);
    expect(result.get(days[2].key)!.map((o) => o.id)).to.deep.equal([e2.id, e3.id]);
  });

  it('should convert recurring event occurrences to the display timezone before grouping', () => {
    // Event at Jan 10, 23:00 local time in New York (UTC−5)
    // 2024-01-10 23:00 EST → 2024-01-11T04:00:00Z
    // Display timezone is Europe/Paris (UTC+1 in January),
    // which makes it 2024-01-11 05:00 local Paris time.
    // The occurrence must never appear on Jan 10 in the UI.

    const event = EventBuilder.new(adapter)
      .span('2024-01-11T04:00:00Z', '2024-01-11T05:00:00Z')
      .withDataTimezone('America/New_York')
      .withDisplayTimezone('Europe/Paris')
      .rrule({ freq: 'DAILY' })
      .toProcessed();

    const result = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days,
      events: [event],
      visibleResources: visible,
      displayTimezone: 'Europe/Paris',
      plan: 'premium',
    });

    // Should NOT appear on Jan 10 in Paris
    expect(result.get(days[0].key)).to.have.length(0);

    // Should appear on Jan 11 and Jan 12 in Paris
    expect(result.get(days[1].key)).to.have.length(1);
    expect(result.get(days[1].key)![0].id).to.equal(event.id);

    expect(result.get(days[2].key)).to.have.length(1);
    expect(result.get(days[2].key)![0].id).to.equal(event.id);
  });
});
