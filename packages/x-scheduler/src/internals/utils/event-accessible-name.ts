import type {
  SchedulerProcessedDate,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { formatFullDate, formatTime, toPlainDate } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventLocaleText } from '../../models/translations';
import { isOccurrenceMultiDay } from './event-utils';

export interface GetEventAccessibleNameParameters {
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The locale the dates are formatted in.
   */
  locale: string;
  ampm: boolean;
  localeText: SchedulerEventLocaleText;
  isRecurring: boolean;
  /**
   * Name of the resource to announce, or `null` to announce none.
   */
  resourceName: string | null;
}

/**
 * Builds the accessible name of an event from its title, when it happens, its resource, and
 * whether it recurs.
 * @example "Running, 7:30 AM to 8:30 AM, Monday, May 26, 2025, Resource: Sport, Recurring"
 */
export function getEventAccessibleName(parameters: GetEventAccessibleNameParameters): string {
  const { occurrence, locale, ampm, localeText, isRecurring, resourceName } = parameters;
  const { start, end, timezone } = occurrence.displayTimezone;
  const isMultiDay = isOccurrenceMultiDay(occurrence);

  const formatDate = (date: SchedulerProcessedDate) =>
    formatFullDate(locale, toPlainDate(date.timestamp, timezone));
  const formatDateTime = (date: SchedulerProcessedDate) =>
    `${formatDate(date)} ${formatTime(locale, date.minutesInDay, ampm)}`;

  // A multi-day timed event carries its times inside the date range, since they belong to
  // different days, so it has no separate `when`.
  const when = (() => {
    if (occurrence.allDay) {
      return localeText.eventAriaLabelAllDay;
    }
    if (isMultiDay) {
      return undefined;
    }
    return localeText.eventAriaLabelTimeRange(
      formatTime(locale, start.minutesInDay, ampm),
      formatTime(locale, end.minutesInDay, ampm),
    );
  })();

  const formatBound = occurrence.allDay ? formatDate : formatDateTime;
  const date = isMultiDay
    ? localeText.eventAriaLabelDateRange(formatBound(start), formatBound(end))
    : formatDate(start);

  return localeText.eventAriaLabel({
    title: occurrence.title,
    when,
    date,
    resource: resourceName ? localeText.resourceAriaLabel(resourceName) : undefined,
    recurring: isRecurring ? localeText.eventAriaLabelRecurring : undefined,
  });
}
