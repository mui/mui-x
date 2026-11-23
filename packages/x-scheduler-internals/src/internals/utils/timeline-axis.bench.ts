import { describe, test } from 'vitest';
import {
  addDays,
  addMinutes,
  createDate,
  createTimelineAxis,
  endOfDay,
  startOfDay,
} from 'test/utils/scheduler';
import { createProcessedDate } from '../../process-date';
import { computeElementPositionInCollection } from './useElementPositionInCollection';
import { getTimelineAxisDurationMs, timelineAxisOffsetToTimestamp } from './timeline-axis';

const occurrenceCount = 1_000;

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  // A week of 24 hours per day, like the time grid of the week view.
  const start = startOfDay(createDate('2026-03-02T12:00:00Z'), timezone);
  const axis = createTimelineAxis({
    start,
    end: endOfDay(addDays(start, 6, timezone), timezone),
    dayStartMinute: 0,
    dayEndMinute: 1440,
    timezone,
  });
  const durationMs = getTimelineAxisDurationMs(axis);
  // Occurrences of 30 minutes to 5 hours, every 10 minutes across the week.
  const occurrences = Array.from({ length: occurrenceCount }, (_, index) => {
    const occurrenceStart = addMinutes(start, index * 10);
    return {
      start: createProcessedDate(occurrenceStart.getTime(), 'default'),
      end: createProcessedDate(
        addMinutes(occurrenceStart, 30 + (index % 10) * 30).getTime(),
        'default',
      ),
    };
  });

  test('position 1,000 occurrences', { timeout: 0 }, async ({ bench }) => {
    await bench('positions on a week axis', () => {
      let total = 0;
      for (const occurrence of occurrences) {
        total += computeElementPositionInCollection({
          ...occurrence,
          collection: axis,
          durationMs,
        }).duration;
      }
      benchmarkResult.value = total;
    }).run();
  });

  test('map 1,000 pointer positions to dates', { timeout: 0 }, async ({ bench }) => {
    const timelineAxis = axis;
    await bench('dates on a week axis', () => {
      let total = 0;
      for (let index = 0; index < occurrenceCount; index += 1) {
        total += timelineAxisOffsetToTimestamp(
          timelineAxis,
          (durationMs * index) / occurrenceCount,
        );
      }
      benchmarkResult.value = total;
    }).run();
  });
});
