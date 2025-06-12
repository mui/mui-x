import { SchedulerValidDate } from '../../primitives/models';
import { Adapter } from '../../primitives/utils/adapter/types';

export function isWeekend(adapter: Adapter, value: SchedulerValidDate): boolean {
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}
