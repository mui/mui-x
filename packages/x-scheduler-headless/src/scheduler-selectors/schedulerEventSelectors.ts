import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerEvent, SchedulerEventId, SchedulerEventSide } from '../models';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { DEFAULT_EVENT_CREATION_CONFIG } from '../constants';

const processedEventSelector = createSelector(
  (state: State) => state.processedEventLookup,
  (processedEventLookup, eventId: SchedulerEventId | null | undefined) =>
    eventId == null ? null : processedEventLookup.get(eventId),
);

const isEventReadOnlySelector = createSelector(
  processedEventSelector,
  (state: State) => state.readOnly,
  (event, readOnly, _eventId: SchedulerEventId) => {
    return !!event?.readOnly || readOnly;
  },
);

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
        throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
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

    // If the `draggable` property is defined on the event, it takes precedence
    if (processedEvent.draggable !== undefined) {
      return processedEvent.draggable;
    }

    // Then check if the resource or any ancestor has the `areEventsDraggable` property defined
    const resourceParentIdLookup = schedulerResourceSelectors.resourceParentIdLookup(state);
    let currentResourceId = processedEvent.resource;
    while (currentResourceId != null) {
      const resource = schedulerResourceSelectors.processedResource(state, currentResourceId);
      if (resource?.areEventsDraggable !== undefined) {
        return resource.areEventsDraggable;
      }
      currentResourceId = resourceParentIdLookup.get(currentResourceId) ?? null;
    }

    // Otherwise, fall back to the component-level setting
    return state.areEventsDraggable;
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

      // If the `resizable` property is defined on the event, it takes precedence
      const isResizableFromEventProperty = getIsResizableFromProperty(
        processedEvent.resizable,
        side,
      );

      if (isResizableFromEventProperty !== null) {
        return isResizableFromEventProperty;
      }

      // TODO: Pre-process the resource, like we do for the event. That way we can compute this information only once.
      // Then check if the resource or any ancestor has the `areEventsResizable` property defined
      const resourceParentIdLookup = schedulerResourceSelectors.resourceParentIdLookup(state);
      let currentResourceId = processedEvent.resource;
      while (currentResourceId != null) {
        const resource = schedulerResourceSelectors.processedResource(state, currentResourceId);
        const isResizableFromResourceProperty = getIsResizableFromProperty(
          resource?.areEventsResizable,
          side,
        );

        if (isResizableFromResourceProperty !== null) {
          return isResizableFromResourceProperty;
        }
        currentResourceId = resourceParentIdLookup.get(currentResourceId) ?? null;
      }

      // Otherwise, fall back to the component-level setting
      const isResizableFromComponentProperty = getIsResizableFromProperty(
        state.areEventsResizable,
        side,
      );

      return isResizableFromComponentProperty ?? false;
    },
  ),
  isRecurring: createSelector(processedEventSelector, (event) =>
    Boolean(event?.dataTimezone.rrule),
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
