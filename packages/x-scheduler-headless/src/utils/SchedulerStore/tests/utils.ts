import { TemporalSupportedObject, SchedulerEvent } from '../../../models';
import { EventCalendarStore } from '../../../use-event-calendar';
import { TimelineStore } from '../../../use-timeline';

export function buildEvent(
  id: string,
  title: string,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  extra: Partial<SchedulerEvent> = {},
): SchedulerEvent {
  return {
    id,
    title,
    start,
    end,
    ...extra,
  };
}

export function getIds<T extends { id: string | number }>(
  items: T[] | readonly T[],
): Array<T['id']> {
  return items.map((item) => item.id);
}

export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'TimelineStore', Value: TimelineStore },
];
