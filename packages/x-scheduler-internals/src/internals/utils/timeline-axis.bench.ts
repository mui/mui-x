import { describe, test } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { processDate } from '../../process-date';
import { computeElementPositionInCollection } from './useElementPositionInCollection';
import {
  getTimelineAxis,
  getTimelineAxisDurationMs,
  timelineAxisOffsetToTimestamp,
} from './timeline-axis';

const occurrenceCount = 1_000;

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  // A week of 24 hours per day, like the time grid of the week view.
  const start = adapter.startOfDay(
    adapter.setTimezone(adapter.date('2026-03-02T12:00:00Z', 'default'), timezone),
  );
  const axis = getTimelineAxis(adapter, {
    start,
    end: adapter.endOfDay(adapter.addDays(start, 6)),
    dayStartMinute: 0,
    dayEndMinute: 1440,
  });
  const durationMs = getTimelineAxisDurationMs(axis);
  // Occurrences of 30 minutes to 5 hours, every 10 minutes across the week.
  const occurrences = Array.from({ length: occurrenceCount }, (_, index) => {
    const occurrenceStart = adapter.addMinutes(start, index * 10);
    return {
      start: processDate(occurrenceStart, adapter),
      end: processDate(adapter.addMinutes(occurrenceStart, 30 + (index % 10) * 30), adapter),
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
