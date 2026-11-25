import { eventCalendarOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayListFromPlainDates } from '@mui/x-scheduler-internals/get-day-list';
import { toEpochMs, toPlainDate } from '@mui/x-scheduler-internals/internals';
import { createDate, startOfMonth, startOfWeek } from 'test/utils/scheduler/dates';
import { getEventCalendarStateFromParameters } from 'test/utils/scheduler/state';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

for (const timezone of ['default', 'America/New_York'] as const) {
  const getData = lazy(() => {
    // The 6 weeks of a month view.
    const visibleDate = createDate('2026-03-15T12:00:00Z');
    const firstPlainDate = toPlainDate(
      startOfWeek(startOfMonth(visibleDate, timezone), timezone).getTime(),
      'default',
    );
    const days = getDayListFromPlainDates({
      firstPlainDate,
      lastPlainDate: firstPlainDate.add({ days: 41 }),
      timezone,
    });
    // The first instant of each day, as the rows read their start.
    const dayStarts = days.map((day) => toEpochMs(day, timezone));
    // A 3-day event dragged over the grid.
    const state = {
      ...getEventCalendarStateFromParameters({ events: [], displayTimezone: timezone }),
      occurrencePlaceholder: {
        type: 'internal-drag',
        surfaceType: 'day-grid',
        isHidden: false,
        start: dayStarts[16] + 10 * 3_600_000,
        end: dayStarts[18] + 9 * 3_600_000,
        eventId: 'event',
        occurrenceKey: 'event',
        originalOccurrence: null,
      },
    } as any;
    return { days, dayStarts, state };
  });

  timeBenchmark(
    `Drag preview of a month view - placeholder lookups of 42 day cells (${timezone} display timezone)`,
    () => {
      const { days, dayStarts, state } = getData();
      let count = 0;
      for (let index = 0; index < days.length; index += 1) {
        const rowStart = dayStarts[index - (index % 7)];
        if (
          eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell(
            state,
            days[index],
            rowStart,
          )
        ) {
          count += 1;
        }
        if (eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell(state, days[index])) {
          count += 1;
        }
      }
      return count;
    },
  );
}
