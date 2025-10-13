'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  CalendarEvent,
  CalendarOccurrencePlaceholder,
  CalendarOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  CalendarEventUpdatedProperties,
  SchedulerValidDate,
  RecurringUpdateEventScope,
} from '../models';
import { EventDropData, EventDropDataLookup } from '../utils/drag-utils';
import { SchedulerStoreInContext, useSchedulerStoreContext } from '../use-scheduler-store-context';
import { selectors } from './SchedulerStore';

export function useDropTarget<Targets extends keyof EventDropDataLookup>(
  parameters: useDropTarget.Parameters<Targets>,
) {
  const {
    surfaceType,
    ref,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
    chooseRecurringEventScope,
  } = parameters;
  const store = useSchedulerStoreContext();

  React.useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const createDropData: useDropTarget.CreateDropData = (data, newStart, newEnd) => {
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
      canDrop: ({ source }) => isValidDropTarget(source.data),
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
      onDrop: async ({ source, location }) => {
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
            chooseRecurringEventScope,
          );
        }
      },
    });
  }, [
    ref,
    surfaceType,
    getEventDropData,
    isValidDropTarget,
    addPropertiesToDroppedEvent,
    store,
    chooseRecurringEventScope,
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
     * Prompts the UI to choose the scope for a recurring event update.
     * Return `null` to cancel the operation.
     */
    chooseRecurringEventScope?: () => Promise<RecurringUpdateEventScope | null>;
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
  chooseRecurringEventScope?: () => Promise<RecurringUpdateEventScope | null>,
): Promise<void> {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalEvent } = placeholder;

  const original = selectors.event(store.state, eventId);
  if (!original) {
    throw new Error(`Scheduler: the original event was not found (id="${eventId}").`);
  }

  const changes: CalendarEventUpdatedProperties = { id: eventId, start, end };
  if (addPropertiesToDroppedEvent) {
    Object.assign(changes, addPropertiesToDroppedEvent());
  }

  if (original.rrule) {
    const scope = chooseRecurringEventScope ? await chooseRecurringEventScope() : null;

    if (!scope) {
      return;
    }

    store.updateRecurringEvent({
      occurrenceStart: originalEvent.start,
      changes,
      scope,
    });
    return;
  }

  store.updateEvent(changes);
}
