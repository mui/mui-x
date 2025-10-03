import { SchedulerValidDate } from '../../models/date';
import { CalendarEvent } from '../../models/event';

export function buildEvent(
  id: string,
  title: string,
  start: SchedulerValidDate,
  end: SchedulerValidDate,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent {
  return {
    id,
    title,
    start,
    end,
    ...extra,
  };
}

export function getIds<T extends { id: string | number }>(items: T[]): Array<T['id']> {
  return items.map((item) => item.id);
}
