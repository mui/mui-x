import * as React from 'react';
import { useStore } from '@base-ui/utils/store/useStore';
import { SchedulerEventOccurrencePlaceholder, SchedulerProcessedDate } from '../../models';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import { useAdapterContext } from '../../use-adapter-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarOccurrencePositionSelectors,
} from '../../event-calendar-selectors';
import { processDate } from '../../process-date';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';

export interface CalendarGridDayPlaceholder {
  /**
   * The bare placeholder occurrence (no positional metadata).
   */
  occurrence: SchedulerEventOccurrencePlaceholder;
  /**
   * 1-based lane (CSS row inside the day cell) the placeholder should render in.
   */
  firstLane: number;
  /**
   * Number of consecutive day cells the placeholder spans.
   */
  cellSpan: number;
}

/**
 * Computes the placeholder occurrence (creation, drag, resize) to render in a day cell,
 * and the lane / cell-span it should occupy.
 */
export function useCalendarGridPlaceholderInDay(
  day: SchedulerProcessedDate,
  maxEvents?: number,
): CalendarGridDayPlaceholder | null {
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell,
    day.value,
    rowStart,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);
  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.dayGridLayoutForDay,
    day.key,
  );

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const sharedProperties = {
      key: 'occurrence-placeholder',
      id: originalEventId ?? 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
    };

    // Creation mode
    if (rawPlaceholder.type === 'creation') {
      const startProcessed = processDate(day.value, adapter);
      const endProcessed = processDate(
        adapter.isAfter(rawPlaceholder.end, rowEnd) ? rowEnd : rawPlaceholder.end,
        adapter,
      );
      const timezone = adapter.getTimezone(day.value);
      return {
        occurrence: {
          ...sharedProperties,
          title: '',
          allDay: true,
          displayTimezone: {
            start: startProcessed,
            end: endProcessed,
            timezone,
          },
        },
        firstLane: 1,
        cellSpan: adapter.differenceInDays(rawPlaceholder.end, day.value) + 1,
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      const startProcessed = processDate(rawPlaceholder.start, adapter);
      const endProcessed = processDate(rawPlaceholder.end, adapter);
      const timezone = adapter.getTimezone(rawPlaceholder.start);

      return {
        occurrence: {
          ...sharedProperties,
          title: rawPlaceholder.eventData.title ?? '',
          displayTimezone: {
            start: startProcessed,
            end: endProcessed,
            timezone,
          },
        },
        firstLane: 1,
        cellSpan: adapter.differenceInDays(rawPlaceholder.end, day.value) + 1,
      };
    }

    // Internal drag/resize: drop the placeholder if the source event was deleted mid-drag.
    if (!originalEvent) {
      return null;
    }

    // The dragged occurrence's own lane is excluded so the placeholder renders on top of it.
    let lane = 1;
    if (dayLayout) {
      const used = dayLayout.usedLanes;
      const draggedLane = dayLayout.positionByKey.get(rawPlaceholder.occurrenceKey)?.firstLane;
      while (used.has(lane) && lane !== draggedLane) {
        lane += 1;
      }
    }

    if (maxEvents != null && lane > maxEvents) {
      lane = maxEvents;
    }

    return {
      occurrence: {
        ...sharedProperties,
        displayTimezone: { ...originalEvent.displayTimezone },
      },
      firstLane: lane,
      cellSpan: adapter.differenceInDays(rawPlaceholder.end, day.value) + 1,
    };
  }, [adapter, day, dayLayout, maxEvents, originalEvent, originalEventId, rawPlaceholder, rowEnd]);
}
