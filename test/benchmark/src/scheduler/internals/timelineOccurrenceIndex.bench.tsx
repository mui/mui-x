import { createEventTimelinePremiumOccurrenceIndex } from '@mui/x-scheduler-premium/internals';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const occurrenceCount = 50_000;
const start = 0.5;
const end = 0.51;

const getOccurrences = lazy(() =>
  Array.from({ length: occurrenceCount }, (_, index) => ({
    id: index,
    start: index / occurrenceCount,
    end: (index + 1) / occurrenceCount,
  })),
);
const getOccurrenceIndex = lazy(() => createEventTimelinePremiumOccurrenceIndex(getOccurrences()));

timeBenchmark('Event Timeline horizontal window lookup - build an index of 50k occurrences', () => {
  const index = createEventTimelinePremiumOccurrenceIndex(getOccurrences());
  return index(start, end).length;
});

timeBenchmark(
  'Event Timeline horizontal window lookup - linear scan of 50k occurrences',
  () =>
    getOccurrences().filter((occurrence) => occurrence.end > start && occurrence.start < end)
      .length,
);

timeBenchmark(
  'Event Timeline horizontal window lookup - indexed lookup of 50k occurrences',
  () => getOccurrenceIndex()(start, end).length,
);
