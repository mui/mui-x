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
} from '../models';
import {
  EventDropData,
  EventDropDataLookup,
} from '../build-is-valid-drop-target/buildIsValidDropTarget';
import { SchedulerStoreInContext, useSchedulerStoreContext } from '../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '../scheduler-selectors';

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
        originalOccurrence: data.originalOccurrence,
        resourceId: resourceId === null ? data.originalOccurrence.resource : resourceId,
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
          !schedulerEventSelectors.canDragEventsFromTheOutside(store.state)
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

        const placeholder = dropData ?? schedulerOccurrencePlaceholderSelectors.value(store.state);

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
        const currentPlaceholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
        if (currentPlaceholder?.surfaceType !== surfaceType) {
          return;
        }

        const type = currentPlaceholder.type;
        const shouldHidePlaceholder =
          type === 'external-drag' ||
          (type === 'internal-drag-or-resize' &&
            schedulerEventSelectors.canDropEventsToTheOutside(store.state));

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
  store: SchedulerStoreInContext<any, any>,
  placeholder: CalendarOccurrencePlaceholderInternalDragOrResize,
  addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>,
): Promise<void> {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalOccurrence } = placeholder;

  const original = schedulerEventSelectors.processedEvent(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: CalendarEventUpdatedProperties = { id: eventId, start, end };

  // If `null`, we want to set the event resource to `null` (no resource).
  // If `undefined`, we want to keep the original event resource.
  if (placeholder.resourceId !== undefined) {
    changes.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(changes, addPropertiesToDroppedEvent());
  }

  if (original.rrule) {
    store.updateRecurringEvent({
      occurrenceStart: originalOccurrence.start,
      changes,
    });
    return;
  }

  store.updateEvent(changes);
}

function applyExternalDragOccurrencePlaceholder(
  store: SchedulerStoreInContext<any, any>,
  placeholder: CalendarOccurrencePlaceholderExternalDrag,
  addPropertiesToDroppedEvent?: () => Partial<CalendarEvent>,
) {
  const event: CalendarEvent = {
    start: placeholder.start,
    end: placeholder.end,
    ...placeholder.eventData,
  };

  // If `null`, we want to set the event resource to `null` (no resource).
  // If `undefined`, we want to keep the original event resource.
  if (placeholder.resourceId !== undefined) {
    event.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(event, addPropertiesToDroppedEvent());
  }

  store.setOccurrencePlaceholder(null);
  store.createEvent(event);
  placeholder.onEventDrop?.();
}
