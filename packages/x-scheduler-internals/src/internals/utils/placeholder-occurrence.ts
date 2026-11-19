import type {
  SchedulerEventOccurrencePlaceholder,
  SchedulerOccurrencePlaceholder,
  SchedulerProcessedEvent,
} from '../../models';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { snapAllDayBounds } from './plain-date-utils/date';
import { toZonedDateTime } from './plain-date-utils/timeZone';

const PLACEHOLDER_KEY = 'occurrence-placeholder';

/**
 * The occurrence a placeholder renders, with its dates read in `displayTimezone`.
 * `originalEvent` is the event a drag or a resize moves, when the store has it.
 *
 * Only a creation in the day grid is snapped to whole days: the bounds of the other placeholders
 * are already computed for their destination, including the exclusive end of an all-day event.
 */
export function getPlaceholderOccurrence(
  placeholder: SchedulerOccurrencePlaceholder,
  originalEvent: SchedulerProcessedEvent | null | undefined,
  displayTimezone: string,
): SchedulerEventOccurrencePlaceholder {
  const isExternalDrag = placeholder.type === 'external-drag';
  const properties = {
    key: PLACEHOLDER_KEY,
    id: isInternalDragOrResizePlaceholder(placeholder) ? placeholder.eventId : PLACEHOLDER_KEY,
    title: isExternalDrag ? (placeholder.eventData.title ?? '') : (originalEvent?.title ?? ''),
  };

  if (placeholder.surfaceType === 'time-grid') {
    return {
      ...properties,
      start: toZonedDateTime(placeholder.start, displayTimezone),
      end: toZonedDateTime(placeholder.end, displayTimezone),
    };
  }

  const isDayGridCreation =
    placeholder.surfaceType === 'day-grid' && placeholder.type === 'creation';
  let allDay = originalEvent?.allDay;
  if (isDayGridCreation) {
    allDay = true;
  } else if (isExternalDrag) {
    allDay = placeholder.eventData.allDay;
  } else if (
    placeholder.surfaceType === 'day-grid' &&
    isInternalDragOrResizePlaceholder(placeholder)
  ) {
    allDay = placeholder.allDay;
  }
  const bounds = isDayGridCreation
    ? snapAllDayBounds(placeholder.start, placeholder.end, displayTimezone)
    : placeholder;
  return {
    ...properties,
    allDay,
    start: toZonedDateTime(bounds.start, displayTimezone),
    end: toZonedDateTime(bounds.end, displayTimezone),
    ...(placeholder.surfaceType === 'timeline'
      ? { resource: placeholder.resourceId ?? originalEvent?.resource }
      : {}),
  };
}

/**
 * The key of the occurrence a drag or a resize moves, whose position the placeholder takes.
 */
export function getPlaceholderOccurrenceKey(
  placeholder: SchedulerOccurrencePlaceholder,
): string | undefined {
  return isInternalDragOrResizePlaceholder(placeholder) ? placeholder.occurrenceKey : undefined;
}
