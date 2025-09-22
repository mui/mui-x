import { CalendarEvent } from '../models';
import { CalendarEventModelStructure } from './useEventCalendar.types';

const EVENT_PROPERTIES_LOOKUP: { [P in keyof CalendarEvent]-?: true } = {
  id: true,
  title: true,
  description: true,
  start: true,
  end: true,
  resource: true,
  rrule: true,
  allDay: true,
  readOnly: true,
  extractedFromId: true,
};

const EVENT_PROPERTIES = Object.keys(EVENT_PROPERTIES_LOOKUP) as (keyof CalendarEvent)[];

export function getCalendarEventFromModel<EventModel extends {}>(
  event: EventModel,
  eventModelStructure: CalendarEventModelStructure<EventModel>,
): CalendarEvent {
  const processedEvent = {} as CalendarEvent;

  for (const key of EVENT_PROPERTIES) {
    const getter = eventModelStructure[key]?.getter;
    if (getter) {
      processedEvent[key as any] = getter(event);
    } else {
      processedEvent[key as any] = (event as any)[key];
    }
  }

  return processedEvent;
}

export function getUpdatedModelFromPartialCalendarEvent<EventModel extends {}>(
  event: EventModel,
  changes: Partial<CalendarEvent>,
  eventModelStructure: CalendarEventModelStructure<EventModel>,
): EventModel {
  const updatedEvent = { ...event };
  for (const key in changes) {
    if (changes.hasOwnProperty(key)) {
      const typedKey = key as keyof CalendarEvent;
      if (eventModelStructure[typedKey]) {
        const setter = eventModelStructure[typedKey]?.setter as AnySetter<EventModel>;
        if (setter) {
          updatedEvent[typedKey] = setter(event, changes[typedKey]) as EventModel;
        } else {
          (updatedEvent as any)[key] = changes[typedKey];
        }
      }
    }
  }

  return updatedEvent;
}

type AnySetter<EventModel extends {}> = ((event: EventModel, value: any) => EventModel) | undefined;
