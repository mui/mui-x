import type {
  SchedulerProcessedDate,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';
import {
  formatFullDate,
  formatTime,
  getMinutesInDay,
  getOccurrenceLastDayNumber,
  plainDateFromDayNumber,
} from '@mui/x-scheduler-internals/internals';
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
  const { start, end } = occurrence;
  const isMultiDay = isOccurrenceMultiDay(occurrence);

  const formatDate = (date: BaseTemporal.PlainDate) => formatFullDate(locale, date);
  const formatDateTime = (date: SchedulerProcessedDate) =>
    `${formatDate(date.plainDateTime.toPlainDate())} ${formatTime(locale, getMinutesInDay(date.plainDateTime), ampm)}`;

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
      formatTime(locale, getMinutesInDay(start.plainDateTime), ampm),
      formatTime(locale, getMinutesInDay(end.plainDateTime), ampm),
    );
  })();

  let date: string;
  if (!isMultiDay) {
    date = formatDate(start.plainDateTime.toPlainDate());
  } else if (occurrence.allDay) {
    // The end of an all-day occurrence is the start of the day after its last day.
    date = localeText.eventAriaLabelDateRange(
      formatDate(start.plainDateTime.toPlainDate()),
      formatDate(plainDateFromDayNumber(getOccurrenceLastDayNumber(occurrence))),
    );
  } else {
    date = localeText.eventAriaLabelDateRange(formatDateTime(start), formatDateTime(end));
  }

  return localeText.eventAriaLabel({
    title: occurrence.title,
    when,
    date,
    resource: resourceName ? localeText.resourceAriaLabel(resourceName) : undefined,
    recurring: isRecurring ? localeText.eventAriaLabelRecurring : undefined,
  });
}
