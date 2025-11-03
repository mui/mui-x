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
  children: true,
};

const RESOURCE_PROPERTIES = Object.keys(RESOURCE_PROPERTIES_LOOKUP) as (keyof CalendarResource)[];

/**
 * Converts an event model to a processed event using the provided model structure.
 */
export function getProcessedEventFromModel<TEvent extends object>(
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
export function getUpdatedEventModelFromChanges<TEvent extends object>(
  event: TEvent,
  changes: Partial<CalendarEvent>,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): TEvent {
  return createOrUpdateEventModelFromProcessedEvent<TEvent, false>(
    event,
    changes,
    eventModelStructure,
  );
}

/**
 * Create an event model from a processed event using the provided model structure.
 */
export function createEventModel<TEvent extends object>(
  processedEvent: CalendarEvent,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): TEvent {
  return createOrUpdateEventModelFromProcessedEvent<TEvent, true>(
    null,
    processedEvent,
    eventModelStructure,
  );
}

function createOrUpdateEventModelFromProcessedEvent<
  TEvent extends object,
  TIsCreating extends boolean,
>(
  initialProcessedEvent: TIsCreating extends true ? null : TEvent,
  changes: TIsCreating extends true ? CalendarEvent : Partial<CalendarEvent>,
  eventModelStructure: SchedulerEventModelStructure<any> | undefined,
) {
  let eventModel = initialProcessedEvent == null ? {} : { ...initialProcessedEvent };
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
        eventModel[key] = changes[key];
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
export function getProcessedResourceFromModel<TResource extends object>(
  resource: TResource,
  resourceModelStructure: SchedulerResourceModelStructure<TResource> | undefined,
): CalendarResource {
  const processedResource = {} as CalendarResource;

  for (const key of RESOURCE_PROPERTIES) {
    const getter = resourceModelStructure?.[key]?.getter;

    const resourceProperty = getter ? getter(resource) : resource[key];

    if (key === 'children' && Array.isArray(resourceProperty)) {
      // Process children recursively
      const children = resourceProperty.map((child) =>
        getProcessedResourceFromModel(child as TResource, resourceModelStructure),
      );
      // @ts-ignore
      processedResource[key] = children;
      continue;
    }

    // @ts-ignore
    processedResource[key] = resourceProperty;
  }

  return processedResource;
}

type AnyEventSetter<TEvent extends object> = (
  event: TEvent | Partial<TEvent>,
  value: any,
) => TEvent;

export function buildEventsState<TEvent extends object, TResource extends object>(
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

export function buildResourcesState<TEvent extends object, TResource extends object>(
  parameters: Pick<SchedulerParameters<TEvent, TResource>, 'resources' | 'resourceModelStructure'>,
): Pick<
  SchedulerState<TEvent>,
  | 'resourceIdList'
  | 'processedResourceLookup'
  | 'resourceModelStructure'
  | 'resourceChildrenIdLookup'
> {
  const { resources = EMPTY_ARRAY, resourceModelStructure } = parameters;

  const resourceIdList: string[] = [];
  const processedResourceLookup = new Map<CalendarResourceId, CalendarResource>();
  const resourceChildrenIdLookup = new Map<CalendarResourceId, CalendarResourceId[]>();

  const addResourceToState = (processedResource: CalendarResource) => {
    const { children, ...resourceWithoutChildren } = processedResource;
    processedResourceLookup.set(processedResource.id, resourceWithoutChildren);
    if (children) {
      for (const child of children) {
        if (!resourceChildrenIdLookup.get(processedResource.id)) {
          resourceChildrenIdLookup.set(processedResource.id, []);
        }
        resourceChildrenIdLookup.get(processedResource.id)?.push(child.id);
        addResourceToState(child);
      }
    }
  };

  for (const resource of resources) {
    const processedResource = getProcessedResourceFromModel(resource, resourceModelStructure);
    resourceIdList.push(processedResource.id);
    addResourceToState(processedResource);
  }

  return {
    resourceIdList,
    processedResourceLookup,
    resourceModelStructure,
    resourceChildrenIdLookup,
  };
}
