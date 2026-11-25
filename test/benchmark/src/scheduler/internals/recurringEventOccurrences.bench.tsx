import { getDayListFromPlainDates } from '@mui/x-scheduler-internals/get-day-list';
import {
  BaseTemporal,
  createEventRangeIndex,
  getTimezoneId,
} from '@mui/x-scheduler-internals/internals';
import type {
  RecurringEventWeekDayCode,
  SchedulerEventRecurrenceRule,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import { innerGetEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import {
  getRecurringEventOccurrencesForVisibleDays,
  schedulerRecurringEventsPlugin,
} from '@mui/x-scheduler-internals-premium/internals';
import { EventBuilder } from 'test/utils/scheduler/event-builder';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

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
  // The rule of the all-day series (every tenth one), so its until is a date.
  { freq: 'DAILY', until: '2026-09-30' },
];

/**
 * A team calendar: 200 recurring series that started in January 2024, cycling through
 * every frequency, with COUNT/UNTIL rules, exception dates and all-day series.
 */
function createRecurringEvents(
  dataTimezone: string,
  displayTimezone: string,
): SchedulerProcessedEvent[] {
  return Array.from({ length: 200 }, (_, index) => {
    const day = String((index % 28) + 1).padStart(2, '0');
    const hour = String(7 + (index % 11)).padStart(2, '0');
    const builder = EventBuilder.new()
      .id(index)
      .withDataTimezone(dataTimezone)
      .withDisplayTimezone(displayTimezone);

    const allDay = index % 10 === 9;
    if (allDay) {
      const nextDay = String((index % 28) + 2).padStart(2, '0');
      builder.span(`2024-01-${day}`, `2024-01-${nextDay}`, { allDay: true });
    } else {
      builder.singleDay(`2024-01-${day}T${hour}:30:00`, 45 + (index % 4) * 30);
    }

    if (index % 7 === 0) {
      // The exceptions of an all-day series are dates.
      builder.exDates([allDay ? `2026-10-${day}` : `2026-10-${day}T${hour}:30:00`]);
    }

    return builder.rrule(RULES[index % RULES.length]).toProcessed();
  });
}

// The timezone of the system, as the store holds it: by its identifier.
const SYSTEM_TIMEZONE = getTimezoneId('default');

const RANGES = {
  week: ['2026-10-19T00:00:00Z', '2026-10-25T23:59:59Z'],
  month: ['2026-09-28T00:00:00Z', '2026-11-08T23:59:59Z'],
  year: ['2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z'],
} as const;

function expandAll(
  events: SchedulerProcessedEvent[],
  [start, end]: readonly [string, string],
  displayTimezone: string,
) {
  const rangeStart = Date.parse(start);
  const rangeEnd = Date.parse(end);
  let count = 0;
  for (const event of events) {
    count += getRecurringEventOccurrencesForVisibleDays(
      event,
      rangeStart,
      rangeEnd,
      displayTimezone,
    ).length;
  }
  return count;
}

const VIEWS = {
  week: ['2026-10-19', '2026-10-25'],
  month: ['2026-09-28', '2026-11-08'],
} as const;

// The occurrences of the series grouped by the days of a view, like the week and month views do.
function groupByDay(
  events: SchedulerProcessedEvent[],
  [first, last]: readonly [string, string],
  displayTimezone: string,
  hideWeekends: boolean,
) {
  const days = getDayListFromPlainDates({
    firstPlainDate: BaseTemporal.PlainDate.from(first),
    lastPlainDate: BaseTemporal.PlainDate.from(last),
    timezone: displayTimezone,
    excludedWeekdays: hideWeekends ? [6, 7] : undefined,
  });
  return innerGetEventOccurrencesGroupedByDay({
    days,
    eventRangeIndex: createEventRangeIndex(events, true),
    visibleResources: {},
    displayTimezone,
    recurringEventsPlugin: schedulerRecurringEventsPlugin,
  }).size;
}

for (const [dataTimezone, displayTimezone] of [
  ['default', 'default'],
  ['America/New_York', 'Europe/Paris'],
] as const) {
  const getEvents = lazy(() => createRecurringEvents(dataTimezone, displayTimezone));
  // The store holds the display timezone by its identifier.
  const displayTimezoneId = getTimezoneId(displayTimezone);
  const label =
    dataTimezone === 'default'
      ? '200 series in the system timezone'
      : `200 series in ${dataTimezone} displayed in ${displayTimezone}`;

  timeBenchmark(`Recurring event expansion - ${label}, week view`, () =>
    expandAll(getEvents(), RANGES.week, displayTimezoneId),
  );
  timeBenchmark(`Recurring event expansion - ${label}, month view`, () =>
    expandAll(getEvents(), RANGES.month, displayTimezoneId),
  );
  timeBenchmark(`Recurring event expansion - ${label}, year timeline`, () =>
    expandAll(getEvents(), RANGES.year, displayTimezoneId),
  );

  timeBenchmark(`Recurring events grouped by day - ${label}, week view`, () =>
    groupByDay(getEvents(), VIEWS.week, displayTimezoneId, false),
  );
  timeBenchmark(`Recurring events grouped by day - ${label}, week view without weekends`, () =>
    groupByDay(getEvents(), VIEWS.week, displayTimezoneId, true),
  );
  timeBenchmark(`Recurring events grouped by day - ${label}, month view`, () =>
    groupByDay(getEvents(), VIEWS.month, displayTimezoneId, false),
  );
  timeBenchmark(`Recurring events grouped by day - ${label}, month view without weekends`, () =>
    groupByDay(getEvents(), VIEWS.month, displayTimezoneId, true),
  );
}

// COUNT includes the occurrences from DTSTART to the visible range: the daily and weekly series
// count them, the monthly one steps through them.
const getLongRunningSeries = lazy(() =>
  (['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((freq) =>
    EventBuilder.new()
      .withDataTimezone('America/New_York')
      .singleDay('2016-01-04T09:00:00')
      .rrule({ freq, byDay: freq === 'WEEKLY' ? ['MO', 'TH'] : undefined, count: 5000 })
      .toProcessed(),
  ),
);

timeBenchmark(
  'Recurring event expansion - long-running series with COUNT, week view 10 years after DTSTART',
  () => expandAll(getLongRunningSeries(), RANGES.week, SYSTEM_TIMEZONE),
);
timeBenchmark(
  'Recurring event expansion - long-running series with COUNT, month view 10 years after DTSTART',
  () => expandAll(getLongRunningSeries(), RANGES.month, SYSTEM_TIMEZONE),
);

// Each series has about 8,800 days before the visible range, and the first two fall on different
// days of the week. A plain date for each of these days would need more than the Scheduler
// caches, and would empty the cache on every expansion.
const BY_DAYS: RecurringEventWeekDayCode[][] = [
  ['MO', 'WE', 'FR'],
  ['TU', 'TH', 'SA'],
  ['MO', 'TU', 'TH'],
  ['WE', 'FR', 'SU'],
];

for (const seriesCount of [1, 2, 4]) {
  const getSeries = lazy(() =>
    Array.from({ length: seriesCount }, (_, index) =>
      EventBuilder.new()
        .id(index)
        .singleDay('1970-01-05T09:00:00')
        .rrule({ freq: 'WEEKLY', byDay: BY_DAYS[index], count: 20_000 })
        .toProcessed(),
    ),
  );

  timeBenchmark(
    `Recurring event expansion - ${seriesCount} weekly series with COUNT since 1970, month view`,
    () => expandAll(getSeries(), RANGES.month, SYSTEM_TIMEZONE),
  );
}
