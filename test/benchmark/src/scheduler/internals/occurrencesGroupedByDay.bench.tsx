import { eventCalendarAgendaSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayListFromPlainDates } from '@mui/x-scheduler-internals/get-day-list';
import {
  createEventRangeIndex,
  createStartOfPlainDate,
  getPlainDateWeekStart,
  isWeekendPlainDate,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { innerGetEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import { addMinutes, createDate } from 'test/utils/scheduler/dates';
import { EventBuilder } from 'test/utils/scheduler/event-builder';
import { getEventCalendarStateFromParameters } from 'test/utils/scheduler/state';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const eventCount = 1_000;

function createMonthViewScenario(displayTimezone: string) {
  const visibleDate = createDate('2026-03-15T10:00:00Z');
  const gridStart = createStartOfPlainDate(
    getPlainDateWeekStart(toPlainDate(visibleDate.getTime(), 'default').with({ day: 1 }), 1),
    displayTimezone,
  );
  // Events of 30 minutes to 30 hours, every 53 minutes across the 6 weeks of the grid.
  const events = Array.from({ length: eventCount }, (_, index) => {
    const start = addMinutes(gridStart, index * 53);
    const end = addMinutes(start, 30 + (index % 7) * 300);
    return EventBuilder.new()
      .id(index)
      .span(start.toISOString(), end.toISOString())
      .withDisplayTimezone(displayTimezone)
      .toProcessed();
  });
  return {
    visibleDate,
    displayTimezone,
    eventRangeIndex: createEventRangeIndex(events, false),
  };
}

function runMonthView(scenario: ReturnType<typeof createMonthViewScenario>) {
  const { visibleDate, displayTimezone, eventRangeIndex } = scenario;
  const visiblePlainDate = toPlainDate(visibleDate.getTime(), 'default');
  const days = getDayListFromPlainDates({
    firstPlainDate: getPlainDateWeekStart(visiblePlainDate.with({ day: 1 }), 1),
    lastPlainDate: getPlainDateWeekStart(
      visiblePlainDate.with({ day: visiblePlainDate.daysInMonth }),
      1,
    ).add({ days: 6 }),
    timezone: displayTimezone,
  });
  const weekend = [6, 7];
  let weekendCount = 0;
  for (const day of days) {
    weekendCount += isWeekendPlainDate(day, weekend) ? 1 : 0;
  }
  const occurrencesByDay = innerGetEventOccurrencesGroupedByDay({
    days,
    eventRangeIndex,
    visibleResources: {},
    displayTimezone,
    recurringEventsPlugin: null,
  });
  return weekendCount + occurrencesByDay.size;
}

function createAgendaState(displayTimezone: string) {
  // One event every 9 days: filling 12 days with events scans about 108 days.
  const firstDay = Date.UTC(2026, 2, 2, 10);
  const events = Array.from({ length: 30 }, (_, index) =>
    EventBuilder.new()
      .id(index)
      .span(
        new Date(firstDay + index * 9 * 86_400_000).toISOString(),
        new Date(firstDay + index * 9 * 86_400_000 + 3_600_000).toISOString(),
      )
      .build(),
  );
  return getEventCalendarStateFromParameters({
    events,
    displayTimezone,
    visibleDate: createDate('2026-03-02T12:00:00Z'),
    defaultPreferences: { showEmptyDaysInAgenda: false },
  });
}

for (const timezone of ['default', 'America/New_York'] as const) {
  const getMonthViewScenario = lazy(() => createMonthViewScenario(timezone));

  timeBenchmark(
    `Month view - days, weekends and 1,000 events grouped by day (${timezone} display timezone)`,
    () => runMonthView(getMonthViewScenario()),
  );

  timeBenchmark(
    `Agenda view - 12 days with events, empty days hidden (${timezone} display timezone)`,
    (state) => eventCalendarAgendaSelectors.visibleDays(state),
    // A new state for each call, as the selector is memoized.
    { prepare: () => createAgendaState(timezone) },
  );
}
