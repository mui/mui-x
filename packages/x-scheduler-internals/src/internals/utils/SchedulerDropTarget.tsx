'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { schedulerExternalEventKind, schedulerDropTargetKind } from './schedulerDrag';
import type {
  SchedulerEvent,
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderExternalDrag,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
  EventSurfaceType,
  SchedulerEventUpdatedProperties,
  TemporalSupportedObject,
  SchedulerResourceId,
} from '../../models';
import type {
  SchedulerEventDragData,
  SchedulerEventDragPayload,
  SchedulerExternalEventDragPayload,
} from './schedulerDrag';
import type { SchedulerStoreInContext } from '../../use-scheduler-store-context';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '../../scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { useAdapterContext } from '../../use-adapter-context';
import { isTimeEventResizeTap } from '../../calendar-grid/time-event-resize-handler/timeEventResizeActivation';

export function SchedulerDropTarget(props: SchedulerDropTarget.Props) {
  const {
    surfaceType,
    resourceId = null,
    getEventDropDates,
    accept,
    addPropertiesToDroppedEvent,
    render,
  } = props;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();

  const getExternalDropData = (
    payload: SchedulerExternalEventDragPayload,
    start: TemporalSupportedObject,
  ): SchedulerOccurrencePlaceholderExternalDrag | undefined => {
    const eventCreationConfig = schedulerEventSelectors.creationConfig(store.state);
    if (eventCreationConfig === false) {
      return undefined;
    }

    return {
      type: 'external-drag',
      surfaceType,
      start,
      // TODO: Improve the start and end time of a non all-day event dropped in the Month View.
      end: adapter.addMinutes(start, payload.eventData.duration ?? eventCreationConfig.duration),
      eventData: payload.eventData,
      onEventDrop: payload.onEventDrop,
      resourceId,
    };
  };

  // A stable identity: the engine re-resolves the hovered targets whenever `canDrop` changes.
  const canDrop = useStableCallback(({ source }: { source: SchedulerDropTarget.Source }) =>
    schedulerExternalEventKind.matches(source)
      ? schedulerEventSelectors.canDragEventsFromTheOutside(store.state)
      : 'scope' in source.payload && source.payload.scope === store.dragScope,
  );

  const getDropData = (
    source: SchedulerDropTarget.Source,
    target: Draggable.Target.Record,
  ): SchedulerOccurrencePlaceholder | undefined => {
    const dates = getEventDropDates({ source, target });
    if (!dates) {
      return undefined;
    }

    if (schedulerExternalEventKind.matches(source)) {
      return getExternalDropData(source.payload, dates.start);
    }

    const data = source.dragData;
    if (!data || !dates.end) {
      return undefined;
    }
    const { originalOccurrence } = data;
    return {
      type: 'side' in data ? 'internal-resize' : 'internal-drag',
      surfaceType,
      start: dates.start,
      end: dates.end,
      eventId: originalOccurrence.id,
      occurrenceKey: originalOccurrence.key,
      originalOccurrence,
      // Not every source reports the resource it was dragged from.
      sourceResourceId: data.sourceResourceId ?? null,
      resourceId,
    };
  };

  return (
    <Draggable.Target
      accept={accept}
      kind={schedulerDropTargetKind}
      render={render}
      canDrop={canDrop}
      // Nothing styles the target while a drag is over it.
      trackDragOver={false}
      onDraggableMove={({ source, target, location }) => {
        if (isTimeEventResizeTap(source, location)) {
          // Back where it started, the resize shows nothing to apply, like its release would.
          store.setOccurrencePlaceholder(null);
          return;
        }
        const newPlaceholder = getDropData(source, target);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      }}
      onDraggableDrop={({ source, target, location }) => {
        if (isTimeEventResizeTap(source, location)) {
          store.setOccurrencePlaceholder(null);
          // The engine swallows the click that follows a drag, and this tap started one. Forward it
          // as a programmatic click, which the engine lets through, so the tap reaches the event.
          source.element.click();
          return;
        }
        const dropData = getDropData(source, target);

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
      }}
      onDraggableLeave={() => {
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
      }}
    />
  );
}

export namespace SchedulerDropTarget {
  export interface Props {
    render: React.ReactElement;
    surfaceType: EventSurfaceType;
    accept: Draggable.Accept<SchedulerDropTarget.Source['payload'], SchedulerEventDragData>;
    getEventDropDates: GetEventDropDates;
    /**
     * Add properties to the event dropped in the element before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
    /**
     * The resource of the target. An event dropped on it moves to this resource.
     * With `null`, the event keeps its resources.
     * @default null
     */
    resourceId?: SchedulerResourceId | null;
  }

  /** The drag source of any kind the target accepts. */
  export type Source = Draggable.Root.Record<
    SchedulerEventDragPayload | SchedulerExternalEventDragPayload,
    SchedulerEventDragData
  >;

  /**
   * The dates a drag would give the event if it were dropped on the target, from where the
   * pointer is. The dates of an external event omit `end`, since its duration decides it.
   */
  export interface DropDates {
    start: TemporalSupportedObject;
    end?: TemporalSupportedObject;
  }

  export type GetEventDropDates = (parameters: {
    source: Source;
    target: Draggable.Target.Record;
  }) => DropDates | undefined;
}

/**
 * Applies the data from the placeholder occurrence to the event it represents.
 */
export function applyInternalDragOrResizeOccurrencePlaceholder(
  store: SchedulerStoreInContext<any, any>,
  placeholder: SchedulerOccurrencePlaceholderInternalDragOrResize,
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
): void {
  // TODO: Try to do a single state update.
  store.setOccurrencePlaceholder(null);

  const { eventId, start, end, originalOccurrence } = placeholder;

  const adapter = store.state.adapter;

  const additionalChanges = addPropertiesToDroppedEvent?.() ?? {};

  // Only the bounds the drop moved, as displayed. An untouched bound keeps its stored value:
  // re-read from its display value it can be another day in the event's timezone (an all-day
  // occurrence is displayed on whole display days), which a recurring update would take for
  // a day move and realign the rule on. A drop that toggles all-day resends both: the stored
  // bounds belong to the other representation (the displayed start of an all-day occurrence
  // can equal the drop start while the stored one is later).
  const allDayToggled =
    additionalChanges.allDay != null &&
    additionalChanges.allDay !== (originalOccurrence.allDay ?? false);
  const changes: SchedulerEventUpdatedProperties = { id: eventId };
  if (allDayToggled || !adapter.isEqual(originalOccurrence.displayTimezone.start.value, start)) {
    changes.start = start;
  }
  if (allDayToggled || !adapter.isEqual(originalOccurrence.displayTimezone.end.value, end)) {
    changes.end = end;
  }

  // If `undefined`, we want to set the event resource to `undefined` (no resource).
  // If `null`, we want to keep the original event resource.
  if (placeholder.resourceId !== null) {
    const destinationResourceId = placeholder.resourceId;
    const originalResource = originalOccurrence.resource;

    if (!Array.isArray(originalResource)) {
      changes.resource = destinationResourceId;
    } else if (
      placeholder.sourceResourceId != null &&
      placeholder.sourceResourceId !== destinationResourceId
    ) {
      // Multi-resource event: replace only the row it was dragged from, keep the rest
      // (never collapse the array down to the single destination resource). Deduped
      // in case the destination row already held the event (e.g. [A, B] dragged from
      // A onto B must become [B], not [B, B]).
      changes.resource = Array.from(
        new Set(
          originalResource.map((id) =>
            id === placeholder.sourceResourceId ? destinationResourceId : id,
          ),
        ),
      );
    }
  }

  Object.assign(changes, additionalChanges);

  const hasChanged = Object.entries(changes).some(([key, value]) => {
    if (key === 'id') {
      return false;
    }
    if (key === 'start' || key === 'end') {
      return true;
    }
    return originalOccurrence[key as keyof typeof originalOccurrence] !== value;
  });

  if (!hasChanged) {
    return;
  }

  if (originalOccurrence.dataTimezone.rrule) {
    store.updateRecurringEvent({
      occurrenceStart: originalOccurrence.dataTimezone.start.value,
      changes,
    });
    // Editing surface is refreshed (or disarmed) in `selectRecurringEventScope` once the user
    // confirms a scope.
    return;
  }

  const result = store.updateEvent(changes);
  if (!result.applied) {
    // The drop has no other surface for the rejection.
    store.pushError(result.rejection, { transient: true });
    return;
  }

  // Sync the editing surface (if this occurrence is being edited) with the committed times:
  // the scheduling plugin can clamp the drop, and its dates come in the data timezone.
  // Only the committed bounds: an untouched one keeps its stored value on the occurrence.
  if (schedulerOtherSelectors.isEditedOccurrence(store.state, placeholder.occurrenceKey)) {
    const { displayTimezone } = store.state;
    const toDisplayTimezone = (date: TemporalSupportedObject | undefined) =>
      date == null ? undefined : adapter.setTimezone(date, displayTimezone);
    store.setEditingOccurrenceTimes({
      start: toDisplayTimezone(result.changes.start),
      end: toDisplayTimezone(result.changes.end),
    });
  }
}

function applyExternalDragOccurrencePlaceholder(
  store: SchedulerStoreInContext<any, any>,
  placeholder: SchedulerOccurrencePlaceholderExternalDrag,
  addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>,
) {
  const event = {
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
