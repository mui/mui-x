'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  CalendarEvent,
  CalendarOccurrencePlaceholder,
  CalendarOccurrencePlaceholderExternalDrag,
  CalendarOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  CalendarEventUpdatedProperties,
  SchedulerValidDate,
  CalendarResourceId,
  RecurringEventUpdateScope,
} from '../models';
import {
  EventDropData,
  EventDropDataLookup,
} from '../build-is-valid-drop-target/buildIsValidDropTarget';
import { SchedulerStoreInContext, useSchedulerStoreContext } from '../use-scheduler-store-context';
import { selectors } from './SchedulerStore';
import { SCHEDULER_RECURRING_EDITING_SCOPE } from '../constants';

export function useDropTarget<Targets extends keyof EventDropDataLookup>(
  parameters: useDropTarget.Parameters<Targets>,
) {
  const {
    surfaceType,
    ref,
    resourceId = null,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
  } = parameters;
  const store = useSchedulerStoreContext();

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const createDropData: useDropTarget.CreateDropData = (data, newStart, newEnd) => {
      if (data.source === 'StandaloneEvent') {
        return {
          type: 'external-drag',
          surfaceType,
          start: newStart,
          end: newEnd,
          eventData: data.eventData,
          onEventDrop: data.onEventDrop,
          resourceId: resourceId === null ? data.eventData.resource : resourceId,
        };
      }

      return {
        type: 'internal-drag-or-resize',
        surfaceType,
        start: newStart,
        end: newEnd,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        originalEvent: data.event,
        resourceId: resourceId === null ? data.event.resource : resourceId,
      };
    };

    return dropTargetForElements({
      element: ref.current,
      getData: () => ({ isSchedulerDropTarget: true, surfaceType }),
      canDrop: ({ source }) => {
        if (!isValidDropTarget(source.data)) {
          return false;
        }

        if (
          source.data.source === 'StandaloneEvent' &&
          !selectors.canDragEventsFromTheOutside(store.state)
        ) {
          return false;
        }

        return true;
      },
      onDrag: ({ source, location }) => {
        const newPlaceholder = getEventDropData({
          data: source.data,
          createDropData,
          input: location.current.input,
        });
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDrop: ({ source, location }) => {
        const dropData = getEventDropData({
          data: source.data,
          createDropData,
          input: location.current.input,
        });

        const placeholder = dropData ?? selectors.occurrencePlaceholder(store.state);

        if (placeholder?.type === 'internal-drag-or-resize') {
          applyInternalDragOrResizeOccurrencePlaceholder(
            store,
            placeholder,
            addPropertiesToDroppedEvent,
          );
        } else if (placeholder?.type === 'external-drag') {
          applyExternalDragOccurrencePlaceholder(store, placeholder, addPropertiesToDroppedEvent);
        }
      },
      onDragLeave: () => {
        const currentPlaceholder = selectors.occurrencePlaceholder(store.state);
        if (currentPlaceholder?.surfaceType !== surfaceType) {
          return;
        }

        const type = currentPlaceholder.type;
        const shouldHidePlaceholder =
          type === 'external-drag' ||
          (type === 'internal-drag-or-resize' && selectors.canDropEventsToTheOutside(store.state));

        if (shouldHidePlaceholder) {
          store.setOccurrencePlaceholder({ ...currentPlaceholder, isHidden: true });
        }
      },
    });
  }, [
    ref,
    surfaceType,
    resourceId,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
    store,
  ]);
}

export namespace useDropTarget {
  export interface Parameters<Targets extends keyof EventDropDataLookup> {
    surfaceType: EventSurfaceType;
    ref: React.RefObject<HTMLDivElement | null>;
    isValidDropTarget: (data: any) => data is EventDropDataLookup[Targets];
    getEventDropData: GetEventDropData;
    /**
     * Add properties to the event dropped in the element before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>;
    /**
     * The id of the resource onto which to drop the event.
     * If null, the event will be dropped onto the resource it was originally in (if any).
     * If undefined, the event will be dropped outside of any resource.
     * @default null
     */
    resourceId?: CalendarResourceId | undefined | null;
  }

  export type CreateDropData = (
    data: EventDropData,
    newStart: SchedulerValidDate,
    newEnd: SchedulerValidDate,
  ) => CalendarOccurrencePlaceholder;

  export type GetEventDropData = (parameters: {
    data: any;
    input: { clientX: number; clientY: number };
    createDropData: CreateDropData;
  }) => CalendarOccurrencePlaceholder | undefined;
}

/**
 * Applies the data from the placeholder occurrence to the event it represents.
 */
async function applyInternalDragOrResizeOccurrencePlaceholder(
  store: SchedulerStoreInContext,
  placeholder: CalendarOccurrencePlaceholderInternalDragOrResize,
  addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>,
  chooseRecurringEventScope?: () => Promise<RecurringEventUpdateScope>,
) {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalEvent } = placeholder;

  const original = selectors.event(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: CalendarEventUpdatedProperties = { id: eventId, start, end };

  if (placeholder.resourceId != null) {
    changes.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(changes, addPropertiesToDroppedEvent());
  }

  if (original.rrule) {
    let scope: RecurringEventUpdateScope;
    if (chooseRecurringEventScope) {
      // TODO: Issue #19440 + #19441 - Allow to edit all events or only this event.
      scope = await chooseRecurringEventScope();
    } else {
      // TODO: Issue #19766 - Let the user choose the scope via UI.
      scope = SCHEDULER_RECURRING_EDITING_SCOPE;
    }

    return store.updateRecurringEvent({
      occurrenceStart: originalEvent.start,
      changes,
      scope,
    });
  }

  return store.updateEvent(changes);
}

function applyExternalDragOccurrencePlaceholder(
  store: SchedulerStoreInContext,
  placeholder: CalendarOccurrencePlaceholderExternalDrag,
  addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>,
) {
  const event: CalendarEvent = {
    start: placeholder.start,
    end: placeholder.end,
    ...placeholder.eventData,
  };

  if (placeholder.resourceId != null) {
    event.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(event, addPropertiesToDroppedEvent());
  }

  store.setOccurrencePlaceholder(null);
  store.createEvent(event);
  placeholder.onEventDrop?.();
}
