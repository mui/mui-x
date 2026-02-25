import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerEvent, SchedulerEventId, SchedulerEventSide, SchedulerResource } from '../models';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

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
    resourceId: processedEvent.resource,
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
  processedEvent: processedEventSelector,
  processedEventRequired: createSelector(
    processedEventSelector,
    (event, eventId: SchedulerEventId) => {
      if (!event) {
        throw new Error(`MUI: the original event was not found (id="${eventId}").`);
      }

      return event;
    },
  ),
  isReadOnly: isEventReadOnlySelector,
  color: createSelector((state: State, eventId: SchedulerEventId) => {
    const event = processedEventSelector(state, eventId);
    if (!event) {
      return state.eventColor;
    }

    if (event.color) {
      return event.color;
    }

    const resourceColor = schedulerResourceSelectors.processedResource(
      state,
      event.resource,
    )?.eventColor;
    if (resourceColor) {
      return resourceColor;
    }

    return state.eventColor;
  }),
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
      resourceId: processedEvent.resource,
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
        resourceId: processedEvent.resource,
        valueInEvent: getIsResizableFromProperty(processedEvent.resizable, side) ?? undefined,
        getValueInResource: (r) =>
          getIsResizableFromProperty(r.areEventsResizable, side) ?? undefined,
        valueInState: getIsResizableFromProperty(state.areEventsResizable, side) ?? false,
      });
    },
  ),
  isRecurring: createSelector(
    processedEventSelector,
    (state: State) => state.plan,
    (event, plan, _eventId: SchedulerEventId) =>
      plan === 'premium' && Boolean(event?.dataTimezone.rrule),
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

  const resourceParentIdLookup = schedulerResourceSelectors.resourceParentIdLookup(state);
  let currentResourceId = resourceId ?? null;
  while (currentResourceId != null) {
    const resource = schedulerResourceSelectors.processedResource(state, currentResourceId);
    if (resource != null) {
      const value = getValueInResource(resource);
      if (value !== undefined) {
        return value;
      }
    }
    currentResourceId = resourceParentIdLookup.get(currentResourceId) ?? null;
  }

  return valueInState;
}
