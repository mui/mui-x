import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { generateId } from '@base-ui/utils/generateId';
import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalTimezone, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type {
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
import type { Adapter } from '../../../use-adapter/useAdapter.types';
import type { SchedulerParameters, SchedulerState } from './SchedulerStore.types';
import type { SchedulerRecurringEventsPluginInterface } from '../../plugins/SchedulerRecurringEventsPlugin.types';
import { dateToEventString } from '../date-utils';

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

  // Compare keys present in `next`.
  for (const key in untypedNext) {
    if (key === 'start' || key === 'end') {
      if (!adapter.isEqual(untypedNext[key], untypedPrevious[key])) {
        return true;
      }
    } else if (!Object.is(untypedNext[key], untypedPrevious[key])) {
      return true;
    }
  }

  // Catch keys present in `previous` but removed from `next` (e.g. `isHidden`).
  for (const key in untypedPrevious) {
    if (!(key in untypedNext)) {
      return true;
    }
  }

  return false;
}

export const DEFAULT_EVENT_MODEL_STRUCTURE: SchedulerEventModelStructure<any> = {};

type RequiredEventProperty = {
  [P in keyof SchedulerEvent]-?: {} extends Pick<SchedulerEvent, P> ? never : P;
}[keyof SchedulerEvent];

/**
 * The properties an event always has, so an update cannot remove them. Typed off
 * `SchedulerEvent` so a new required property has to be listed here too.
 */
const ALWAYS_PRESENT_EVENT_PROPERTIES: { [P in RequiredEventProperty]: true } = {
  id: true,
  title: true,
  start: true,
  end: true,
};

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

/**
 * Whether the key is one of the built-in `SchedulerEvent` properties.
 */
export function isBuiltInEventProperty(key: string): boolean {
  return EVENT_PROPERTIES_LOOKUP.hasOwnProperty(key);
}

// Custom model keys are arbitrary consumer strings: a plain assignment of a key
// like `__proto__` would hit the legacy prototype setter instead of creating an
// own property.
function setOwnProperty(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

/**
 * Returns the properties of an event model that are not part of the built-in `SchedulerEvent` shape.
 */
export function getCustomEventProperties<TEvent extends object>(model: TEvent): Partial<TEvent> {
  const customProperties: Record<string, unknown> = {};
  for (const key in model) {
    // `call` form: a custom event property named `hasOwnProperty` would shadow the method.
    if (
      Object.prototype.hasOwnProperty.call(model, key) &&
      !EVENT_PROPERTIES_LOOKUP.hasOwnProperty(key)
    ) {
      setOwnProperty(customProperties, key, model[key as keyof TEvent]);
    }
  }
  return customProperties as Partial<TEvent>;
}

const RESOURCE_PROPERTIES_LOOKUP: { [P in keyof SchedulerResource]-?: true } = {
  id: true,
  title: true,
  eventColor: true,
  children: true,
  areEventsDraggable: true,
  areEventsResizable: true,
  areEventsReadOnly: true,
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
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null = null,
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
  return processEvent(modelInDefaultFormat, displayTimezone, adapter, recurringEventsPlugin);
}

/**
 * Updates an event model based on the provided changes and model structure.
 * Converts internal date objects (`TemporalSupportedObject`) to strings
 * before applying them to the user's model, because `SchedulerEvent` date
 * fields are strings. Respects the original string format (instant vs wall-time).
 */
export function getUpdatedEventModelFromChanges<TEvent extends object>(
  oldModel: TEvent,
  changes: SchedulerEventUpdatedProperties,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
  adapter: Adapter,
  originalBuiltInModel: SchedulerEvent,
): TEvent {
  const dataTimezone = originalBuiltInModel.timezone ?? 'default';
  const stringified: Record<string, any> = { ...changes };
  if (changes.start != null) {
    stringified.start = dateToEventString(
      adapter,
      changes.start,
      originalBuiltInModel.start,
      dataTimezone,
    );
  }
  if (changes.end != null) {
    stringified.end = dateToEventString(
      adapter,
      changes.end,
      originalBuiltInModel.end,
      dataTimezone,
    );
  }
  if (changes.exDates != null) {
    stringified.exDates = changes.exDates.map((d, i) => {
      const originalExDate = originalBuiltInModel.exDates?.[i];
      if (originalExDate) {
        return dateToEventString(adapter, d, originalExDate, dataTimezone);
      }
      // New exDate — match the format of start
      return dateToEventString(adapter, d, originalBuiltInModel.start, dataTimezone);
    });
  }
  if (changes.rrule != null && typeof changes.rrule === 'object' && changes.rrule.until != null) {
    const originalRRule = originalBuiltInModel.rrule;
    const originalUntilString = typeof originalRRule === 'object' ? originalRRule.until : undefined;
    const referenceString = originalUntilString ?? originalBuiltInModel.start;
    stringified.rrule = {
      ...changes.rrule,
      until: dateToEventString(adapter, changes.rrule.until, referenceString, dataTimezone),
    };
  }

  return createOrUpdateEventModelFromBuiltInEventModel<TEvent, false>(
    oldModel,
    stringified as SchedulerEventUpdatedProperties,
    eventModelStructure,
  );
}

/**
 * Creates an event model from the creation properties using the provided model structure.
 */
export function createEventModel<TEvent extends object>(
  event: SchedulerEventCreationProperties,
  eventModelStructure: SchedulerEventModelStructure<TEvent> | undefined,
  adapter: Adapter,
) {
  const id = generateId('event');

  const formatNewDate = (value: string | TemporalSupportedObject): string => {
    if (typeof value === 'string') {
      return value;
    }
    return adapter.toJsDate(value).toISOString();
  };

  // Internal callers (e.g. FormContent) may pass rrule.until as a TemporalSupportedObject.
  // Convert it to a string so the built-in model stays in SchedulerEvent format.
  const rrule: SchedulerEvent['rrule'] =
    typeof event.rrule === 'object' &&
    event.rrule.until != null &&
    typeof event.rrule.until !== 'string'
      ? { ...event.rrule, until: formatNewDate(event.rrule.until) }
      : (event.rrule as SchedulerEvent['rrule']);

  const builtInEvent: SchedulerEvent = {
    ...event,
    id,
    start: formatNewDate(event.start),
    end: formatNewDate(event.end),
    exDates: event.exDates?.map(formatNewDate),
    rrule,
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
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      const typedKey = key as keyof SchedulerEvent;
      // An event always has these, so an explicit `undefined` reads as "unchanged"
      // instead of removing them — checked before the setter dispatch so a custom
      // event model cannot receive the `undefined` either.
      if (
        changes[key] === undefined &&
        ALWAYS_PRESENT_EVENT_PROPERTIES.hasOwnProperty(key) &&
        oldModel != null
      ) {
        continue;
      }
      const setter = eventModelStructure?.[typedKey]?.setter;
      if (setter) {
        // @ts-ignore
        propertiesWithSetter.push([setter, changes[key]]);
      } else if (changes[key] === undefined) {
        // An explicit `undefined` removes the property, e.g. `rrule: undefined` clears
        // the recurrence.
        // @ts-ignore
        delete eventModel[key];
      }
      // If the property was set to its default value, remove it from the model
      else if (oldModel != null && key === 'allDay' && changes[key] === false) {
        // @ts-ignore
        delete eventModel[key];
      } else {
        setOwnProperty(eventModel, key, changes[key]);
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

/**
 * Throws if the resolved event id is missing.
 */
export function checkSchedulerEventIdIsValid(id: SchedulerEventId, event: object) {
  if (id == null) {
    throw new Error(
      `MUI X Scheduler: All events must have a unique \`id\`.
Without an \`id\`, an event cannot be tracked and silently overwrites another event in the calendar state.
Add an \`id\` to every event, or set \`eventModelStructure.id.getter\` to derive one from your event model.
An event was provided without an \`id\`:
${JSON.stringify(event)}`,
    );
  }
}

type ProcessedEventLookupContext = [
  adapter: Adapter,
  displayTimezone: TemporalTimezone,
  eventModelStructure: SchedulerEventModelStructure<any> | undefined,
  processedEventByModel: WeakMap<object, SchedulerProcessedEvent>,
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null,
];

const processedEventLookupContext = new WeakMap<
  Map<SchedulerEventId, SchedulerProcessedEvent>,
  ProcessedEventLookupContext
>();

type BuildEventsStateParameters<TEvent extends object, TResource extends object> = Pick<
  SchedulerParameters<TEvent, TResource>,
  'events' | 'eventModelStructure'
> & {
  adapter: Adapter;
  displayTimezone: TemporalTimezone;
} & (
    | {
        recurringEventsPlugin?: SchedulerRecurringEventsPluginInterface | null;
        previousState?: never;
      }
    | {
        recurringEventsPlugin?: never;
        previousState: Pick<
          SchedulerState<TEvent>,
          'eventIdList' | 'eventModelLookup' | 'processedEventLookup' | 'recurringEventsPlugin'
        >;
      }
  );

export function buildEventsState<TEvent extends object, TResource extends object>(
  options: BuildEventsStateParameters<TEvent, TResource>,
): Pick<
  SchedulerState<TEvent>,
  | 'eventIdList'
  | 'eventModelLookup'
  | 'processedEventLookup'
  | 'eventModelStructure'
  | 'eventModelList'
> {
  const { adapter, displayTimezone, previousState, eventModelStructure } = options;
  const events = options.events ?? EMPTY_ARRAY;
  const recurringEventsPlugin =
    options.recurringEventsPlugin ?? previousState?.recurringEventsPlugin ?? null;

  const eventIdList: SchedulerEventId[] = [];
  const eventModelLookup = new Map<SchedulerEventId, TEvent>();
  const processedEventLookup = new Map<SchedulerEventId, SchedulerProcessedEvent>();
  const previousContext = previousState
    ? processedEventLookupContext.get(previousState.processedEventLookup)
    : undefined;
  const canReusePrevious =
    previousState !== undefined &&
    previousContext !== undefined &&
    previousContext[0] === adapter &&
    previousContext[1] === displayTimezone &&
    previousContext[2] === eventModelStructure &&
    previousContext[4] === recurringEventsPlugin;
  const previousProcessedEventByModel = canReusePrevious ? previousContext[3] : null;
  const processedEventByModel = new WeakMap<object, SchedulerProcessedEvent>();
  let hasSameEventIds = canReusePrevious;
  let eventModelMismatchCount = 0;
  let processedEventMismatchCount = 0;

  for (const event of events) {
    const processedEvent =
      previousProcessedEventByModel?.get(event) ??
      getProcessedEventFromModel(
        event,
        adapter,
        eventModelStructure,
        displayTimezone,
        recurringEventsPlugin,
      );
    processedEventByModel.set(event, processedEvent);
    const { id } = processedEvent;
    checkSchedulerEventIdIsValid(id, event);

    const alreadySeen = eventModelLookup.has(id);
    if (canReusePrevious) {
      const previousEventModel = previousState.eventModelLookup.get(id);
      const previousProcessedEvent = previousState.processedEventLookup.get(id);

      // For duplicate ids, keep one mismatch per id based on the latest occurrence.
      if (alreadySeen) {
        if (eventModelLookup.get(id) !== previousEventModel) {
          eventModelMismatchCount -= 1;
        }
        if (processedEventLookup.get(id) !== previousProcessedEvent) {
          processedEventMismatchCount -= 1;
        }
      }
      if (event !== previousEventModel) {
        eventModelMismatchCount += 1;
      }
      if (processedEvent !== previousProcessedEvent) {
        processedEventMismatchCount += 1;
      }
    }

    if (alreadySeen) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          `MUI X Scheduler: Two or more events share the same id "${String(id)}".`,
          'Event ids must be unique. Only the last event with a given id is kept, the others are ignored.',
        ]);
      }
    } else {
      if (
        hasSameEventIds &&
        canReusePrevious &&
        previousState.eventIdList[eventIdList.length] !== id
      ) {
        hasSameEventIds = false;
      }
      eventIdList.push(id);
    }

    eventModelLookup.set(id, event);
    processedEventLookup.set(id, processedEvent);
  }

  hasSameEventIds &&= canReusePrevious && eventIdList.length === previousState.eventIdList.length;
  const hasSameEventModels = hasSameEventIds && eventModelMismatchCount === 0;
  const hasSameProcessedEvents = hasSameEventIds && processedEventMismatchCount === 0;
  const nextProcessedEventLookup = hasSameProcessedEvents
    ? previousState!.processedEventLookup
    : processedEventLookup;

  processedEventLookupContext.set(nextProcessedEventLookup, [
    adapter,
    displayTimezone,
    eventModelStructure,
    processedEventByModel,
    recurringEventsPlugin,
  ]);

  return {
    eventIdList: hasSameEventIds ? previousState!.eventIdList : eventIdList,
    eventModelLookup: hasSameEventModels ? previousState!.eventModelLookup : eventModelLookup,
    eventModelStructure,
    processedEventLookup: nextProcessedEventLookup,
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
