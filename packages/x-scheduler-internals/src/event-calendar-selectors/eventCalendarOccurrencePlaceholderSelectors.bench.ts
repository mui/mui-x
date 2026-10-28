import { describe, test } from 'vitest';
import { adapter, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { getDayListFromPlainDates } from '../get-day-list';
import { buildTemporalPlainDate } from '../internals/utils/plain-date-utils/adapter';
import { eventCalendarOccurrencePlaceholderSelectors } from './eventCalendarOccurrencePlaceholderSelectors';

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  // The 6 weeks of a month view.
  const visibleDate = adapter.setTimezone(
    adapter.date('2026-03-15T12:00:00Z', 'default'),
    timezone,
  );
  const firstPlainDate = buildTemporalPlainDate(
    adapter,
    adapter.startOfWeek(adapter.startOfMonth(visibleDate)),
    'default',
  );
  const days = getDayListFromPlainDates({
    firstPlainDate,
    lastPlainDate: firstPlainDate.add({ days: 41 }),
    timezone,
  });
  // A 3-day event dragged over the grid.
  const state = {
    ...getEventCalendarStateFromParameters({ events: [], displayTimezone: timezone }),
    occurrencePlaceholder: {
      type: 'internal-drag',
      surfaceType: 'day-grid',
      isHidden: false,
      start: adapter.getTime(adapter.addHours(days[16].value, 10)),
      end: adapter.getTime(adapter.addHours(days[18].value, 9)),
      eventId: 'event',
      occurrenceKey: 'event',
      originalOccurrence: null,
    },
  } as any;

  test('drag preview of a month view', { timeout: 0 }, async ({ bench }) => {
    await bench('placeholder lookups of 42 day cells', () => {
      let count = 0;
      for (let index = 0; index < days.length; index += 1) {
        const rowStart = days[index - (index % 7)].timestamp;
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
      benchmarkResult.value = count;
    }).run();
  });
});
