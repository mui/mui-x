import { createSelectorMemoized } from '@base-ui/utils/store';
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

const processedEventSelector = (state: State, eventId: SchedulerEventId | null | undefined) =>
  eventId == null ? null : state.processedEventLookup.get(eventId);

const isEventReadOnlySelector = (state: State, eventId: SchedulerEventId) => {
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
};

const isPropertyMissingSetter = (
  eventModelStructure: State['eventModelStructure'],
  property: keyof SchedulerEvent,
) => Boolean(eventModelStructure?.[property] && !eventModelStructure[property].setter);

/**
 * Whether `eventModelStructure` can write both `start` and `end` back to the model. A date
 * declared with a getter but no setter is unrepresentable in the consumer's model — independent
 * of any particular event, so it also gates creating a brand new one.
 */
const canWriteEventDatesSelector = (eventModelStructure: State['eventModelStructure']) =>
  !isPropertyMissingSetter(eventModelStructure, 'start') &&
  !isPropertyMissingSetter(eventModelStructure, 'end');

/**
 * Whether an event's dates can be moved: the event, its resources and the scheduler are all
 * editable, and `eventModelStructure` can write both `start` and `end` back to the model.
 * All-or-nothing because a move (a drag, or a paste that lands on a new date) commits both dates
 * together (`{ id, start, end }`). A resize, which only touches one side, uses the per-property
 * check on `isResizable` instead.
 */
const canMoveDatesSelector = (state: State, eventId: SchedulerEventId) =>
  !isEventReadOnlySelector(state, eventId) && canWriteEventDatesSelector(state.eventModelStructure);

/**
 * Whether events landing on `resourceId` are read-only, resolved through the resource hierarchy
 * and falling back to the scheduler's `readOnly`. Unlike `isReadOnly`, there is no event to check
 * for its own override — for a destination that doesn't have an event yet, such as a paste target.
 */
const isResourceReadOnlySelector = (
  state: State,
  resourceId: SchedulerResourceId | SchedulerResourceId[] | null | undefined,
) =>
  resolveResourceProperty(
    state,
    getPrimaryResourceId(resourceId),
    (r) => r.areEventsReadOnly,
    state.readOnly ?? false,
  );

export const schedulerEventSelectors = {
  creationConfig: createSelectorMemoized(
    (state: State) => state.readOnly,
    (state: State) => state.eventCreation,
    (state: State) => state.eventModelStructure,
    (isSchedulerReadOnly, creationConfig, eventModelStructure) => {
      if (isSchedulerReadOnly) {
        return false;
      }
      // A new event has no old date to fall back to, so either date being read-only refuses
      // creation entirely — unlike an update, which can drop just that date and keep the rest.
      if (!canWriteEventDatesSelector(eventModelStructure)) {
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
  defaultEventDuration: (state: State) => {
    const eventCreation = state.eventCreation;
    if (typeof eventCreation === 'boolean') {
      return DEFAULT_EVENT_CREATION_CONFIG.duration;
    }

    return eventCreation?.duration ?? DEFAULT_EVENT_CREATION_CONFIG.duration;
  },
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
  processedEventRequired: (state: State, eventId: SchedulerEventId) => {
    const event = processedEventSelector(state, eventId);
    if (!event) {
      throw new Error(
        `MUI X Scheduler: Event with id="${eventId}" was not found. ` +
          'The requested event does not exist in the scheduler state. ' +
          'Verify the event id is correct and the event has been added.',
      );
    }

    return event;
  },
  isReadOnly: isEventReadOnlySelector,
  canMoveDates: canMoveDatesSelector,
  /**
   * Whether `eventModelStructure` can write both `start` and `end` back to the model. Structural,
   * with no event or resource involved — used by writers where no event exists yet (a creation)
   * or that write the whole model into a new one (a copy).
   */
  canWriteEventDates: (state: State) => canWriteEventDatesSelector(state.eventModelStructure),
  /**
   * Whether `eventModelStructure` can write a single date back to the model. Used by the
   * per-property guard in `updateEvents`, which drops only the date that can't be written instead
   * of refusing the whole update.
   */
  isDateWritable: (state: State, property: SchedulerEventSide) =>
    !isPropertyMissingSetter(state.eventModelStructure, property),
  isResourceReadOnly: isResourceReadOnlySelector,
  /**
   * Resolves an event's color. `resourceId` picks which resource's `eventColor` counts when the
   * event itself has none — pass the row's resource id on a resource-row surface (the Event
   * Timeline) so the same multi-resource event can render a different color per row instead of
   * always taking its primary resource's color. Pass `undefined` to fall back to the event's
   * primary resource, which is the only sensible choice on a surface with no row identity (the
   * Event Calendar). The argument can't be optional: the selector's memoization keys off
   * `Function.length`, which requires every parameter to be explicitly passed.
   */
  color: (
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
  isPropertyReadOnly: createSelectorMemoized(
    isEventReadOnlySelector,
    (state: State) => state.eventModelStructure,
    (isEventReadOnly, eventModelStructure, _eventId: SchedulerEventId) => {
      if (isEventReadOnly) {
        return () => true;
      }

      return (property: keyof SchedulerEvent) =>
        isPropertyMissingSetter(eventModelStructure, property);
    },
  ),
  processedEventList: createSelectorMemoized(
    (state: State) => state.eventIdList,
    (state: State) => state.processedEventLookup,
    (eventIds, processedEventLookup) => eventIds.map((id) => processedEventLookup.get(id)!),
  ),
  idList: (state: State) => state.eventIdList,
  modelList: (state: State) => state.eventModelList,
  modelLookup: (state: State) => state.eventModelLookup,
  canDragEventsFromTheOutside: (state: State) =>
    state.canDragEventsFromTheOutside && !state.readOnly,
  canDropEventsToTheOutside: (state: State) => state.canDropEventsToTheOutside && !state.readOnly,
  isDraggable: (state: State, eventId: SchedulerEventId) => {
    if (!canMoveDatesSelector(state, eventId)) {
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
  },
  isResizable: (state: State, eventId: SchedulerEventId, side: SchedulerEventSide) => {
    if (isEventReadOnlySelector(state, eventId)) {
      return false;
    }

    // Per-side, unlike a drag: a resize only commits the side being resized (`{ id, [side]:
    // value }`), so a getter-only `start` only blocks the "start" handle, not "end".
    if (isPropertyMissingSetter(state.eventModelStructure, side)) {
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
  isRecurring: (state: State, eventId: SchedulerEventId) =>
    state.recurringEventsPlugin != null &&
    Boolean(processedEventSelector(state, eventId)?.dataTimezone.rrule),
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
