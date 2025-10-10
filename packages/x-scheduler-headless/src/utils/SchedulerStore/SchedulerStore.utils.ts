import { CalendarEvent, CalendarEventId, CalendarOccurrencePlaceholder } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';
import {
  SchedulerEventModelStructure,
  SchedulerParameters,
  SchedulerState,
} from './SchedulerStore.types';

/**
 * Determines if the occurrence placeholder has changed in a meaningful way that requires updating the store.
 */
export function shouldUpdateOccurrencePlaceholder(
  adapter: Adapter,
  previous: CalendarOccurrencePlaceholder | null,
  next: CalendarOccurrencePlaceholder | null,
): boolean {
  if (next == null || previous == null) {
    return next !== previous;
  }

  const untypedPrevious = previous as Record<string, any>;
  const untypedNext = next as Record<string, any>;

  for (const key in untypedNext) {
    if (key === 'start' || key === 'end') {
      if (!adapter.isEqual(untypedNext[key], untypedPrevious[key])) {
        return true;
      }
    } else if (!Object.is(untypedNext[key], untypedPrevious[key])) {
      return true;
    }
  }

  return false;
}

export const DEFAULT_EVENT_MODEL_STRUCTURE: SchedulerEventModelStructure<any> = {};

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
  exDates: true,
};

const EVENT_PROPERTIES = Object.keys(EVENT_PROPERTIES_LOOKUP) as (keyof CalendarEvent)[];

export function getCalendarEventFromModel<EventModel extends {}>(
  event: EventModel,
  eventModelStructure: SchedulerEventModelStructure<EventModel> | undefined,
): CalendarEvent {
  const processedEvent = {} as CalendarEvent;

  for (const key of EVENT_PROPERTIES) {
    const getter = eventModelStructure?.[key]?.getter;

    // @ts-ignore
    processedEvent[key] = getter ? getter(event) : event[key];
  }

  return processedEvent;
}

export function getUpdatedEventModelFromPartialCalendarEvent<EventModel extends {}>(
  event: EventModel,
  changes: Partial<CalendarEvent>,
  eventModelStructure: SchedulerEventModelStructure<EventModel> | undefined,
): EventModel {
  let updatedEventModel = { ...event };
  const propertiesWithSetter: [AnySetter<EventModel>, any][] = [];

  for (const key in changes) {
    if (changes.hasOwnProperty(key)) {
      const typedKey = key as keyof CalendarEvent;
      const setter = eventModelStructure?.[typedKey]?.setter;
      if (setter) {
        // @ts-ignore
        propertiesWithSetter.push([setter, changes[key]]);
      } else {
        // @ts-ignore
        updatedEventModel[key] = changes[key];
      }
    }
  }

  for (const [setter, value] of propertiesWithSetter) {
    updatedEventModel = setter(updatedEventModel, value);
  }

  return updatedEventModel;
}

export function createEventModel<EventModel extends {}>(
  event: CalendarEvent,
  eventModelStructure: SchedulerEventModelStructure<EventModel> | undefined,
): EventModel {
  let eventModel: Partial<EventModel> = {};
  const propertiesWithSetter: [AnySetter<EventModel>, any][] = [];

  for (const key in event) {
    if (event.hasOwnProperty(key)) {
      const typedKey = key as keyof CalendarEvent;
      const setter = eventModelStructure?.[typedKey]?.setter;
      if (setter) {
        // @ts-ignore
        propertiesWithSetter.push([setter, event[key]]);
      } else {
        // @ts-ignore
        eventModel[key] = event[key];
      }
    }
  }

  for (const [setter, value] of propertiesWithSetter) {
    eventModel = setter(eventModel, value);
  }

  return eventModel as EventModel;
}

type AnySetter<EventModel extends {}> = (
  event: EventModel | Partial<EventModel>,
  value: any,
) => EventModel;

export function buildEventLookups<EventModel extends {}>(
  parameters: Pick<SchedulerParameters<EventModel>, 'events' | 'eventModelStructure'>,
): Pick<
  SchedulerState<EventModel>,
  | 'eventModelStructure'
  | 'eventIdList'
  | 'eventModelList'
  | 'eventModelLookup'
  | 'processedEventLookup'
> {
  const { events, eventModelStructure } = parameters;

  const eventIdList: CalendarEventId[] = [];
  const eventModelLookup = new Map<CalendarEventId, EventModel>();
  const processedEventLookup = new Map<CalendarEventId, CalendarEvent>();
  for (const event of events) {
    const processedEvent = getCalendarEventFromModel(event, eventModelStructure);
    eventIdList.push(processedEvent.id);
    eventModelLookup.set(processedEvent.id, event);
    processedEventLookup.set(processedEvent.id, processedEvent);
  }

  return {
    eventModelStructure,
    eventModelList: events,
    eventIdList,
    eventModelLookup,
    processedEventLookup,
  };
}
