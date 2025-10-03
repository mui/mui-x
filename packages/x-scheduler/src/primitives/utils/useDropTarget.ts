'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CalendarOccurrencePlaceholder, EventSurfaceType, SchedulerValidDate } from '../models';
import { EventDropData, EventDropDataLookup } from './drag-utils';
import { useSchedulerStoreContext } from './useSchedulerStoreContext';
import { selectors } from './SchedulerStore';

export function useDropTarget<Targets extends keyof EventDropDataLookup>(
  parameters: useDropTarget.Parameters<Targets>,
) {
  const { surfaceType, ref, getEventDropData, isValidDropTarget } = parameters;
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
        originalStart: data.start,
      };
    };

    return dropTargetForElements({
      element: ref.current,
      canDrop: (arg) => isValidDropTarget(arg.source.data),
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
          store.applyInternalDragOrResizeOccurrencePlaceholder(placeholder);
        } else if (placeholder?.type === 'external-drag') {
          store.applyExternalDragOccurrencePlaceholder(placeholder);
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
  }, [ref, surfaceType, getEventDropData, isValidDropTarget, store]);
}

export namespace useDropTarget {
  export interface Parameters<Targets extends keyof EventDropDataLookup> {
    surfaceType: EventSurfaceType;
    ref: React.RefObject<HTMLDivElement | null>;
    isValidDropTarget: (data: any) => data is EventDropDataLookup[Targets];
    getEventDropData: GetEventDropData;
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
