import { renderHook } from '@mui/internal-test-utils';
import { useEventOccurrencesWithTimelinePosition } from './useEventOccurrencesWithTimelinePosition';
import { getAdapter } from '../utils/adapter/getAdapter';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { CalendarEvent } from '../models';

describe('useDayListEventOccurrencesWithPosition', () => {
  const adapter = getAdapter();

  const collectionStart = adapter.date('2024-01-15');
  const collectionEnd = adapter.endOfDay(adapter.date('2024-01-15'));

  function testHook(events: CalendarEvent[], maxColumnSpan: number) {
    const { result } = renderHook(() => {
      const occurrences = getOccurrencesFromEvents({
        adapter,
        start: collectionStart,
        end: collectionEnd,
        events,
        visibleResources: new Map(),
      });
      return useEventOccurrencesWithTimelinePosition({ occurrences, maxColumnSpan });
    });

    return result.current;
  }

  const createEvent = (id: string, start: string, end: string): CalendarEvent => ({
    id,
    start: adapter.date(start),
    end: adapter.date(end),
    title: `Event ${id}`,
  });

  it('should set firstIndex and lastIndex to all events when no events are overlapping', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('A', '2024-01-15T12:00:00', '2024-01-15T13:00:00'),
        createEvent('A', '2024-01-15T13:30:00', '2024-01-15T16:30:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(1);
    expect(result.occurrences).to.have.length(3);
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[2].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
  });

  it('should place overlapping events in different columns (same starting time)', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T12:00:00'),
        createEvent('B', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(2);
    expect(result.occurrences).to.have.length(2);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 2, lastIndex: 2 });
  });

  it('should place overlapping events in different columns (different starting time)', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T12:00:00'),
        createEvent('B', '2024-01-15T10:30:00', '2024-01-15T11:30:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(2);
    expect(result.occurrences).to.have.length(2);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 2, lastIndex: 2 });
  });

  it('should place events in the same column when event A ends exactly when event B starts', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T12:00:00'),
        createEvent('B', '2024-01-15T12:00:00', '2024-01-15T13:00:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(1);
    expect(result.occurrences).to.have.length(2);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
  });

  it('should span non overlapping events across all the available columns when maxColumnSpan is large enough', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('B', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('C', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('D', '2024-01-15T15:00:00', '2024-01-15T16:00:00'),
      ],
      Infinity,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 3 });
  });

  it('should not span non overlapping events across all the available columns when maxColumnSpan=1', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('B', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('C', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('D', '2024-01-15T15:00:00', '2024-01-15T16:00:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
  });

  it('should respect maxColumnSpan for non overlapping events when maxColumnSpan is lower than the free space', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('B', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('C', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('D', '2024-01-15T15:00:00', '2024-01-15T16:00:00'),
      ],
      2,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 2 });
  });

  it('should span overlapping events across all the available columns when maxColumnSpan is large enough', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T12:00:00'),
        createEvent('B', '2024-01-15T10:30:00', '2024-01-15T12:30:00'),
        createEvent('C', '2024-01-15T11:00:00', '2024-01-15T13:00:00'),
        createEvent('D', '2024-01-15T11:30:00', '2024-01-15T18:30:00'),
        createEvent('E', '2024-01-15T15:00:00', '2024-01-15T16:00:00'),
      ],
      Infinity,
    );

    expect(result.maxIndex).to.equal(4);
    expect(result.occurrences).to.have.length(5);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 2, lastIndex: 2 });
    expect(result.occurrences[2].id).to.equal('C');
    expect(result.occurrences[2].position).to.deep.equal({ firstIndex: 3, lastIndex: 3 });
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 4, lastIndex: 4 });
    expect(result.occurrences[4].id).to.equal('E');
    expect(result.occurrences[4].position).to.deep.equal({ firstIndex: 1, lastIndex: 3 });
  });

  it('should respect maxColumnSpan for overlapping events when maxColumnSpan is lower than the free space', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T12:00:00'),
        createEvent('B', '2024-01-15T10:30:00', '2024-01-15T12:30:00'),
        createEvent('C', '2024-01-15T11:00:00', '2024-01-15T13:00:00'),
        createEvent('D', '2024-01-15T11:30:00', '2024-01-15T18:30:00'),
        createEvent('E', '2024-01-15T15:00:00', '2024-01-15T16:00:00'),
      ],
      2,
    );

    expect(result.maxIndex).to.equal(4);
    expect(result.occurrences).to.have.length(5);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 2, lastIndex: 2 });
    expect(result.occurrences[2].id).to.equal('C');
    expect(result.occurrences[2].position).to.deep.equal({ firstIndex: 3, lastIndex: 3 });
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 4, lastIndex: 4 });
    expect(result.occurrences[4].id).to.equal('E');
    expect(result.occurrences[4].position).to.deep.equal({ firstIndex: 1, lastIndex: 2 });
  });

  it('should place event in the first column when overlapping when an event in the second column but the first column is free', () => {
    const result = testHook(
      [
        createEvent('A', '2024-01-15T10:00:00', '2024-01-15T11:00:00'),
        createEvent('B', '2024-01-15T10:30:00', '2024-01-15T14:30:00'),
        createEvent('C', '2024-01-15T12:00:00', '2024-01-15T13:00:00'),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(2);
    expect(result.occurrences).to.have.length(3);
    expect(result.occurrences[0].id).to.equal('A');
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[1].id).to.equal('B');
    expect(result.occurrences[1].position).to.deep.equal({ firstIndex: 2, lastIndex: 2 });
    expect(result.occurrences[2].id).to.equal('C');
    expect(result.occurrences[2].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
  });
});
