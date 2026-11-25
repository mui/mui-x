import { BaseTemporal } from '@mui/x-scheduler-internals/internals';
import { iterate } from '@mui/x-scheduler-internals-premium/timeline-grid';
import type { IteratedRange } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { timeBenchmark } from '../../utils/timeBenchmark';

// The walk reads no timezone: the ranges are dates.
// The header rows of the presets, with the ranges they display.
const visiblePlainDate = BaseTemporal.PlainDate.from('2026-03-04');
const monthStartPlainDate = visiblePlainDate.with({ day: 1 });
const toRange = (
  startPlainDate: BaseTemporal.PlainDate,
  endPlainDate: BaseTemporal.PlainDate,
): IteratedRange => ({
  startPlainDate,
  endPlainDate,
  dayStartMinute: 0,
  dayEndMinute: 1440,
});

timeBenchmark('Event Timeline header cells - dayAndHour', () => {
  const range = toRange(visiblePlainDate, visiblePlainDate.add({ days: 4 }));
  return [iterate('day', 'hour', range, 1), iterate('hour', 'hour', range, 1)];
});

timeBenchmark('Event Timeline header cells - dayAndMonth', () => {
  const range = toRange(visiblePlainDate, visiblePlainDate.add({ days: 8 * 7 }));
  return [iterate('month', 'day', range, 1), iterate('day', 'day', range, 1)];
});

timeBenchmark('Event Timeline header cells - monthAndYear', () => {
  const range = toRange(monthStartPlainDate, monthStartPlainDate.add({ months: 3 * 12 }));
  return [iterate('year', 'day', range, 1), iterate('month', 'day', range, 1)];
});
