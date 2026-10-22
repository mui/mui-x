import { describe, test } from 'vitest';
import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEventRecurrenceRule,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { getRecurringEventOccurrencesForVisibleDays } from './getRecurringEventOccurrencesForVisibleDays';

const RULES: SchedulerEventRecurrenceRule[] = [
  { freq: 'DAILY' },
  { freq: 'DAILY', interval: 2 },
  { freq: 'WEEKLY', byDay: ['MO', 'WE', 'FR'] },
  { freq: 'WEEKLY', byDay: ['TU', 'TH'], interval: 2 },
  { freq: 'WEEKLY', byDay: ['SU', 'TU'], count: 400 },
  { freq: 'MONTHLY', byMonthDay: [15] },
  { freq: 'MONTHLY', byDay: ['2TU'] },
  { freq: 'MONTHLY', byDay: ['-1FR'], count: 60 },
  { freq: 'YEARLY' },
  { freq: 'DAILY', until: '2026-09-30T23:59:59Z' },
];

/**
 * A team calendar: 200 recurring series that started in January 2024, cycling through
 * every frequency, with COUNT/UNTIL rules, exception dates and all-day series.
 */
function createRecurringEvents(
  dataTimezone: TemporalTimezone,
  displayTimezone: TemporalTimezone,
): SchedulerProcessedEvent[] {
  return Array.from({ length: 200 }, (_, index) => {
    const day = String((index % 28) + 1).padStart(2, '0');
    const hour = String(7 + (index % 11)).padStart(2, '0');
    const builder = EventBuilder.new(adapter)
      .id(index)
      .withDataTimezone(dataTimezone)
      .withDisplayTimezone(displayTimezone);

    if (index % 10 === 9) {
      builder.span(`2024-01-${day}T00:00:00`, `2024-01-${day}T23:59:59`, { allDay: true });
    } else {
      builder.singleDay(`2024-01-${day}T${hour}:30:00`, 45 + (index % 4) * 30);
    }

    if (index % 7 === 0) {
      builder.exDates([`2026-10-${day}T${hour}:30:00`]);
    }

    return builder.rrule(RULES[index % RULES.length]).toProcessed();
  });
}

// Expanding the year range takes seconds per run before the plain-date migration, so cap the samples.
const BENCH_OPTIONS = { time: 0, iterations: 10, warmupTime: 0, warmupIterations: 1 };

const RANGES = {
  week: ['2026-10-19T00:00:00Z', '2026-10-25T23:59:59Z'],
  month: ['2026-09-28T00:00:00Z', '2026-11-08T23:59:59Z'],
  year: ['2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z'],
} as const;

function expandAll(
  events: SchedulerProcessedEvent[],
  [start, end]: readonly [string, string],
  displayTimezone: TemporalTimezone,
) {
  const rangeStart = adapter.date(start, 'default');
  const rangeEnd = adapter.date(end, 'default');
  let count = 0;
  for (const event of events) {
    count += getRecurringEventOccurrencesForVisibleDays(
      event,
      rangeStart,
      rangeEnd,
      adapter,
      displayTimezone,
    ).length;
  }
  return count;
}

describe('recurring event expansion', () => {
  test('200 series in the system timezone', { timeout: 0 }, async ({ bench }) => {
    const events = createRecurringEvents('default', 'default');

    await bench.compare(
      bench('week view', () => {
        expandAll(events, RANGES.week, 'default');
      }),
      bench('month view', () => {
        expandAll(events, RANGES.month, 'default');
      }),
      bench('year timeline', () => {
        expandAll(events, RANGES.year, 'default');
      }),
      BENCH_OPTIONS,
    );
  });

  test(
    '200 series in America/New_York displayed in Europe/Paris',
    { timeout: 0 },
    async ({ bench }) => {
      const events = createRecurringEvents('America/New_York', 'Europe/Paris');

      await bench.compare(
        bench('week view', () => {
          expandAll(events, RANGES.week, 'Europe/Paris');
        }),
        bench('month view', () => {
          expandAll(events, RANGES.month, 'Europe/Paris');
        }),
        bench('year timeline', () => {
          expandAll(events, RANGES.year, 'Europe/Paris');
        }),
        BENCH_OPTIONS,
      );
    },
  );

  test('long-running series with COUNT', { timeout: 0 }, async ({ bench }) => {
    // COUNT is enforced by replaying the series from DTSTART up to the visible range.
    const events = (['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((freq) =>
      EventBuilder.new(adapter)
        .withDataTimezone('America/New_York')
        .singleDay('2016-01-04T09:00:00')
        .rrule({ freq, byDay: freq === 'WEEKLY' ? ['MO', 'TH'] : undefined, count: 5000 })
        .toProcessed(),
    );

    await bench.compare(
      bench('week view, 10 years after DTSTART', () => {
        expandAll(events, RANGES.week, 'default');
      }),
      bench('month view, 10 years after DTSTART', () => {
        expandAll(events, RANGES.month, 'default');
      }),
      BENCH_OPTIONS,
    );
  });
});
