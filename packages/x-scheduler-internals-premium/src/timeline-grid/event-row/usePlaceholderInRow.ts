import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from '@mui/x-scheduler-internals/internals';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '../../event-timeline-premium-selectors';
import { isRangeVisibleOnTimelineAxis } from '../../internals/utils/timeline-axis';

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
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    // A placeholder fully inside the hidden hours (e.g. while editing the dates in the
    // event dialog) would render as a zero-width sliver pinned to the day seam.
    if (
      !isRangeVisibleOnTimelineAxis(adapter, presetConfig, rawPlaceholder.start, rawPlaceholder.end)
    ) {
      return null;
    }
    const startProcessed = processDate(rawPlaceholder.start, adapter);
    const endProcessed = processDate(rawPlaceholder.end, adapter);
    const timezone = adapter.getTimezone(rawPlaceholder.start);
    const sharedProperties = {
      id: originalEventId ?? 'occurrence-placeholder',
      key: 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
      resource: rawPlaceholder.resourceId ?? originalEvent?.resource,
      displayTimezone: {
        start: startProcessed,
        end: endProcessed,
        timezone,
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
    presetConfig,
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
