import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { SchedulerEvent, SchedulerEventId, SchedulerEventSide } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
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
  creationConfig: createSelector(
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
  isPropertyReadOnly: createSelector(
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
    if (processedEvent.draggable === true) {
      return true;
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

      const isResizableFromComponentProperty = getIsResizableFromProperty(
        state.areEventsResizable,
        side,
      );

      return isResizableFromComponentProperty ?? false;
    },
  ),
};

function getIsResizableFromProperty(
  propertyValue: boolean | SchedulerEventSide | undefined,
  side: SchedulerEventSide,
): boolean | null {
  if (propertyValue === true) {
    return true;
  }

  if (propertyValue === false) {
    return false;
  }

  if (propertyValue === side) {
    return true;
  }

  return null;
}
