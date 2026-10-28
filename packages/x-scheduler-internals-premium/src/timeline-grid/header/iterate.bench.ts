import { describe, test } from 'vitest';
import { adapter } from 'test/utils/scheduler';
import { PlainDate } from '@mui/x-scheduler-internals/internals';
import { iterate } from './iterate';
import type { IteratedRange } from './iterate';

export const benchmarkResult = { value: undefined as unknown };

// The walk reads no timezone: the ranges are dates.
describe('iterate', () => {
  // The header rows of the presets, with the ranges they display.
  const visiblePlainDate = PlainDate.from('2026-03-04');
  const monthStartPlainDate = visiblePlainDate.with({ day: 1 });
  const toRange = (startPlainDate: PlainDate, endPlainDate: PlainDate): IteratedRange => ({
    startPlainDate,
    endPlainDate,
    dayStartMinute: 0,
    dayEndMinute: 1440,
  });
  const presets = {
    dayAndHour: () => {
      const range = toRange(visiblePlainDate, visiblePlainDate.add({ days: 4 }));
      return [iterate(adapter, 'day', 'hour', range), iterate(adapter, 'hour', 'hour', range)];
    },
    dayAndMonth: () => {
      const range = toRange(visiblePlainDate, visiblePlainDate.add({ days: 8 * 7 }));
      return [iterate(adapter, 'month', 'day', range), iterate(adapter, 'day', 'day', range)];
    },
    monthAndYear: () => {
      const range = toRange(monthStartPlainDate, monthStartPlainDate.add({ months: 3 * 12 }));
      return [iterate(adapter, 'year', 'day', range), iterate(adapter, 'month', 'day', range)];
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
