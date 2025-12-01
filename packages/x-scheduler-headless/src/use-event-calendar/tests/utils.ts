import { TemporalSupportedObject, SchedulerEvent } from '../../models';

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

export function getIds<T extends { id: string | number }>(items: T[]): Array<T['id']> {
  return items.map((item) => item.id);
}
