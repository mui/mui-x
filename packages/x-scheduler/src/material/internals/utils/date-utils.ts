import { SchedulerValidDate } from '../../../primitives/models';
import { Adapter } from '../../../primitives/utils/adapter/types';

export function isWeekend(adapter: Adapter, value: SchedulerValidDate): boolean {
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}

export function getWeekInfoInMonth(adapter: Adapter<string>, date: SchedulerValidDate) {
  const startOfMonth = adapter.startOfMonth(date);
  const endOfMonth = adapter.endOfMonth(date);

  const startOfFirstWeek = adapter.startOfWeek(startOfMonth);
  const startOfTargetDay = adapter.startOfDay(date);

  const daysDiff = startOfTargetDay.diff(startOfFirstWeek, 'days').days!;
  const weekNumber = Math.floor(daysDiff / 7) + 1;

  const endOfTargetWeek = adapter.endOfWeek(date);
  const isLastWeek = adapter.isSameDay(adapter.endOfWeek(endOfMonth), endOfTargetWeek);

  return {
    weekNumber,
    isLastWeek,
  };
}

// TODO: Temporay function, move this to localization layer
export function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
