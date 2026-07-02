import { adapter, EventBuilder } from 'test/utils/scheduler';
import { renderHook } from '@mui/internal-test-utils';
import { useEventOccurrencesWithDayGridPosition } from './useEventOccurrencesWithDayGridPosition';
import { processDate } from '../process-date';
import type { SchedulerProcessedEvent } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';

describe('useDayListEventOccurrencesWithPosition', () => {
  const days = [
    processDate(adapter.date('2024-01-15Z', 'default'), adapter),
    processDate(adapter.date('2024-01-16Z', 'default'), adapter),
    processDate(adapter.date('2024-01-17Z', 'default'), adapter),
  ];

  function testHook(events: SchedulerProcessedEvent[], maxEvents?: number) {
    const { result } = renderHook(() => {
      const occurrencesMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days,
        events,
        visibleResources: {},
        displayTimezone: 'default',
        recurringEventsPlugin: null,
      });
      return useEventOccurrencesWithDayGridPosition({ days, occurrencesMap, maxEvents });
    });

    return result.current;
  }

  it('should set index to 1 for the first event on a day', () => {
    const result = testHook([EventBuilder.new().singleDay('2024-01-15Z').toProcessed()]);

    expect(result.maxIndex).to.equal(1);
    expect(result.days[0].withPosition).to.have.length(1);
    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
  });

  it('should place the occurrences in all the concurrent indexes when in the same day', () => {
    const result = testHook([
      EventBuilder.new().id('A').singleDay('2024-01-15Z').toProcessed(),
      EventBuilder.new().id('B').singleDay('2024-01-15Z').toProcessed(),
      EventBuilder.new().id('C').singleDay('2024-01-15Z').toProcessed(),
    ]);

    expect(result.maxIndex).to.equal(3);
    expect(result.days[0].withPosition[0].id).to.equal('A');
    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
    expect(result.days[0].withPosition[1].id).to.equal('B');
    expect(result.days[0].withPosition[1].position).to.deep.equal({ index: 2, daySpan: 1 });
    expect(result.days[0].withPosition[2].id).to.equal('C');
    expect(result.days[0].withPosition[2].position).to.deep.equal({ index: 3, daySpan: 1 });
  });

  it('should keep the same index for multi-day events and set daySpan=1 and isInvisible: true for all days but the first one', () => {
    const result = testHook([
      EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
      EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
    ]);

    expect(result.maxIndex).to.equal(2);
    expect(result.days[1].withPosition[1].id).to.equal('B');
    expect(result.days[1].withPosition[1].position).to.deep.equal({ index: 2, daySpan: 2 });
    expect(result.days[2].withPosition[0].id).to.equal('B');
    // Event B was visible on day 2, so it stays in row 2 — no compaction to row 1
    expect(result.days[2].withPosition[0].position).to.deep.equal({
      index: 2,
      daySpan: 1,
      isInvisible: true,
    });
  });

  it('should mark a hidden event as isContinuation when a visible row opens up', () => {
    // A (row 1) spans days 1–3, B (row 2) spans days 1–2 only.
    // C first appears on day 2 as a new event and gets hidden (row 3 > maxEvents=2).
    // On day 3 B is absent → row 2 is free → C resurfaces with isContinuation.
    const result = testHook(
      [
        // endAt('2024-01-17Z') → endOfDay(Jan 17) → event IS visible on Jan 17 (day 3)
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-17Z').toProcessed(),
        // endAt('2024-01-16Z') → endOfDay(Jan 16) → event ends before Jan 17, so absent on day 3
        EventBuilder.new().id('B').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
        // C starts on day 2, endAt('2024-01-17Z') → also visible on day 3
        EventBuilder.new().id('C').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
      ],
      2,
    );

    // C first appears on day 2 hidden (index > maxEvents=2)
    expect(result.days[1].withPosition.find((o) => o.id === 'C')!.position.index).to.be.greaterThan(
      2,
    );

    // C resurfaces on day 3 as a continuation in a visible row
    const cDay3 = result.days[2].withPosition.find((o) => o.id === 'C')!;
    expect(cDay3.position.isContinuation).to.equal(true);
    expect(cDay3.position.index).to.be.lessThanOrEqual(2);
  });

  it('should not collide with visible events when a large-span hidden event could resurface', () => {
    // C starts on day 2 with a larger total span (6 days) than A and B (3 days each).
    // Because C has the largest span, it is sorted first among active events on day 3.
    // Without the pre-reservation fix, C would steal row 1 from A. With the fix it
    // correctly finds that rows 1 and 2 are already reserved and stays hidden (row 3).
    const result = testHook(
      [
        EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-18Z').toProcessed(),
        EventBuilder.new().id('B').startAt('2024-01-15Z').endAt('2024-01-18Z').toProcessed(),
        EventBuilder.new().id('C').startAt('2024-01-16Z').endAt('2024-01-22Z').toProcessed(),
      ],
      2,
    );

    for (const day of result.days.slice(1)) {
      const a = day.withPosition.find((o) => o.id === 'A')!;
      const b = day.withPosition.find((o) => o.id === 'B')!;
      const c = day.withPosition.find((o) => o.id === 'C')!;

      // A must remain at row 1 and B at row 2 — the pre-reservation prevents C from
      // bumping A off its row.
      expect(a.position.index).to.equal(1);
      expect(b.position.index).to.equal(2);
      // C must stay beyond the visible threshold, never colliding with A or B.
      expect(c.position.index).to.be.greaterThan(2);
    }
  });

  it('should find gaps in the indexes and use the lower available', () => {
    const result = testHook([
      EventBuilder.new().id('A').startAt('2024-01-15Z').endAt('2024-01-16Z').toProcessed(),
      EventBuilder.new().id('B').startAt('2024-01-16Z').endAt('2024-01-17Z').toProcessed(),
      EventBuilder.new().id('C').singleDay('2024-01-17Z').toProcessed(),
    ]);

    // Event A is not present on day 3, so event C should use index 1 on that day instead of using index 3 below Event B
    expect(result.maxIndex).to.equal(2);
    expect(result.days[2].withPosition[0].id).to.equal('C');
    expect(result.days[2].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
    expect(result.days[2].withPosition[1].id).to.equal('B');
    expect(result.days[2].withPosition[1].position).to.deep.equal({
      index: 2,
      daySpan: 1,
      isInvisible: true,
    });
  });
});
