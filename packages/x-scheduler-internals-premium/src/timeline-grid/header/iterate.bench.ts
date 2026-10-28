import { describe, test } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { getTimelineAxis } from '@mui/x-scheduler-internals/internals';
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
  const toAxis = (start: typeof dayStart, end: typeof dayStart) =>
    getTimelineAxis(adapter, { start, end, dayStartMinute: 0, dayEndMinute: 1440 });
  const presets = {
    dayAndHour: () => {
      const axis = toAxis(dayStart, adapter.endOfDay(adapter.addDays(dayStart, 3)));
      return [iterate(adapter, 'day', 'hour', axis), iterate(adapter, 'hour', 'hour', axis)];
    },
    dayAndMonth: () => {
      const axis = toAxis(dayStart, adapter.endOfDay(adapter.addDays(dayStart, 8 * 7 - 1)));
      return [iterate(adapter, 'month', 'day', axis), iterate(adapter, 'day', 'day', axis)];
    },
    monthAndYear: () => {
      const axis = toAxis(
        monthStart,
        adapter.endOfMonth(adapter.addMonths(monthStart, 3 * 12 - 1)),
      );
      return [iterate(adapter, 'year', 'day', axis), iterate(adapter, 'month', 'day', axis)];
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
