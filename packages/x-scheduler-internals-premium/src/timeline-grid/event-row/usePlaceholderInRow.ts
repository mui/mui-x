import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  computeElementPositionInCollection,
  createProcessedDate,
  isInternalDragOrResizePlaceholder,
} from '@mui/x-scheduler-internals/internals';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '../../event-timeline-premium-selectors';

export function usePlaceholderInRow(
  parameters: usePlaceholderInRow.Parameters,
): usePlaceholderInRow.ReturnValue {
  const { occurrences, maxIndex, resourceId } = parameters;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const rawPlaceholder = useStore(
    store,
    timelineOccurrencePlaceholderSelectors.placeholderInResource,
    resourceId,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const startProcessed = createProcessedDate(adapter, rawPlaceholder.start, displayTimezone);
    const endProcessed = createProcessedDate(adapter, rawPlaceholder.end, displayTimezone);

    // A placeholder that occupies no space (fully inside the hidden hours while editing
    // the dates in the event dialog, or shorter than the minute the axis is drawn with)
    // would render as a zero-width sliver pinned to the day seam. Measured on the
    // rendered geometry, like the occurrence selector does.
    const renderedPosition = computeElementPositionInCollection({
      start: startProcessed,
      end: endProcessed,
      collection: config.axis,
      durationMs: config.durationMs,
    });
    if (renderedPosition.duration === 0) {
      return null;
    }
    const sharedProperties = {
      id: originalEventId ?? 'occurrence-placeholder',
      key: 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
      resource: rawPlaceholder.resourceId ?? originalEvent?.resource,
      displayTimezone: {
        start: startProcessed,
        end: endProcessed,
        timezone: displayTimezone,
      },
    };

    if (rawPlaceholder.type === 'creation') {
      return {
        ...sharedProperties,
        position: {
          firstIndex: 1,
          lastIndex: maxIndex,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        ...sharedProperties,
        title: rawPlaceholder.eventData.title ?? '',
        position: {
          firstIndex: 1,
          lastIndex: maxIndex,
        },
      };
    }

    const position = occurrences.find(
      (occurrence) => occurrence.key === rawPlaceholder.occurrenceKey,
    )?.position ?? {
      firstIndex: 1,
      lastIndex: maxIndex,
    };

    return {
      ...sharedProperties,
      position,
    };
  }, [
    rawPlaceholder,
    adapter,
    config,
    displayTimezone,
    originalEvent,
    originalEventId,
    occurrences,
    maxIndex,
  ]);
}

export namespace usePlaceholderInRow {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    /**
     * The resource id of the row in which to render the placeholder.
     */
    resourceId: string | null;
  }

  export type ReturnValue =
    useEventOccurrencesWithTimelinePosition.EventOccurrencePlaceholderWithPosition | null;
}
