import { describe, test } from 'vitest';
import {
  addMinutes,
  createDate,
  EventBuilder,
  getEventCalendarStateFromParameters,
} from 'test/utils/scheduler';
import type { TemporalTimezone } from '../models';
import { getDayListFromPlainDates } from '../get-day-list';
import { isWeekendPlainDate } from '../internals/utils/plain-date-utils/plainDate';
import { getPlainDateWeekStart } from '../internals/utils/date-utils';
import { createStartOfPlainDate } from '../internals/utils/plain-date-utils/date';
import { toPlainDate } from '../internals/utils/plain-date-utils/timeZone';
import { createEventRangeIndex } from '../internals/utils/event-range-index';
import { eventCalendarAgendaSelectors } from '../event-calendar-selectors';
import { innerGetEventOccurrencesGroupedByDay } from './useEventOccurrencesGroupedByDay';

const eventCount = 1_000;

function createMonthViewScenario(displayTimezone: TemporalTimezone) {
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
    weekendCount += isWeekendPlainDate(day.plainDate, weekend) ? 1 : 0;
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

function createAgendaState(displayTimezone: TemporalTimezone) {
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

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  test('month view', { timeout: 0 }, async ({ bench }) => {
    const scenario = createMonthViewScenario(timezone);
    await bench('days, weekends and 1,000 events grouped by day', () => {
      benchmarkResult.value = runMonthView(scenario);
    }).run();
  });

  test('agenda view', { timeout: 0 }, async ({ bench }) => {
    let state = createAgendaState(timezone);
    await bench(
      '12 days with events, empty days hidden',
      {
        // A new state for each run, as the selector is memoized.
        beforeEach: () => {
          state = createAgendaState(timezone);
        },
      },
      () => {
        benchmarkResult.value = eventCalendarAgendaSelectors.visibleDays(state);
      },
    ).run();
  });
});
