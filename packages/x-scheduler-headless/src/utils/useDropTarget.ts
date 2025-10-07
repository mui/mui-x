'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  CalendarEvent,
  CalendarOccurrencePlaceholder,
  CalendarOccurrencePlaceholderExternalDrag,
  CalendarOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  RecurringEventUpdatedProperties,
  SchedulerValidDate,
} from '../models';
import {
  EventDropData,
  EventDropDataLookup,
} from '../build-is-valid-drop-target/buildIsValidDropTarget';
import { SchedulerStoreInContext, useSchedulerStoreContext } from '../use-scheduler-store-context';
import { RecurringUpdateEventScope, selectors } from './SchedulerStore';
import { SCHEDULER_RECURRING_EDITING_SCOPE } from '../constants';

export function useDropTarget<Targets extends keyof EventDropDataLookup>(
  parameters: useDropTarget.Parameters<Targets>,
) {
  const { surfaceType, ref, getEventDropData, isValidDropTarget, preProcessDroppedEvent } =
    parameters;
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
      };
    };

    return dropTargetForElements({
      element: ref.current,
      getData: () => ({ isSchedulerDropTarget: true, surfaceType }),
      canDrop: (arg) => {
        const data = arg.source.data;
        if (!isValidDropTarget(data)) {
          return false;
        }

        if (
          data.source === 'StandaloneEvent' &&
          !selectors.canDragEventsFromTheOutside(store.state)
        ) {
          return false;
        }

        return true;
      },
      onDrag: ({ source: { data }, location }) => {
        const newPlaceholder = getEventDropData({
          data,
          createDropData,
          input: location.current.input,
        });
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      },
      onDrop: ({ source: { data }, location }) => {
        const dropData = getEventDropData({
          data,
          createDropData,
          input: location.current.input,
        });

        const placeholder = dropData ?? selectors.occurrencePlaceholder(store.state);

        if (placeholder?.type === 'internal-drag-or-resize') {
          applyInternalDragOrResizeOccurrencePlaceholder(
            store,
            placeholder,
            preProcessDroppedEvent,
          );
        } else if (placeholder?.type === 'external-drag') {
          applyExternalDragOccurrencePlaceholder(store, placeholder);
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
  }, [ref, surfaceType, getEventDropData, isValidDropTarget, preProcessDroppedEvent, store]);
}

export namespace useDropTarget {
  export interface Parameters<Targets extends keyof EventDropDataLookup> {
    surfaceType: EventSurfaceType;
    ref: React.RefObject<HTMLDivElement | null>;
    isValidDropTarget: (data: any) => data is EventDropDataLookup[Targets];
    getEventDropData: GetEventDropData;
    /**
     * Processed the event dropped in the element before storing it in the store.
     */
    preProcessDroppedEvent?: (event: CalendarEvent) => CalendarEvent;
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
  preProcessDroppedEvent: (event: CalendarEvent) => CalendarEvent,
  chooseRecurringEventScope?: () => Promise<RecurringUpdateEventScope>,
) {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalEvent, surfaceType } = placeholder;

  const original = selectors.event(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: RecurringEventUpdatedProperties = { start, end };
  if (surfaceType === 'time-grid' && original.allDay) {
    changes.allDay = false;
  } else if (surfaceType === 'day-grid' && !original.allDay) {
    changes.allDay = true;
  }

  if (original.rrule) {
    let scope: RecurringUpdateEventScope;
    if (chooseRecurringEventScope) {
      // TODO: Issue #19440 + #19441 - Allow to edit all events or only this event.
      scope = await chooseRecurringEventScope();
    } else {
      // TODO: Issue #19766 - Let the user choose the scope via UI.
      scope = SCHEDULER_RECURRING_EDITING_SCOPE;
    }

    return store.updateRecurringEvent({
      eventId,
      occurrenceStart: originalEvent.start,
      changes,
      scope,
    });
  }

  return store.updateEvent({ id: eventId, ...changes });
}

function applyExternalDragOccurrencePlaceholder(
  store: SchedulerStoreInContext,
  placeholder: CalendarOccurrencePlaceholderExternalDrag,
) {
  const event: CalendarEvent = {
    ...placeholder.eventData,
    start: placeholder.start,
    end: placeholder.end,
    allDay: placeholder.surfaceType === 'day-grid',
  };
  store.setOccurrencePlaceholder(null);
  store.createEvent(event);
  placeholder.onEventDrop?.();
}
