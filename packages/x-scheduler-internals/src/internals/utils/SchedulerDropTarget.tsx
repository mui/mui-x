'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import type { DragSource, DropTargetRecord } from '@base-ui/react/draggable';
import {
  schedulerExternalEventKind,
  schedulerEventResizeKinds,
  schedulerDropTargetKind,
} from './schedulerDrag';
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
import type { EventDropData, schedulerEventDragKinds } from './schedulerDrag';
import type { SchedulerStoreInContext } from '../../use-scheduler-store-context';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '../../scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import type { StandaloneEvent } from '../../standalone-event';
import { useAdapterContext } from '../../use-adapter-context';
import { getPrimaryResourceId } from './event-utils';

// Not every drag source exposes `sourceResourceId` (only rows that know which
// resource they represent, e.g. the Event Timeline Premium, can report it) —
// it's declared as optional on each drag data contract, so this normalizes
// `undefined` to `null` rather than narrowing anything.
function getSourceResourceId(
  data: Exclude<EventDropData, StandaloneEvent.DragData>,
): SchedulerResourceId | null {
  return data.sourceResourceId ?? null;
}

export function SchedulerDropTarget(props: SchedulerDropTarget.Props) {
  const {
    surfaceType,
    resourceId = null,
    getEventDropData,
    accept,
    addPropertiesToDroppedEvent,
    render,
  } = props;

  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();

  const getDataFromInside =
    (type: 'internal-drag' | 'internal-resize'): SchedulerDropTarget.GetDataFromInside =>
    (data, newStart, newEnd) => {
      return {
        type,
        surfaceType,
        start: newStart,
        end: newEnd,
        eventId: data.eventId,
        occurrenceKey: data.occurrenceKey,
        originalOccurrence: data.originalOccurrence,
        sourceResourceId: getSourceResourceId(data),
        resourceId:
          resourceId === undefined
            ? (getPrimaryResourceId(data.originalOccurrence.resource) ?? null)
            : resourceId,
      };
    };

  const getDataFromOutside: SchedulerDropTarget.GetDataFromOutside = (data, start) => {
    const eventCreationConfig = schedulerEventSelectors.creationConfig(store.state);
    if (eventCreationConfig === false) {
      return undefined;
    }

    return {
      type: 'external-drag',
      surfaceType,
      start,
      // TODO: Improve the start and end time of a non all-day event dropped in the Month View.
      end: adapter.addMinutes(start, data.eventData.duration ?? eventCreationConfig.duration),
      eventData: data.eventData,
      onEventDrop: data.onEventDrop,
      resourceId:
        resourceId === undefined
          ? (getPrimaryResourceId(data.eventData.resource) ?? null)
          : resourceId,
    };
  };

  const getDropData = (
    source: DragSource<
      Draggable.AcceptedDragPayload<typeof schedulerEventDragKinds>,
      Draggable.AcceptedDragData<typeof schedulerEventDragKinds>
    >,
    target: DropTargetRecord,
  ) => {
    const data = schedulerExternalEventKind.matches(source) ? source.payload : source.dragData;
    if (!data) {
      return undefined;
    }
    const type = schedulerEventResizeKinds.some((kind) => kind.matches(source))
      ? 'internal-resize'
      : 'internal-drag';
    return getEventDropData({
      source,
      target,
      getDataFromInside: getDataFromInside(type),
      getDataFromOutside,
    });
  };

  return (
    <Draggable.Target
      accept={accept}
      kind={schedulerDropTargetKind}
      payload={{ surfaceType }}
      render={render}
      canDrop={({ source }) => {
        if (
          schedulerExternalEventKind.matches(source) &&
          !schedulerEventSelectors.canDragEventsFromTheOutside(store.state)
        ) {
          return false;
        }

        return true;
      }}
      onDraggableMove={({ source, target }) => {
        const newPlaceholder = getDropData(source, target);
        if (newPlaceholder) {
          store.setOccurrencePlaceholder(newPlaceholder);
        }
      }}
      onDraggableDrop={({ source, target }) => {
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
    accept: typeof schedulerEventDragKinds;
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

  export type GetDataFromInside = (
    data: Exclude<EventDropData, StandaloneEvent.DragData>,
    newStart: TemporalSupportedObject,
    newEnd: TemporalSupportedObject,
  ) => SchedulerOccurrencePlaceholderInternalDragOrResize;

  export type GetDataFromOutside = (
    data: StandaloneEvent.DragData,
    start: TemporalSupportedObject,
  ) => SchedulerOccurrencePlaceholderExternalDrag | undefined;

  export type GetEventDropData = (parameters: {
    source: DragSource<
      Draggable.AcceptedDragPayload<typeof schedulerEventDragKinds>,
      Draggable.AcceptedDragData<typeof schedulerEventDragKinds>
    >;
    target: DropTargetRecord;
    getDataFromInside: GetDataFromInside;
    getDataFromOutside: GetDataFromOutside;
  }) => SchedulerOccurrencePlaceholder | undefined;
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
