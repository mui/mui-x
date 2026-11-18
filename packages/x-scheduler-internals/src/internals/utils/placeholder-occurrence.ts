import type {
  SchedulerEventOccurrencePlaceholder,
  SchedulerOccurrencePlaceholder,
  SchedulerProcessedEvent,
} from '../../models';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { createProcessedDate, snapAllDayBounds } from './plain-date-utils/date';

const PLACEHOLDER_KEY = 'occurrence-placeholder';

/**
 * The occurrence a placeholder renders, with its dates read in `displayTimezone`.
 * `originalEvent` is the event a drag or a resize moves, when the store has it.
 *
 * The surface of the placeholder sets its all-day flag and its bounds:
 * - in the day grid, a creation spans whole days, and a drag uses its destination's all-day flag;
 * - in the time grid, the placeholder keeps its bounds and has no all-day flag;
 * - in the timeline, a creation isn't all-day, and a drag keeps the event's all-day flag and
 *   carries the resource it's dropped onto.
 * Drag and resize bounds are already computed for their destination, including exclusive all-day
 * ends, so they are kept as is.
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
      start: createProcessedDate(placeholder.start, displayTimezone),
      end: createProcessedDate(placeholder.end, displayTimezone),
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
    start: createProcessedDate(bounds.start, displayTimezone),
    end: createProcessedDate(bounds.end, displayTimezone),
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
