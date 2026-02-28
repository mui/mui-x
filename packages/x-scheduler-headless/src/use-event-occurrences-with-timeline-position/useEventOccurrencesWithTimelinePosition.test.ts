import { adapter, EventBuilder } from 'test/utils/scheduler';
import { renderHook } from '@mui/internal-test-utils';
import { SchedulerProcessedEvent } from '@mui/x-scheduler-headless/models';
import { getOccurrencesFromEvents } from '@mui/x-scheduler-headless/internals';
import { useEventOccurrencesWithTimelinePosition } from './useEventOccurrencesWithTimelinePosition';

describe('useDayListEventOccurrencesWithPosition', () => {
  const collectionStart = adapter.date('2024-01-15', 'default');
  const collectionEnd = adapter.endOfDay(adapter.date('2024-01-15', 'default'));

  function testHook(events: SchedulerProcessedEvent[], maxSpan: number) {
    const { result } = renderHook(() => {
      const occurrences = getOccurrencesFromEvents({
        adapter,
        start: collectionStart,
        end: collectionEnd,
        events,
        displayTimezone: 'default',
        visibleResources: {},
        plan: 'premium',
      });
      return useEventOccurrencesWithTimelinePosition({ occurrences, maxSpan });
    });

    return result.current;
  }

  it('should set firstIndex and lastIndex to all events when no events are overlapping', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T13:30:00Z', 180).toProcessed(),
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
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
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
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z').toProcessed(),
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
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').toProcessed(),
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

  it('should span non overlapping events across all the available columns when maxSpan is large enough', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
      ],
      Infinity,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 3 });
  });

  it('should not span non overlapping events across all the available columns when maxSpan=1', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
      ],
      1,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
  });

  it('should respect maxSpan for non overlapping events when maxSpan is lower than the free space', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T15:00:00Z').toProcessed(),
      ],
      2,
    );

    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences).to.have.length(4);
    expect(result.occurrences[3].id).to.equal('D');
    expect(result.occurrences[3].position).to.deep.equal({ firstIndex: 1, lastIndex: 2 });
  });

  it('should span overlapping events across all the available columns when maxSpan is large enough', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 120).toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T11:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T11:30:00Z', 420).toProcessed(),
        EventBuilder.new().id('E').singleDay('2024-01-15T15:00:00Z').toProcessed(),
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

  it('should respect maxSpan for overlapping events when maxSpan is lower than the free space', () => {
    const result = testHook(
      [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 120).toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T11:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T11:30:00Z', 420).toProcessed(),
        EventBuilder.new().id('E').singleDay('2024-01-15T15:00:00Z').toProcessed(),
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
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z', 240).toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T12:00:00Z').toProcessed(),
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
