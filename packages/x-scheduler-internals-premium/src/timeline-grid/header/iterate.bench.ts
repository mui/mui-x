import { describe, test } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { iterate } from './iterate';

export const benchmarkResult = { value: undefined as unknown };

describe.each(['default', 'America/New_York'] as const)('%s display timezone', (timezone) => {
  const visibleDate = adapter.setTimezone(
    adapter.date('2026-03-04T12:00:00Z', 'default'),
    timezone,
  );

  // The header rows of the presets, with the ranges they display.
  const dayStart = adapter.startOfDay(visibleDate);
  const monthStart = adapter.startOfMonth(visibleDate);
  const presets = {
    dayAndHour: () => {
      const end = adapter.endOfDay(adapter.addDays(dayStart, 3));
      return [
        iterate(adapter, 'day', 'hour', dayStart, end),
        iterate(adapter, 'hour', 'hour', dayStart, end),
      ];
    },
    dayAndMonth: () => {
      const end = adapter.endOfDay(adapter.addDays(dayStart, 8 * 7 - 1));
      return [
        iterate(adapter, 'month', 'day', dayStart, end),
        iterate(adapter, 'day', 'day', dayStart, end),
      ];
    },
    monthAndYear: () => {
      const end = adapter.endOfMonth(adapter.addMonths(monthStart, 3 * 12 - 1));
      return [
        iterate(adapter, 'year', 'day', monthStart, end),
        iterate(adapter, 'month', 'day', monthStart, end),
      ];
    },
  };

  test('header cells', { timeout: 0 }, async ({ bench }) => {
    await bench.compare(
      ...Object.entries(presets).map(([name, run]) =>
        bench(name, () => {
          benchmarkResult.value = run();
        }),
      ),
    );
  });
});
