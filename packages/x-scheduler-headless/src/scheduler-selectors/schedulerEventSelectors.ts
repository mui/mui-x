import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { SchedulerEvent, CalendarEventId } from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';

const processedEventSelector = createSelector(
  (state: State) => state.processedEventLookup,
  (processedEventLookup, eventId: CalendarEventId | null | undefined) =>
    eventId == null ? null : processedEventLookup.get(eventId),
);

const isEventReadOnlySelector = createSelector(
  processedEventSelector,
  (state: State) => state.readOnly,
  (event, readOnly, _eventId: CalendarEventId) => {
    return !!event?.readOnly || readOnly;
  },
);

export const schedulerEventSelectors = {
  canCreateNewEvent: createSelector((state: State) => !state.readOnly),
  processedEvent: processedEventSelector,
  isReadOnly: isEventReadOnlySelector,
  color: createSelector((state: State, eventId: CalendarEventId) => {
    const event = processedEventSelector(state, eventId);
    if (!event) {
      return state.eventColor;
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
    (isEventReadOnly, eventModelStructure, _eventId: CalendarEventId) => {
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
};
