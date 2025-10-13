import { EMPTY_ARRAY } from '@base-ui-components/utils/empty';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarOccurrencePlaceholder,
  CalendarResource,
  CalendarResourceId,
  SchedulerEventModelStructure,
  SchedulerResourceModelStructure,
} from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { SchedulerParameters, SchedulerState } from './SchedulerStore.types';

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

const RESOURCE_PROPERTIES_LOOKUP: { [P in keyof CalendarResource]-?: true } = {
  id: true,
  title: true,
  eventColor: true,
};

const RESOURCE_PROPERTIES = Object.keys(RESOURCE_PROPERTIES_LOOKUP) as (keyof CalendarResource)[];

/**
 * Converts an event model to a processed event using the provided model structure.
 */
export function getProcessedEventFromModel<TEvent extends {}>(
  event: TEvent,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): CalendarEvent {
  const processedEvent = {} as CalendarEvent;

  for (const key of EVENT_PROPERTIES) {
    const getter = eventModelStructure?.[key]?.getter;

    // @ts-ignore
    processedEvent[key] = getter ? getter(event) : event[key];
  }

  return processedEvent;
}

/**
 * Updates an event model based on the provided changes and model structure.
 */
export function getUpdatedEventModelFromChanges<TEvent extends {}>(
  event: TEvent,
  changes: Partial<CalendarEvent>,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): TEvent {
  let updatedEventModel = { ...event };
  const propertiesWithSetter: [AnyEventSetter<TEvent>, any][] = [];

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

/**
 * Create an event model from a processed event using the provided model structure.
 */
export function createEventModel<TEvent extends {}>(
  event: CalendarEvent,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): TEvent {
  let eventModel: Partial<TEvent> = {};
  const propertiesWithSetter: [AnyEventSetter<TEvent>, any][] = [];

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

  return eventModel as TEvent;
}

/**
 * Converts a resource model to a processed resource using the provided model structure.
 */
export function getProcessedResourceFromModel<TResource extends {}>(
  resource: TResource,
  resourceModelStructure: SchedulerResourceModelStructure<TResource> | undefined,
): CalendarResource {
  const processedResource = {} as CalendarResource;

  for (const key of RESOURCE_PROPERTIES) {
    const getter = resourceModelStructure?.[key]?.getter;

    // @ts-ignore
    processedResource[key] = getter ? getter(resource) : resource[key];
  }

  return processedResource;
}

type AnyEventSetter<TEvent extends {}> = (event: TEvent | Partial<TEvent>, value: any) => TEvent;

export function buildEventsState<TEvent extends {}, TResource extends {}>(
  parameters: Pick<SchedulerParameters<TEvent, TResource>, 'events' | 'eventModelStructure'>,
): Pick<
  SchedulerState<TEvent>,
  | 'eventIdList'
  | 'eventModelLookup'
  | 'processedEventLookup'
  | 'eventModelStructure'
  | 'eventModelList'
> {
  const { events, eventModelStructure } = parameters;

  const eventIdList: CalendarEventId[] = [];
  const eventModelLookup = new Map<CalendarEventId, TEvent>();
  const processedEventLookup = new Map<CalendarEventId, CalendarEvent>();
  for (const event of events) {
    const processedEvent = getProcessedEventFromModel(event, eventModelStructure);
    eventIdList.push(processedEvent.id);
    eventModelLookup.set(processedEvent.id, event);
    processedEventLookup.set(processedEvent.id, processedEvent);
  }

  return {
    eventIdList,
    eventModelLookup,
    eventModelStructure,
    processedEventLookup,
    eventModelList: events,
  };
}

export function buildResourcesState<TEvent extends {}, TResource extends {}>(
  parameters: Pick<SchedulerParameters<TEvent, TResource>, 'resources' | 'resourceModelStructure'>,
): Pick<
  SchedulerState<TEvent>,
  'resourceIdList' | 'processedResourceLookup' | 'resourceModelStructure'
> {
  const { resources = EMPTY_ARRAY, resourceModelStructure } = parameters;

  const resourceIdList: string[] = [];
  const processedResourceLookup = new Map<CalendarResourceId, CalendarResource>();
  for (const resource of resources) {
    const processedResource = getProcessedResourceFromModel(resource, resourceModelStructure);
    resourceIdList.push(processedResource.id);
    processedResourceLookup.set(processedResource.id, processedResource);
  }

  return {
    resourceIdList,
    processedResourceLookup,
    resourceModelStructure,
  };
}
