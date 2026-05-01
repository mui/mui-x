import { adapter, EventBuilder } from 'test/utils/scheduler';
import { renderHook } from '@mui/internal-test-utils';
import { useEventOccurrencesWithDayGridPosition } from './useEventOccurrencesWithDayGridPosition';
import { processDate } from '../process-date';
import { SchedulerProcessedEvent } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';

describe('useDayListEventOccurrencesWithPosition', () => {
  const days = [
    processDate(adapter.date('2024-01-15Z', 'default'), adapter),
    processDate(adapter.date('2024-01-16Z', 'default'), adapter),
    processDate(adapter.date('2024-01-17Z', 'default'), adapter),
  ];

  function testHook(events: SchedulerProcessedEvent[]) {
    const { result } = renderHook(() => {
      const occurrencesMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days,
        events,
        visibleResources: {},
        displayTimezone: 'default',
        plan: 'premium',
      });
      return useEventOccurrencesWithDayGridPosition({ days, occurrencesMap });
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
    expect(result.days[2].withPosition[0].position).to.deep.equal({
      index: 2,
      daySpan: 1,
      isInvisible: true,
    });
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
  });
});
