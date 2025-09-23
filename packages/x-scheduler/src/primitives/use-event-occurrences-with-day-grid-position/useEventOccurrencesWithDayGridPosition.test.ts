import { renderHook } from '@mui/internal-test-utils';
import { useEventOccurrencesWithDayGridPosition } from './useEventOccurrencesWithDayGridPosition';
import { getAdapter } from '../utils/adapter/getAdapter';
import { processDate } from '../utils/event-utils';
import { CalendarEvent } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';

describe('useDayListEventOccurrencesWithPosition', () => {
  const adapter = getAdapter();

  const days = [
    processDate(adapter.date('2024-01-15'), adapter),
    processDate(adapter.date('2024-01-16'), adapter),
    processDate(adapter.date('2024-01-17'), adapter),
  ];

  function testHook(events: CalendarEvent[]) {
    const { result } = renderHook(() => {
      const occurrencesMap = innerGetEventOccurrencesGroupedByDay(
        adapter,
        days,
        'every-day',
        events,
        new Map(),
      );
      return useEventOccurrencesWithDayGridPosition({ days, occurrencesMap });
    });

    return result.current;
  }

  const createEvent = (id: string, start: string, end: string): CalendarEvent => ({
    id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
  });

  it('should set index to 1 for the first event on a day', () => {
    const result = testHook([createEvent('A', '2024-01-15', '2024-01-15')]);

    expect(result.maxIndex).to.equal(1);
    expect(result.days[0].withPosition).to.have.length(1);
    expect(result.days[0].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
  });

  it('should place the occurrences in all the concurrent indexes when in the same day', () => {
    const result = testHook([
      createEvent('A', '2024-01-15', '2024-01-15'),
      createEvent('B', '2024-01-15', '2024-01-15'),
      createEvent('C', '2024-01-15', '2024-01-15'),
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
      createEvent('A', '2024-01-15', '2024-01-16'),
      createEvent('B', '2024-01-16', '2024-01-17'),
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
      createEvent('A', '2024-01-15', '2024-01-16'),
      createEvent('B', '2024-01-16', '2024-01-17'),
      createEvent('C', '2024-01-17', '2024-01-17'),
    ]);

    // Event A is not present on day 3, so event C should use index 1 on that day instead of using index 3 below Event B
    expect(result.maxIndex).to.equal(2);
    expect(result.days[2].withPosition[0].id).to.equal('C');
    expect(result.days[2].withPosition[0].position).to.deep.equal({ index: 1, daySpan: 1 });
  });
});
