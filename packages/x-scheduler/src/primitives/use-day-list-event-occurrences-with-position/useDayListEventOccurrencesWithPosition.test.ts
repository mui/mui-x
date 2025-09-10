import { renderHook } from '@mui/internal-test-utils';
import { useDayListEventOccurrencesWithPosition } from './useDayListEventOccurrencesWithPosition';
import { getAdapter } from '../utils/adapter/getAdapter';
import { processDate } from '../utils/event-utils';
import { CalendarEvent, CalendarEventOccurrence } from '../models';
import { innerGetEventOccurrences } from '../use-event-occurrences';

describe('useDayListEventOccurrencesWithPosition', () => {
  const adapter = getAdapter();

  const days = [
    processDate(adapter.date('2024-01-15'), adapter),
    processDate(adapter.date('2024-01-16'), adapter),
    processDate(adapter.date('2024-01-17'), adapter),
  ];

  function testHook(events: CalendarEvent[]) {
    const { result } = renderHook(() => {
      const occurrencesMap = innerGetEventOccurrences(
        adapter,
        days,
        'every-day',
        events,
        new Map(),
      );
      return useDayListEventOccurrencesWithPosition({ days, occurrencesMap });
    });

    return result.current;
  }

  const createEventOccurrence = (
    id: string,
    start: string,
    end: string,
  ): CalendarEventOccurrence => ({
    id,
    key: id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
  });

  it('should set index to 1 for the first event on a day', () => {
    const result = testHook([createEventOccurrence('A', '2024-01-15', '2024-01-15')]);

    expect(result[0].maxConcurrentEvents).to.equal(1);
    expect(result[0].withPosition).to.have.length(1);
    expect(result[0].withPosition[0].position).to.deep.equal({ index: 1, span: 1 });
  });

  it('should place the occurrences in all the concurrent indexes when in the same day', () => {
    const result = testHook([
      createEventOccurrence('A', '2024-01-15', '2024-01-15'),
      createEventOccurrence('B', '2024-01-15', '2024-01-15'),
      createEventOccurrence('C', '2024-01-15', '2024-01-15'),
    ]);

    expect(result[0].maxConcurrentEvents).to.equal(3);
    expect(result[0].withPosition[0].id).to.equal('A');
    expect(result[0].withPosition[0].position).to.deep.equal({ index: 1, span: 1 });
    expect(result[0].withPosition[1].id).to.equal('B');
    expect(result[0].withPosition[1].position).to.deep.equal({ index: 2, span: 1 });
    expect(result[0].withPosition[2].id).to.equal('C');
    expect(result[0].withPosition[2].position).to.deep.equal({ index: 3, span: 1 });
  });

  it('should keep the same index for multi-day events and set span=0 for all days but the first one', () => {
    const result = testHook([
      createEventOccurrence('A', '2024-01-15', '2024-01-15'),
      createEventOccurrence('B', '2024-01-15', '2024-01-17'),
    ]);

    expect(result[0].maxConcurrentEvents).to.equal(2);
    expect(result[0].withPosition[1].id).to.equal('B');
    expect(result[0].withPosition[1].position).to.deep.equal({ index: 2, span: 3 });

    expect(result[1].maxConcurrentEvents).to.equal(2);
    expect(result[1].withPosition[0].id).to.equal('B');
    expect(result[1].withPosition[0].position).to.deep.equal({ index: 2, span: 0 });

    expect(result[2].maxConcurrentEvents).to.equal(2);
    expect(result[2].withPosition[0].id).to.equal('B');
    expect(result[2].withPosition[0].position).to.deep.equal({ index: 2, span: 0 });
  });

  it('should find gaps in the indexes and use the lower available', () => {
    const result = testHook([
      createEventOccurrence('A', '2024-01-15', '2024-01-16'),
      createEventOccurrence('B', '2024-01-16', '2024-01-17'),
      createEventOccurrence('C', '2024-01-17', '2024-01-17'),
    ]);

    // Event A is not present on day 3, so event C should use index 1 on that day instead of using index 3 below Event B
    expect(result[2].maxConcurrentEvents).to.equal(2);
    expect(result[2].withPosition[1].id).to.equal('C');
    expect(result[2].withPosition[1].position).to.deep.equal({ index: 1, span: 1 });
  });
});
