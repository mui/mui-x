import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResource,
  SchedulerResourceId,
} from '../models';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { resolveResourceProperty } from './schedulerResourceSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';
import { getPrimaryResourceId } from '../internals/utils/event-utils';

/**
 * Scans the events in order and returns whether the first one with a defined `resource`
 * carries an array (multi-resource) or a string (single-resource). `undefined` when no
 * event in the data has a resource at all, letting the caller fall back to "multiple".
 */
function inferCanHaveMultipleResourcesFromEvents(
  eventIdList: State['eventIdList'],
  processedEventLookup: State['processedEventLookup'],
): boolean | undefined {
  for (const id of eventIdList) {
    const resource = processedEventLookup.get(id)?.resource;
    if (Array.isArray(resource)) {
      return true;
    }
    if (resource != null) {
      return false;
    }
  }
  return undefined;
}

const processedEventSelector = createSelector(
  (state: State) => state.processedEventLookup,
  (processedEventLookup, eventId: SchedulerEventId | null | undefined) =>
    eventId == null ? null : processedEventLookup.get(eventId),
);

const isEventReadOnlySelector = createSelector((state: State, eventId: SchedulerEventId) => {
  const processedEvent = processedEventSelector(state, eventId);
  if (!processedEvent) {
    return false;
  }

  return resolveEventProperty({
    state,
    resourceId: getPrimaryResourceId(processedEvent.resource),
    valueInEvent: processedEvent.modelInBuiltInFormat?.readOnly,
    getValueInResource: (r) => r.areEventsReadOnly,
    valueInState: state.readOnly ?? false,
  });
});

export const schedulerEventSelectors = {
  creationConfig: createSelectorMemoized(
    (state: State) => state.readOnly,
    (state: State) => state.eventCreation,
    (isSchedulerReadOnly, creationConfig) => {
      if (isSchedulerReadOnly) {
        return false;
      }
      if (creationConfig === false) {
        return false;
      }
      if (creationConfig === true) {
        return DEFAULT_EVENT_CREATION_CONFIG;
      }
      return {
        ...DEFAULT_EVENT_CREATION_CONFIG,
        ...creationConfig,
      };
    },
  ),
  /**
   * Gets the default duration (in minutes) for newly created events.
   * This can be used when you need the value event on read-only calendar.
   */
  defaultEventDuration: createSelector(
    (state: State) => state.eventCreation,
    (eventCreation) => {
      if (typeof eventCreation === 'boolean') {
        return DEFAULT_EVENT_CREATION_CONFIG.duration;
      }

      return eventCreation?.duration ?? DEFAULT_EVENT_CREATION_CONFIG.duration;
    },
  ),
  /**
   * Whether an occurrence whose own `resource` carries no shape (`null`/`undefined`) should
   * be edited/created as multi-resource. Reads `eventCreation.canHaveMultipleResources`
   * directly off the raw prop — not through `creationConfig` — so it still resolves when
   * creation is disabled (`eventCreation={false}` or a read-only scheduler), since editing
   * needs it too. Falls back to inferring from the `events` data when the prop isn't set.
   */
  canHaveMultipleResources: createSelectorMemoized(
    (state: State) => state.eventCreation,
    (state: State) => state.eventIdList,
    (state: State) => state.processedEventLookup,
    (eventCreation, eventIdList, processedEventLookup) => {
      const configured =
        typeof eventCreation === 'boolean' ? undefined : eventCreation?.canHaveMultipleResources;
      if (configured != null) {
        return configured;
      }

      return inferCanHaveMultipleResourcesFromEvents(eventIdList, processedEventLookup) ?? true;
    },
  ),
  processedEvent: processedEventSelector,
  processedEventRequired: createSelector(
    processedEventSelector,
    (event, eventId: SchedulerEventId) => {
      if (!event) {
        throw new Error(
          `MUI X Scheduler: Event with id="${eventId}" was not found. ` +
            'The requested event does not exist in the scheduler state. ' +
            'Verify the event id is correct and the event has been added.',
        );
      }

      return event;
    },
  ),
  isReadOnly: isEventReadOnlySelector,
  /**
   * Resolves an event's color. `resourceId` picks which resource's `eventColor` counts when the
   * event itself has none — pass the row's resource id on a resource-row surface (the Event
   * Timeline) so the same multi-resource event can render a different color per row instead of
   * always taking its primary resource's color. Pass `undefined` to fall back to the event's
   * primary resource, which is the only sensible choice on a surface with no row identity (the
   * Event Calendar). The argument can't be optional: the selector's memoization keys off
   * `Function.length`, which requires every parameter to be explicitly passed.
   */
  color: createSelector(
    (
      state: State,
      eventId: SchedulerEventId,
      resourceId: SchedulerResourceId | null | undefined,
    ) => {
      const event = processedEventSelector(state, eventId);
      if (!event) {
        return state.eventColor;
      }

      return resolveEventProperty({
        state,
        resourceId: resourceId === undefined ? getPrimaryResourceId(event.resource) : resourceId,
        valueInEvent: event.color,
        getValueInResource: (r) => r.eventColor,
        valueInState: state.eventColor,
      });
    },
  ),
  isPropertyReadOnly: createSelectorMemoized(
    isEventReadOnlySelector,
    (state: State) => state.eventModelStructure,
    (isEventReadOnly, eventModelStructure, _eventId: SchedulerEventId) => {
      if (isEventReadOnly) {
        return () => true;
      }

      return (property: keyof SchedulerEvent) => {
        if (eventModelStructure?.[property] && !eventModelStructure?.[property].setter) {
          return true;
        }

        return false;
      };
    },
  ),
  processedEventList: createSelectorMemoized(
    (state: State) => state.eventIdList,
    (state: State) => state.processedEventLookup,
    (eventIds, processedEventLookup) => eventIds.map((id) => processedEventLookup.get(id)!),
  ),
  idList: createSelector((state: State) => state.eventIdList),
  modelList: createSelector((state: State) => state.eventModelList),
  modelLookup: createSelector((state: State) => state.eventModelLookup),
  canDragEventsFromTheOutside: createSelector(
    (state: State) => state.canDragEventsFromTheOutside && !state.readOnly,
  ),
  canDropEventsToTheOutside: createSelector(
    (state: State) => state.canDropEventsToTheOutside && !state.readOnly,
  ),
  isDraggable: createSelector((state: State, eventId: SchedulerEventId) => {
    if (isEventReadOnlySelector(state, eventId)) {
      return false;
    }

    const eventModelStructure = state.eventModelStructure;
    if (eventModelStructure?.start && !eventModelStructure?.start.setter) {
      return false;
    }

    if (eventModelStructure?.end && !eventModelStructure?.end.setter) {
      return false;
    }

    const processedEvent = processedEventSelector(state, eventId);
    if (!processedEvent) {
      return false;
    }

    return resolveEventProperty({
      state,
      resourceId: getPrimaryResourceId(processedEvent.resource),
      valueInEvent: processedEvent.draggable,
      getValueInResource: (r) => r.areEventsDraggable,
      valueInState: state.areEventsDraggable,
    });
  }),
  isResizable: createSelector(
    (state: State, eventId: SchedulerEventId, side: SchedulerEventSide) => {
      if (isEventReadOnlySelector(state, eventId)) {
        return false;
      }

      const eventModelStructure = state.eventModelStructure;
      if (side === 'start' && eventModelStructure?.start && !eventModelStructure?.start.setter) {
        return false;
      }

      if (side === 'end' && eventModelStructure?.end && !eventModelStructure?.end.setter) {
        return false;
      }

      const processedEvent = processedEventSelector(state, eventId);
      if (!processedEvent) {
        return false;
      }

      return resolveEventProperty({
        state,
        resourceId: getPrimaryResourceId(processedEvent.resource),
        valueInEvent: getIsResizableFromProperty(processedEvent.resizable, side) ?? undefined,
        getValueInResource: (r) =>
          getIsResizableFromProperty(r.areEventsResizable, side) ?? undefined,
        valueInState: getIsResizableFromProperty(state.areEventsResizable, side) ?? false,
      });
    },
  ),
  isRecurring: createSelector(
    processedEventSelector,
    (state: State) => state.recurringEventsPlugin,
    (event, recurringEventsPlugin, _eventId: SchedulerEventId) =>
      recurringEventsPlugin != null && Boolean(event?.dataTimezone.rrule),
  ),
};

function getIsResizableFromProperty(
  propertyValue: boolean | SchedulerEventSide | undefined,
  side: SchedulerEventSide,
): boolean | null {
  if (propertyValue === undefined) {
    return null;
  }

  if (propertyValue === true) {
    return true;
  }

  if (propertyValue === false) {
    return false;
  }

  if (propertyValue === side) {
    return true;
  }

  // If the property is a specific side (e.g., 'start' or 'end') but doesn't match the current side,
  // return false because the property explicitly restricts resizing to a specific side.
  return false;
}

/**
 * Resolves an event property by checking (in order of priority):
 * 1. The event itself (`valueInEvent`)
 * 2. The resource hierarchy, child → parent → … (`getValueInResource`)
 * 3. The component-level state (`valueInState`)
 */
function resolveEventProperty<T>(parameters: {
  state: State;
  resourceId: string | null | undefined;
  valueInEvent: T | undefined;
  getValueInResource: (resource: SchedulerResource) => T | undefined;
  valueInState: T;
}): T {
  const { state, resourceId, valueInEvent, getValueInResource, valueInState } = parameters;
  if (valueInEvent !== undefined) {
    return valueInEvent;
  }

  return resolveResourceProperty(state, resourceId, getValueInResource, valueInState);
}
