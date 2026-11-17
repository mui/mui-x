import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  computeElementPositionInCollection,
  getPlaceholderOccurrence,
  isInternalDragOrResizePlaceholder,
} from '@mui/x-scheduler-internals/internals';
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

    const occurrence = getPlaceholderOccurrence(rawPlaceholder, originalEvent, displayTimezone);
    // A placeholder that occupies no space (fully inside the hidden hours while editing
    // the dates in the event dialog, or shorter than the minute the axis is drawn with)
    // would render as a zero-width sliver pinned to the day seam. Measured on the
    // rendered geometry, like the occurrence selector does.
    const renderedPosition = computeElementPositionInCollection({
      start: occurrence.start,
      end: occurrence.end,
      collection: config,
      durationMs: config.durationMs,
    });
    if (renderedPosition.duration === 0) {
      return null;
    }

    const position = (isInternalDragOrResizePlaceholder(rawPlaceholder)
      ? occurrences.find((item) => item.key === rawPlaceholder.occurrenceKey)?.position
      : undefined) ?? { firstIndex: 1, lastIndex: maxIndex };

    return { ...occurrence, position };
  }, [rawPlaceholder, config, displayTimezone, originalEvent, occurrences, maxIndex]);
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
