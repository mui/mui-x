import { describe, test } from 'vitest';
import { adapter, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { getDayList } from '../get-day-list';
import { eventCalendarOccurrencePlaceholderSelectors } from './eventCalendarOccurrencePlaceholderSelectors';

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  // The 6 weeks of a month view.
  const visibleDate = adapter.setTimezone(
    adapter.date('2026-03-15T12:00:00Z', 'default'),
    timezone,
  );
  const gridStart = adapter.startOfWeek(adapter.startOfMonth(visibleDate));
  const days = getDayList({ adapter, start: gridStart, end: adapter.addDays(gridStart, 41) });
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
        const rowStart = days[index - (index % 7)].value;
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
