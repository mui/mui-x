import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { TemporalTimezone } from '../../../base-ui-copy/types';
import {
  SchedulerProcessedEvent,
  SchedulerEventId,
  SchedulerOccurrencePlaceholder,
  SchedulerResource,
  SchedulerResourceId,
  SchedulerEventModelStructure,
  SchedulerResourceModelStructure,
  SchedulerEvent,
  SchedulerEventCreationProperties,
  SchedulerEventUpdatedProperties,
} from '../../../models';
import { processEvent } from '../../../process-event';
import { Adapter } from '../../../use-adapter/useAdapter.types';
import { SchedulerParameters, SchedulerState } from './SchedulerStore.types';

/**
 * Determines if the occurrence placeholder has changed in a meaningful way that requires updating the store.
 */
export function shouldUpdateOccurrencePlaceholder(
  adapter: Adapter,
  previous: SchedulerOccurrencePlaceholder | null,
  next: SchedulerOccurrencePlaceholder | null,
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

const EVENT_PROPERTIES_LOOKUP: { [P in keyof SchedulerEvent]-?: true } = {
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
  color: true,
  draggable: true,
  resizable: true,
  className: true,
  timezone: true,
};

const EVENT_PROPERTIES = Object.keys(EVENT_PROPERTIES_LOOKUP) as (keyof SchedulerEvent)[];

const RESOURCE_PROPERTIES_LOOKUP: { [P in keyof SchedulerResource]-?: true } = {
  id: true,
  title: true,
  eventColor: true,
  children: true,
  areEventsDraggable: true,
  areEventsResizable: true,
};

const RESOURCE_PROPERTIES = Object.keys(RESOURCE_PROPERTIES_LOOKUP) as (keyof SchedulerResource)[];

/**
 * Converts an event model to a processed event using the provided model structure.
 */
export function getProcessedEventFromModel<TEvent extends object>(
  model: TEvent,
  adapter: Adapter,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
  displayTimezone: TemporalTimezone,
): SchedulerProcessedEvent {
  // 1. Convert the model to a default event model
  const modelInDefaultFormat = {} as SchedulerEvent;

  for (const key of EVENT_PROPERTIES) {
    // @ts-ignore
    const getter = eventModelStructure?.[key]?.getter;

    // @ts-ignore
    modelInDefaultFormat[key] = getter ? getter(model) : model[key];
  }

  // 2. Convert the default event model to a processed event
  return processEvent(modelInDefaultFormat, displayTimezone, adapter);
}

/**
 * Updates an event model based on the provided changes and model structure.
 * Converts internal date objects (`TemporalSupportedObject`) to strings
 * before applying them to the user's model, because `SchedulerEvent` date
 * fields are strings.
 */
export function getUpdatedEventModelFromChanges<TEvent extends object>(
  oldModel: TEvent,
  changes: SchedulerEventUpdatedProperties,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
): TEvent {
  const { start, end, exDates, ...rest } = changes;
  const stringified: Record<string, any> = { ...rest };
  if (start != null) {
    stringified.start = (start as Date).toISOString();
  }
  if (end != null) {
    stringified.end = (end as Date).toISOString();
  }
  if (exDates != null) {
    stringified.exDates = exDates.map((d) => (d as Date).toISOString());
  }

  return createOrUpdateEventModelFromBuiltInEventModel<TEvent, false>(
    oldModel,
    stringified as SchedulerEventUpdatedProperties,
    eventModelStructure,
  );
}

/**
 * Create an event model from a processed event using the provided model structure.
 */
export function createEventModel<TEvent extends object>(
  event: SchedulerEventCreationProperties,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
) {
  const id = crypto.randomUUID();
  const { start, end, exDates, ...eventRest } = event;
  const builtInEvent: SchedulerEvent = {
    ...eventRest,
    id,
    start: typeof start === 'string' ? start : (start as Date).toISOString(),
    end: typeof end === 'string' ? end : (end as Date).toISOString(),
    ...(exDates != null
      ? {
          exDates: exDates.map((d) => (typeof d === 'string' ? d : (d as Date).toISOString())),
        }
      : {}),
  };

  const model = createOrUpdateEventModelFromBuiltInEventModel<TEvent, true>(
    null,
    builtInEvent,
    eventModelStructure,
  );

  return { id, model };
}

function createOrUpdateEventModelFromBuiltInEventModel<
  TEvent extends object,
  TIsCreating extends boolean,
>(
  oldModel: TIsCreating extends true ? null : TEvent,
  changes: TIsCreating extends true ? SchedulerEvent : SchedulerEventUpdatedProperties,
  eventModelStructure: SchedulerEventModelStructure<any> | undefined,
) {
  let eventModel = oldModel == null ? {} : { ...oldModel };
  const propertiesWithSetter: [AnyEventSetter<TEvent>, any][] = [];

  for (const key in changes) {
    if (changes.hasOwnProperty(key)) {
      const typedKey = key as keyof SchedulerEvent;
      const setter = eventModelStructure?.[typedKey]?.setter;
      if (setter) {
        // @ts-ignore
        propertiesWithSetter.push([setter, changes[key]]);
      } else if (changes[key] === undefined) {
        // @ts-ignore
        delete eventModel[key];
      }
      // If the property was set to its default value, remove it from the model
      else if (oldModel != null && key === 'allDay' && changes[key] === false) {
        // @ts-ignore
        delete eventModel[key];
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
): SchedulerResource {
  const processedResource = {} as SchedulerResource;

  for (const key of RESOURCE_PROPERTIES) {
    const getter = resourceModelStructure?.[key]?.getter;

    // @ts-ignore
    const resourceProperty = getter ? getter(resource) : resource[key];

    if (key === 'children' && Array.isArray(resourceProperty)) {
      // Process children recursively
      const children = resourceProperty.map((child) =>
        getProcessedResourceFromModel(child, resourceModelStructure),
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
  adapter: Adapter,
  displayTimezone: TemporalTimezone,
): Pick<
  SchedulerState<TEvent>,
  | 'eventIdList'
  | 'eventModelLookup'
  | 'processedEventLookup'
  | 'eventModelStructure'
  | 'eventModelList'
> {
  const { events, eventModelStructure } = parameters;

  const eventIdList: SchedulerEventId[] = [];
  const eventModelLookup = new Map<SchedulerEventId, TEvent>();
  const processedEventLookup = new Map<SchedulerEventId, SchedulerProcessedEvent>();

  for (const event of events) {
    const processedEvent = getProcessedEventFromModel(
      event,
      adapter,
      eventModelStructure,
      displayTimezone,
    );
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
  const processedResourceLookup = new Map<SchedulerResourceId, SchedulerResource>();
  const resourceChildrenIdLookup = new Map<SchedulerResourceId, SchedulerResourceId[]>();

  const addResourceToState = (processedResource: SchedulerResource) => {
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
