import { toZonedDateTime } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import { computeOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

function createOccurrences(
  count: number,
  getRange: (index: number) => [start: number, end: number],
) {
  return Array.from({ length: count }, (_, index) => {
    const [start, end] = getRange(index);
    return {
      id: index,
      key: String(index),
      start: toZonedDateTime(start, 'UTC'),
      end: toZonedDateTime(end, 'UTC'),
    } as unknown as SchedulerEventOccurrence;
  });
}

const getDenseOccurrences = lazy(() => createOccurrences(2_000, () => [0, 60]));
const getRollingOccurrences = lazy(() =>
  createOccurrences(10_000, (index) => [index, index + 100]),
);

timeBenchmark('Timeline occurrence positioning - 2,000 fully overlapping occurrences', () =>
  computeOccurrencesWithTimelinePosition(getDenseOccurrences(), Infinity),
);

timeBenchmark(
  'Timeline occurrence positioning - 10,000 rolling occurrences with 100 concurrent events',
  () => computeOccurrencesWithTimelinePosition(getRollingOccurrences(), 1),
);
