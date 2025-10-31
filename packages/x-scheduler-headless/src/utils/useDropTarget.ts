'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  SchedulerEvent,
  CalendarOccurrencePlaceholder,
  CalendarOccurrencePlaceholderExternalDrag,
  CalendarOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  CalendarEventUpdatedProperties,
  SchedulerValidDate,
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
  const { surfaceType, ref, getEventDropData, isValidDropTarget, addPropertiesToDroppedEvent } =
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
        originalOccurrence: data.originalOccurrence,
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
  }, [ref, surfaceType, getEventDropData, isValidDropTarget, addPropertiesToDroppedEvent, store]);
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
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
): Promise<void> {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalOccurrence } = placeholder;

  const original = schedulerEventSelectors.processedEvent(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: CalendarEventUpdatedProperties = { id: eventId, start, end };
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
  placeholder: CalendarOccurrencePlaceholderExternalDrag,
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
) {
  const event: SchedulerEvent = {
    start: placeholder.start,
    end: placeholder.end,
    ...placeholder.eventData,
  };

  if (addPropertiesToDroppedEvent) {
    Object.assign(event, addPropertiesToDroppedEvent());
  }

  store.setOccurrencePlaceholder(null);
  store.createEvent(event);
  placeholder.onEventDrop?.();
}
