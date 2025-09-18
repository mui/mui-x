import { SchedulerValidDate } from '../../../models/date';
import { CalendarEvent } from '../../../models/event';
import { EventCalendarStore } from '../../../use-event-calendar';
import { TimelineStore } from '../../../use-timeline';

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

export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'TimelineStore', Value: TimelineStore },
];
