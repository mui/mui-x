import { Adapter, SchedulerValidDate } from '@mui/x-scheduler/primitives/utils/adapter/types';

export function isWeekend(adapter: Adapter, value: SchedulerValidDate): boolean {
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}
