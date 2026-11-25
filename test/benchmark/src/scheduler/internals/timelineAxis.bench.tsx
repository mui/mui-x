import {
  computeElementPositionInCollection,
  getTimelineAxisDurationMs,
  getTimezoneId,
  timelineAxisOffsetToTimestamp,
  toZonedDateTime,
} from '@mui/x-scheduler-internals/internals';
import { addDays, addMinutes, createDate, endOfDay, startOfDay } from 'test/utils/scheduler/dates';
import { createTimelineAxis } from 'test/utils/scheduler/timeline-axis';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const occurrenceCount = 1_000;

for (const parameter of ['default', 'America/New_York'] as const) {
  const getData = lazy(() => {
    // The display timezone as the store holds it: by its identifier.
    const timezone = getTimezoneId(parameter);
    // A week of 24 hours per day, like the time grid of the week view.
    const start = startOfDay(createDate('2026-03-02T12:00:00Z'), timezone);
    const axis = createTimelineAxis({
      start,
      end: endOfDay(addDays(start, 6, timezone), timezone),
      dayStartMinute: 0,
      dayEndMinute: 1440,
      timezone,
    });
    // Occurrences of 30 minutes to 5 hours, every 10 minutes across the week.
    const occurrences = Array.from({ length: occurrenceCount }, (_, index) => {
      const occurrenceStart = addMinutes(start, index * 10);
      return {
        start: toZonedDateTime(occurrenceStart.getTime(), timezone),
        end: toZonedDateTime(
          addMinutes(occurrenceStart, 30 + (index % 10) * 30).getTime(),
          timezone,
        ),
      };
    });
    return { axis, durationMs: getTimelineAxisDurationMs(axis), occurrences };
  });

  timeBenchmark(
    `Timeline axis - position 1,000 occurrences on a week axis (${parameter} display timezone)`,
    () => {
      const { axis, durationMs, occurrences } = getData();
      let total = 0;
      for (const occurrence of occurrences) {
        total += computeElementPositionInCollection({
          ...occurrence,
          collection: axis,
          durationMs,
        }).duration;
      }
      return total;
    },
  );

  timeBenchmark(
    `Timeline axis - map 1,000 pointer positions to dates on a week axis (${parameter} display timezone)`,
    () => {
      const { axis, durationMs } = getData();
      let total = 0;
      for (let index = 0; index < occurrenceCount; index += 1) {
        total += timelineAxisOffsetToTimestamp(axis, (durationMs * index) / occurrenceCount);
      }
      return total;
    },
  );
}
