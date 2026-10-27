import { describe, test } from 'vitest';
import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import { adapter, EventBuilder, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { getDayListFromPlainDates } from '../get-day-list';
import { isWeekend } from '../use-adapter';
import { getStartOfWeek } from '../internals/utils/date-utils';
import { buildTemporalPlainDate } from '../internals/utils/plain-date-utils/adapter';
import { createEventRangeIndex } from '../internals/utils/event-range-index';
import { eventCalendarAgendaSelectors } from '../event-calendar-selectors';
import { innerGetEventOccurrencesGroupedByDay } from './useEventOccurrencesGroupedByDay';

const eventCount = 1_000;

function createMonthViewScenario(displayTimezone: TemporalTimezone) {
  const visibleDate = adapter.setTimezone(
    adapter.date('2026-03-15T10:00:00Z', 'default'),
    displayTimezone,
  );
  const gridStart = getStartOfWeek(adapter, adapter.startOfMonth(visibleDate), 1);
  // Events of 30 minutes to 30 hours, every 53 minutes across the 6 weeks of the grid.
  const events = Array.from({ length: eventCount }, (_, index) => {
    const start = adapter.addMinutes(gridStart, index * 53);
    const end = adapter.addMinutes(start, 30 + (index % 7) * 300);
    return EventBuilder.new(adapter)
      .id(index)
      .span(adapter.toJsDate(start).toISOString(), adapter.toJsDate(end).toISOString())
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
  const days = getDayListFromPlainDates({
    adapter,
    firstPlainDate: buildTemporalPlainDate(
      adapter,
      getStartOfWeek(adapter, adapter.startOfMonth(visibleDate), 1),
    ),
    lastPlainDate: buildTemporalPlainDate(
      adapter,
      adapter.addDays(getStartOfWeek(adapter, adapter.endOfMonth(visibleDate), 1), 6),
    ),
    timezone: displayTimezone,
  });
  let weekendCount = 0;
  for (const day of days) {
    weekendCount += isWeekend(adapter, day.value) ? 1 : 0;
  }
  const occurrencesByDay = innerGetEventOccurrencesGroupedByDay({
    adapter,
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
    EventBuilder.new(adapter)
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
    visibleDate: adapter.setTimezone(
      adapter.date('2026-03-02T12:00:00Z', 'default'),
      displayTimezone,
    ),
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
