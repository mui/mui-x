import { bench, describe } from 'vitest';
import { createEventTimelinePremiumOccurrenceIndex } from './eventTimelinePremiumOccurrenceIndex';

const occurrenceCount = 50_000;
const occurrences = Array.from({ length: occurrenceCount }, (_, index) => ({
  id: index,
  start: index / occurrenceCount,
  end: (index + 1) / occurrenceCount,
}));
const start = 0.5;
const end = 0.51;
const occurrenceIndex = createEventTimelinePremiumOccurrenceIndex(occurrences);
export const benchmarkResult = { value: undefined as unknown };

describe('event timeline horizontal window lookup', () => {
  bench('build an index of 50k occurrences', () => {
    const index = createEventTimelinePremiumOccurrenceIndex(occurrences);
    benchmarkResult.value = index(start, end).length;
  });

  bench('linear scan of 50k occurrences', () => {
    const result = occurrences.filter(
      (occurrence) => occurrence.end > start && occurrence.start < end,
    );
    benchmarkResult.value = result.length;
  });

  bench('indexed lookup of 50k occurrences', () => {
    const result = occurrenceIndex(start, end);
    benchmarkResult.value = result.length;
  });
});
