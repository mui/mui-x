import { adapter, EventBuilder } from 'test/utils/scheduler';
import { renderHook } from '@mui/internal-test-utils';
import type { SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import { getOccurrencesFromEvents } from '@mui/x-scheduler-internals/internals';
import { sortEventOccurrences } from '@mui/x-scheduler-internals/sort-event-occurrences';
import { describe, it, expect } from 'vitest';
import {
  computeOccurrencesWithTimelinePosition,
  computeOccurrencesFirstIndexLookup,
  useEventOccurrencesWithTimelinePosition,
} from './useEventOccurrencesWithTimelinePosition';

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
        recurringEventsPlugin: null,
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

  describe('computeOccurrencesFirstIndexLookup', () => {
    it('should return the same firstIndex as the hook for overlapping occurrences', () => {
      const events = [
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 120).toProcessed(),
        EventBuilder.new().id('B').singleDay('2024-01-15T10:00:00Z').toProcessed(),
        EventBuilder.new().id('C').singleDay('2024-01-15T10:30:00Z', 240).toProcessed(),
        EventBuilder.new().id('D').singleDay('2024-01-15T13:00:00Z').toProcessed(),
      ];
      const result = testHook(events, 1);

      const occurrences = getOccurrencesFromEvents({
        adapter,
        start: collectionStart,
        end: collectionEnd,
        events,
        displayTimezone: 'default',
        visibleResources: {},
        recurringEventsPlugin: null,
      });
      const lookup = computeOccurrencesFirstIndexLookup(occurrences);

      expect(Object.keys(lookup)).to.have.length(result.occurrences.length);
      for (const occurrence of result.occurrences) {
        expect(lookup[occurrence.key]).to.equal(occurrence.position.firstIndex);
      }
    });
  });

  it('should update the available span when a freed lane is reused', () => {
    const occurrences = [
      EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z', 30).toOccurrence(),
      EventBuilder.new().id('B').singleDay('2024-01-15T10:01:00Z', 39).toOccurrence(),
      EventBuilder.new().id('C').singleDay('2024-01-15T10:10:00Z', 120).toOccurrence(),
      EventBuilder.new().id('D').singleDay('2024-01-15T10:50:00Z', 60).toOccurrence(),
      EventBuilder.new().id('E').singleDay('2024-01-15T11:00:00Z', 30).toOccurrence(),
    ];

    const resultBeforeReuse = computeOccurrencesWithTimelinePosition(
      occurrences.slice(0, -1),
      Infinity,
    );
    const result = computeOccurrencesWithTimelinePosition(occurrences, Infinity);

    expect(resultBeforeReuse.occurrences[3].position).to.deep.equal({
      firstIndex: 1,
      lastIndex: 2,
    });
    expect(result.maxIndex).to.equal(3);
    expect(result.occurrences.map(({ id, position }) => ({ id, ...position }))).to.deep.equal([
      { id: 'A', firstIndex: 1, lastIndex: 1 },
      { id: 'B', firstIndex: 2, lastIndex: 2 },
      { id: 'C', firstIndex: 3, lastIndex: 3 },
      { id: 'D', firstIndex: 1, lastIndex: 1 },
      { id: 'E', firstIndex: 2, lastIndex: 2 },
    ]);
  });

  it('should match the quadratic layout for varied event distributions', () => {
    let seed = 239;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let iteration = 0; iteration < 100; iteration += 1) {
      const occurrenceCount = 1 + Math.floor(random() * 40);
      const occurrences = Array.from({ length: occurrenceCount }, (_, index) => {
        const startMinutes = Math.floor(random() * 12) * 30;
        const durationMinutes = Math.floor(random() * 9) * 15;
        const start = adapter.addMinutes(collectionStart, startMinutes).toISOString();
        return EventBuilder.new()
          .id(`${iteration}-${index}`)
          .singleDay(start, durationMinutes)
          .toOccurrence();
      });
      const maxSpan = [1, 2, 4, Infinity][iteration % 4];

      const result = computeOccurrencesWithTimelinePosition(occurrences, maxSpan);
      const expected = computeLayoutQuadratically(occurrences, maxSpan);

      expect(result.occurrences.map(({ id, position }) => ({ id, ...position }))).to.deep.equal(
        expected.occurrences,
      );
      expect(result.maxIndex).to.equal(expected.maxIndex);
    }
  });

  it('should position a dense set of occurrences', () => {
    const occurrences = Array.from({ length: 1_000 }, (_, index) =>
      EventBuilder.new().id(index).singleDay('2024-01-15T10:00:00Z', 120).toOccurrence(),
    );

    const result = computeOccurrencesWithTimelinePosition(occurrences, Infinity);

    expect(result.maxIndex).to.equal(1_000);
    expect(result.occurrences[0].position).to.deep.equal({ firstIndex: 1, lastIndex: 1 });
    expect(result.occurrences[999].position).to.deep.equal({
      firstIndex: 1_000,
      lastIndex: 1_000,
    });
  });
});

function computeLayoutQuadratically(
  occurrences: ReturnType<EventBuilder['toOccurrence']>[],
  maxSpan: number,
) {
  const sortedOccurrences = sortEventOccurrences(occurrences);
  const firstIndexLookup: Record<string, number> = {};
  let maxIndex = 1;

  for (let index = 0; index < sortedOccurrences.length; index += 1) {
    const occurrence = sortedOccurrences[index];
    const usedIndexes = new Set<number>();
    for (let previousIndex = 0; previousIndex < index; previousIndex += 1) {
      const previousOccurrence = sortedOccurrences[previousIndex];
      if (
        previousOccurrence.displayTimezone.end.timestamp >
        occurrence.displayTimezone.start.timestamp
      ) {
        usedIndexes.add(firstIndexLookup[previousOccurrence.key]);
      }
    }

    let firstIndex = 1;
    while (usedIndexes.has(firstIndex)) {
      firstIndex += 1;
    }
    firstIndexLookup[occurrence.key] = firstIndex;
    maxIndex = Math.max(maxIndex, firstIndex);
  }

  return {
    occurrences: sortedOccurrences.map((occurrence, index) => {
      const firstIndex = firstIndexLookup[occurrence.key];
      const usedIndexes = new Set(
        sortedOccurrences
          .filter((otherOccurrence, otherIndex) =>
            otherIndex < index
              ? otherOccurrence.displayTimezone.end.timestamp >
                occurrence.displayTimezone.start.timestamp
              : otherIndex > index &&
                otherOccurrence.displayTimezone.start.timestamp <
                  occurrence.displayTimezone.end.timestamp,
          )
          .map((otherOccurrence) => firstIndexLookup[otherOccurrence.key]),
      );
      let lastIndex = firstIndex;
      while (
        !usedIndexes.has(lastIndex + 1) &&
        lastIndex < maxIndex &&
        lastIndex - firstIndex < maxSpan - 1
      ) {
        lastIndex += 1;
      }

      return { id: occurrence.id, firstIndex, lastIndex };
    }),
    maxIndex,
  };
}
