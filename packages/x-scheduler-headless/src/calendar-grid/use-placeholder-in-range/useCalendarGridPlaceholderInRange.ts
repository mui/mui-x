import * as React from 'react';
import { useStore } from '@base-ui/utils/store/useStore';
import {
  SchedulerEventOccurrencePlaceholder,
  SchedulerProcessedDate,
  TemporalSupportedObject,
} from '../../models';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarOccurrencePositionSelectors,
} from '../../event-calendar-selectors';
import { processDate } from '../../process-date';
import { useAdapterContext } from '../../use-adapter-context';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';

export interface CalendarGridRangePlaceholder {
  /**
   * The bare placeholder occurrence (no positional metadata).
   */
  occurrence: SchedulerEventOccurrencePlaceholder;
  /**
   * 1-based first lane (CSS column) the placeholder occupies in its day's time column.
   */
  firstLane: number;
  /**
   * 1-based last lane the placeholder occupies (>= firstLane).
   */
  lastLane: number;
}

/**
 * Computes the placeholder occurrence (creation, drag, resize) to render in a time-grid
 * day column.
 */
export function useCalendarGridPlaceholderInRange(
  parameters: useCalendarGridPlaceholderInRange.Parameters,
): CalendarGridRangePlaceholder | null {
  const { day, start, end } = parameters;

  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange,
    start,
    end,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);
  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.timeGridLayoutForDay,
    day.key,
  );

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const startProcessed = processDate(rawPlaceholder.start, adapter);
    const endProcessed = processDate(rawPlaceholder.end, adapter);
    const timezone = adapter.getTimezone(rawPlaceholder.start);
    const sharedOccurrence: SchedulerEventOccurrencePlaceholder = {
      key: 'occurrence-placeholder',
      id: originalEventId ?? 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
      displayTimezone: {
        start: startProcessed,
        end: endProcessed,
        timezone,
      },
    };

    // Spans the full available width when no per-occurrence position is known. This is
    // the right preview for: creation (no occurrence yet), external-drag (occurrence
    // belongs to another calendar), and internal drag/resize when the column being
    // previewed is not the column the occurrence currently lives in.
    const fullWidthLastLane = Math.max(dayLayout?.maxLane ?? 1, 1);

    if (rawPlaceholder.type === 'creation') {
      return {
        occurrence: { ...sharedOccurrence, title: '' },
        firstLane: 1,
        lastLane: fullWidthLastLane,
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        occurrence: { ...sharedOccurrence, title: rawPlaceholder.eventData.title ?? '' },
        firstLane: 1,
        lastLane: fullWidthLastLane,
      };
    }

    const position = dayLayout?.positionByKey.get(rawPlaceholder.occurrenceKey);
    return {
      occurrence: sharedOccurrence,
      firstLane: position?.firstLane ?? 1,
      lastLane: position?.lastLane ?? fullWidthLastLane,
    };
  }, [rawPlaceholder, adapter, originalEvent, originalEventId, dayLayout]);
}

export namespace useCalendarGridPlaceholderInRange {
  export interface Parameters {
    /**
     * The day this column corresponds to. Used to look up the time-grid layout.
     */
    day: SchedulerProcessedDate;
    /**
     * The visible time range of the column.
     */
    start: TemporalSupportedObject;
    /**
     * The visible time range of the column.
     */
    end: TemporalSupportedObject;
  }
}
