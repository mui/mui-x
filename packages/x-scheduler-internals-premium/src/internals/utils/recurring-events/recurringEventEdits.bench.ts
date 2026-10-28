import { describe, test } from 'vitest';
import type { SchedulerEventRecurrenceRule } from '@mui/x-scheduler-internals/models';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { updateRecurringEvent } from './updateRecurringEvent';
import { deleteRecurringEvent } from './deleteRecurringEvent';

const TIMEZONE = 'America/New_York';

/**
 * Long series started in January 2024, edited at an occurrence in June 2026.
 */
const SERIES: { rule: SchedulerEventRecurrenceRule; start: string; occurrence: string }[] = [
  {
    rule: { freq: 'DAILY', count: 2000 },
    start: '2024-01-01T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'], count: 600 },
    start: '2024-01-01T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'MONTHLY', byMonthDay: [15], until: '2034-12-31T00:00:00' },
    start: '2024-01-15T09:00:00',
    occurrence: '2026-06-15T09:00:00',
  },
  {
    rule: { freq: 'YEARLY', count: 20 },
    start: '2024-02-29T09:00:00',
    occurrence: '2028-02-29T09:00:00',
  },
];

const cases = SERIES.map(({ rule, start, occurrence }) => ({
  event: EventBuilder.new(adapter)
    .withDataTimezone(TIMEZONE)
    .singleDay(start)
    .rrule(rule)
    .toProcessed(),
  occurrenceStart: adapter.date(occurrence, TIMEZONE),
}));

// The edits run fast, so repeat them to measure more than the timer resolution.
const REPEAT = 20;

describe('recurring event edits', () => {
  test('daily, weekly, monthly and yearly series', { timeout: 0 }, async ({ bench }) => {
    await bench.compare(
      bench('update this and following', () => {
        for (let i = 0; i < REPEAT; i += 1) {
          for (const { event, occurrenceStart } of cases) {
            updateRecurringEvent(
              adapter,
              event,
              occurrenceStart,
              { id: event.id, title: 'Renamed' },
              'this-and-following',
            );
          }
        }
      }),
      bench('delete only this', () => {
        for (let i = 0; i < REPEAT; i += 1) {
          for (const { event, occurrenceStart } of cases) {
            deleteRecurringEvent(adapter, event, occurrenceStart, 'only-this');
          }
        }
      }),
      bench('delete this and following', () => {
        for (let i = 0; i < REPEAT; i += 1) {
          for (const { event, occurrenceStart } of cases) {
            deleteRecurringEvent(adapter, event, occurrenceStart, 'this-and-following');
          }
        }
      }),
      { time: 0, iterations: 10, warmupTime: 0, warmupIterations: 1 },
    );
  });
});
