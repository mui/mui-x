'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  SchedulerEvent,
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderExternalDrag,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  SchedulerEventUpdatedProperties,
  SchedulerValidDate,
  SchedulerResourceId,
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
import { isInternalDragOrResizePlaceholder } from './drag-utils';

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
          resourceId: resourceId === undefined ? (data.eventData.resource ?? null) : resourceId,
        };
      }

      const type =
        data.source === 'CalendarGridDayEventResizeHandler' ||
        data.source === 'CalendarGridTimeEventResizeHandler'
          ? 'internal-resize'
          : 'internal-drag';

      return {
        type,
        surfaceType,
        start: newStart,
        end: newEnd,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        originalOccurrence: data.originalOccurrence,
        resourceId:
          resourceId === undefined ? (data.originalOccurrence.resource ?? null) : resourceId,
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

        if (isInternalDragOrResizePlaceholder(placeholder)) {
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
          (isInternalDragOrResizePlaceholder(currentPlaceholder) &&
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
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
    /**
     * The id of the resource onto which to drop the event.
     * If null, the event will be dropped outside of any resource.
     * If not defined, the event will be dropped onto the resource it was originally in (if any).
     */
    resourceId?: SchedulerResourceId | null;
  }

  export type CreateDropData = (
    data: EventDropData,
    newStart: SchedulerValidDate,
    newEnd: SchedulerValidDate,
  ) => SchedulerOccurrencePlaceholder;

  export type GetEventDropData = (parameters: {
    data: any;
    input: { clientX: number; clientY: number };
    createDropData: CreateDropData;
  }) => SchedulerOccurrencePlaceholder | undefined;
}

/**
 * Applies the data from the placeholder occurrence to the event it represents.
 */
async function applyInternalDragOrResizeOccurrencePlaceholder(
  store: SchedulerStoreInContext<any, any>,
  placeholder: SchedulerOccurrencePlaceholderInternalDragOrResize,
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
): Promise<void> {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalOccurrence } = placeholder;

  const original = schedulerEventSelectors.processedEvent(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: SchedulerEventUpdatedProperties = { id: eventId, start, end };

  // If `undefined`, we want to set the event resource to `undefined` (no resource).
  // If `null`, we want to keep the original event resource.
  if (placeholder.resourceId !== null) {
    changes.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(changes, addPropertiesToDroppedEvent());
  }

  if (original.rrule) {
    store.updateRecurringEvent({
      occurrenceStart: originalOccurrence.start.value,
      changes,
    });
    return;
  }

  store.updateEvent(changes);
}

function applyExternalDragOccurrencePlaceholder(
  store: SchedulerStoreInContext<any, any>,
  placeholder: SchedulerOccurrencePlaceholderExternalDrag,
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
) {
  const event: SchedulerEvent = {
    start: placeholder.start,
    end: placeholder.end,
    ...placeholder.eventData,
  };

  // If `undefined`, we want to set the event resource to `undefined` (no resource).
  // If `null`, we want to keep the original event resource.
  if (placeholder.resourceId !== null) {
    event.resource = placeholder.resourceId;
  }

  if (addPropertiesToDroppedEvent) {
    Object.assign(event, addPropertiesToDroppedEvent());
  }

  store.setOccurrencePlaceholder(null);
  store.createEvent(event);
  placeholder.onEventDrop?.();
}
