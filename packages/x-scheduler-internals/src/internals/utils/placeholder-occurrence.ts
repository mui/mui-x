import type {
  SchedulerEventOccurrencePlaceholder,
  SchedulerOccurrencePlaceholder,
  SchedulerProcessedEvent,
} from '../../models';
import { isInternalDragOrResizePlaceholder } from './drag-utils';
import { createProcessedDate, normalizeAllDayBounds } from './plain-date-utils/date';

const PLACEHOLDER_KEY = 'occurrence-placeholder';

/**
 * The occurrence a placeholder renders, with its dates read in `displayTimezone`.
 * `originalEvent` is the event a drag or a resize moves, when the store has it.
 *
 * The surface of the placeholder sets its all-day flag and its bounds:
 * - in the day grid, a creation is all-day, and an all-day placeholder spans whole days;
 * - in the time grid, the placeholder keeps its bounds and has no all-day flag;
 * - in the timeline, a creation isn't all-day, an all-day placeholder spans whole days, and the
 *   placeholder carries the resource it's dropped onto.
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
    unstable_internalInfos: { displayTimezone },
  };

  if (placeholder.surfaceType === 'time-grid') {
    return {
      ...properties,
      start: createProcessedDate(placeholder.start, displayTimezone),
      end: createProcessedDate(placeholder.end, displayTimezone),
    };
  }

  const allDay =
    (placeholder.surfaceType === 'day-grid' && placeholder.type === 'creation') ||
    (isExternalDrag ? placeholder.eventData.allDay : originalEvent?.allDay);
  const bounds = normalizeAllDayBounds(placeholder.start, placeholder.end, allDay, displayTimezone);
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
