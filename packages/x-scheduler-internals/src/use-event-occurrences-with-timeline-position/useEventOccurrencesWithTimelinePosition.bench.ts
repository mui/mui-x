import { bench, describe } from 'vitest';
import type { SchedulerEventOccurrence } from '../models';
import { computeOccurrencesWithTimelinePosition } from './useEventOccurrencesWithTimelinePosition';

const denseOccurrences = createOccurrences(2_000, () => [0, 60]);
const rollingOccurrences = createOccurrences(10_000, (index) => [index, index + 100]);

describe('timeline occurrence positioning', () => {
  bench('2,000 fully overlapping occurrences', () => {
    computeOccurrencesWithTimelinePosition(denseOccurrences, Infinity);
  });

  bench('10,000 rolling occurrences with 100 concurrent events', () => {
    computeOccurrencesWithTimelinePosition(rollingOccurrences, 1);
  });
});

function createOccurrences(
  count: number,
  getRange: (index: number) => [start: number, end: number],
) {
  return Array.from({ length: count }, (_, index) => {
    const [start, end] = getRange(index);
    return {
      id: index,
      key: String(index),
      displayTimezone: {
        start: { timestamp: start },
        end: { timestamp: end },
      },
    } as SchedulerEventOccurrence;
  });
}
