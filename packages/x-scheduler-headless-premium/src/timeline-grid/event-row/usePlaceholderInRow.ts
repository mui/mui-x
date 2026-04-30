import * as React from 'react';
import { useStore } from '@base-ui/utils/store/useStore';
import {
  OccurrenceLanePosition,
  SchedulerEventOccurrencePlaceholder,
  SchedulerResourceId,
} from '@mui/x-scheduler-headless/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from '@mui/x-scheduler-headless/internals';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  eventTimelineOccurrencePositionSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '../../event-timeline-premium-selectors';

export interface TimelineRowPlaceholder {
  /**
   * The bare placeholder occurrence (no positional metadata).
   */
  occurrence: SchedulerEventOccurrencePlaceholder;
  /**
   * 1-based first lane the placeholder occupies in the row.
   */
  firstLane: number;
  /**
   * 1-based last lane the placeholder occupies (>= firstLane).
   */
  lastLane: number;
}

/**
 * Computes the placeholder occurrence (creation, drag, resize) to render in a timeline
 * resource row.
 */
export function usePlaceholderInRow(
  resourceId: SchedulerResourceId | null,
): TimelineRowPlaceholder | null {
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
  const positionForKey: OccurrenceLanePosition | null = useStore(
    store,
    eventTimelineOccurrencePositionSelectors.positionByKey,
    rawPlaceholder && 'occurrenceKey' in rawPlaceholder ? rawPlaceholder.occurrenceKey : null,
  );
  const maxLane = useStore(
    store,
    eventTimelineOccurrencePositionSelectors.maxLaneForResource,
    resourceId,
  );

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }
    const startProcessed = processDate(rawPlaceholder.start, adapter);
    const endProcessed = processDate(rawPlaceholder.end, adapter);
    const timezone = adapter.getTimezone(rawPlaceholder.start);
    const sharedOccurrence: SchedulerEventOccurrencePlaceholder = {
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

    if (rawPlaceholder.type === 'creation' || rawPlaceholder.type === 'external-drag') {
      const occurrence: SchedulerEventOccurrencePlaceholder =
        rawPlaceholder.type === 'external-drag'
          ? { ...sharedOccurrence, title: rawPlaceholder.eventData.title ?? '' }
          : sharedOccurrence;
      return { occurrence, firstLane: 1, lastLane: maxLane };
    }

    return {
      occurrence: sharedOccurrence,
      firstLane: positionForKey?.firstLane ?? 1,
      lastLane: positionForKey?.lastLane ?? maxLane,
    };
  }, [rawPlaceholder, adapter, originalEvent, originalEventId, positionForKey, maxLane]);
}
