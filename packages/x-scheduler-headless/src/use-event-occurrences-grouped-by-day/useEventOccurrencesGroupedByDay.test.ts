import { adapter, EventBuilder } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { innerGetEventOccurrencesGroupedByDay } from './useEventOccurrencesGroupedByDay';
import { SchedulerProcessedDate, SchedulerEventOccurrence } from '../models';

describe('innerGetEventOccurrencesGroupedByDay', () => {
  const day0Str = '2024-01-10T00:00:00Z';
  const day1Str = '2024-01-11T00:00:00Z';
  const day2Str = '2024-01-12T00:00:00Z';
  const days: SchedulerProcessedDate[] = [
    processDate(adapter.date(day0Str, 'default'), adapter),
    processDate(adapter.date(day1Str, 'default'), adapter),
    processDate(adapter.date(day2Str, 'default'), adapter),
  ];

  const visible = new Map<string, boolean>([
    ['Resource A', true],
    ['Resource B', true],
  ]);

  const noParents = new Map<string, string | null>();

  function run(events: SchedulerEventOccurrence[]) {
    return innerGetEventOccurrencesGroupedByDay({
      adapter,
      days,
      events,
      visibleResources: visible,
      resourceParentIds: noParents,
    });
  }

  it('should return empty arrays when no events exist', () => {
    const result = run([]);

    expect(result.get(days[0].key)).to.have.length(0);
    expect(result.get(days[1].key)).to.have.length(0);
    expect(result.get(days[2].key)).to.have.length(0);
  });

  it('should place a single-day event on the correct day', () => {
    const event = EventBuilder.new(adapter).singleDay(day1Str).toOccurrence();

    const result = run([event]);

    expect(result.get(days[1].key)).to.have.length(1);
    expect(result.get(days[1].key)![0].id).to.equal(event.id);

    expect(result.get(days[0].key)).to.have.length(0);
    expect(result.get(days[2].key)).to.have.length(0);
  });

  it('should expand a multi-day event into each day', () => {
    const event = EventBuilder.new(adapter).span(day0Str, day2Str).toOccurrence();

    const result = run([event]);

    expect(result.get(days[0].key)).to.have.length(1);
    expect(result.get(days[1].key)).to.have.length(1);
    expect(result.get(days[2].key)).to.have.length(1);
  });

  it('should exclude events whose resource is not visible', () => {
    const visibilityWithHidden = new Map(visible);
    visibilityWithHidden.set('Resource X', false);

    const visibleEvent = EventBuilder.new(adapter)
      .resource('Resource A')
      .singleDay(day1Str)
      .toOccurrence();

    const invisibleEvent = EventBuilder.new(adapter)
      .resource('Resource X')
      .singleDay(day1Str)
      .toOccurrence();

    const result = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days,
      events: [visibleEvent, invisibleEvent],
      visibleResources: visibilityWithHidden,
      resourceParentIds: noParents,
    });

    const list = result.get(days[1].key)!;

    expect(list).to.have.length(1);
    expect(list[0].id).to.equal(visibleEvent.id);
  });

  it('should handle multi-day all-day events correctly', () => {
    const event = EventBuilder.new(adapter).span(day0Str, day2Str, { allDay: true }).toOccurrence();

    const result = run([event]);

    expect(result.get(days[0].key)![0].id).to.equal(event.id);
    expect(result.get(days[1].key)![0].id).to.equal(event.id);
    expect(result.get(days[2].key)![0].id).to.equal(event.id);
  });

  it('should support multiple events on multiple days', () => {
    const e1 = EventBuilder.new(adapter).singleDay(day1Str).toOccurrence();
    const e2 = EventBuilder.new(adapter).span(day0Str, day2Str).toOccurrence();
    const e3 = EventBuilder.new(adapter).singleDay(day2Str).toOccurrence();

    const result = run([e1, e2, e3]);

    expect(result.get(days[0].key)!.map((o) => o.id)).to.deep.equal([e2.id]);
    expect(result.get(days[1].key)!.map((o) => o.id)).to.deep.equal([e1.id, e2.id]);
    expect(result.get(days[2].key)!.map((o) => o.id)).to.deep.equal([e2.id, e3.id]);
  });
});
