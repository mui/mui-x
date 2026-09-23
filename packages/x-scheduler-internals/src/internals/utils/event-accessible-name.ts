import type { SchedulerRenderableEventOccurrence, TemporalSupportedObject } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { formatHourAndMinutes } from './date-utils';

export interface SchedulerEventAriaLabelParts {
  title: string;
  /**
   * Time range, all-day sentence, or date-time range of a multi-day event.
   */
  when: string;
  /**
   * The day of the event. Not set when `when` already spans several dates.
   */
  date?: string;
  resource?: string;
  recurring?: string;
}

export interface SchedulerEventAccessibleNameLocaleText {
  /**
   * Time range of a timed event that starts and ends on the same day.
   * @example "7:30 AM to 8:30 AM"
   */
  eventAriaLabelTimeRange: (start: string, end: string) => string;
  /**
   * Range of an event that spans several days.
   * @example "From Monday, May 26th, 2025 to Wednesday, May 28th, 2025"
   */
  eventAriaLabelDateRange: (start: string, end: string) => string;
  /**
   * Announced instead of the time range for an all-day event.
   */
  eventAriaLabelAllDay: string;
  /**
   * Appended to the name of a recurring event.
   */
  eventAriaLabelRecurring: string;
  /**
   * Resource the event belongs to.
   * @example "Resource: Sport"
   */
  resourceAriaLabel: (resourceName: string) => string;
  /**
   * Composes the parts into the event name. Locales can reorder them or change the separator.
   * @example "Running, 7:30 AM to 8:30 AM, Monday, May 26th, 2025, Resource: Sport, Recurring"
   */
  eventAriaLabel: (parts: SchedulerEventAriaLabelParts) => string;
}

// Mirrors `enUSEvent` in `@mui/x-scheduler/locales`, which the l10n script needs as a literal.
export const DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT: SchedulerEventAccessibleNameLocaleText = {
  eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  eventAriaLabelAllDay: 'All day',
  eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Resource: ${resourceName}`,
  eventAriaLabel: ({ title, when, date, resource, recurring }) =>
    [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

export interface GetEventAccessibleNameParameters {
  occurrence: SchedulerRenderableEventOccurrence;
  adapter: Adapter;
  ampm: boolean;
  localeText: SchedulerEventAccessibleNameLocaleText;
  isRecurring: boolean;
  /**
   * Name of the resource to announce, if any.
   */
  resourceName?: string | null;
}

/**
 * Builds the accessible name of an event from its title, when it happens, its resource and
 * whether it recurs.
 * @example "Running, 7:30 AM to 8:30 AM, Monday, May 26th, 2025, Resource: Sport, Recurring"
 */
export function getEventAccessibleName(parameters: GetEventAccessibleNameParameters): string {
  const { occurrence, adapter, ampm, localeText, isRecurring, resourceName } = parameters;
  const start = occurrence.displayTimezone.start.value;
  const end = occurrence.displayTimezone.end.value;
  const isMultiDay = !adapter.isSameDay(start, end);

  const formatDate = (date: TemporalSupportedObject) =>
    adapter.format(date, 'localizedDateWithFullMonthAndWeekDay');
  const formatDateTime = (date: TemporalSupportedObject) =>
    `${formatDate(date)} ${formatHourAndMinutes(date, adapter, ampm)}`;

  let when: string;
  let date: string | undefined;
  if (occurrence.allDay) {
    when = localeText.eventAriaLabelAllDay;
    date = isMultiDay
      ? localeText.eventAriaLabelDateRange(formatDate(start), formatDate(end))
      : formatDate(start);
  } else if (isMultiDay) {
    when = localeText.eventAriaLabelDateRange(formatDateTime(start), formatDateTime(end));
  } else {
    when = localeText.eventAriaLabelTimeRange(
      formatHourAndMinutes(start, adapter, ampm),
      formatHourAndMinutes(end, adapter, ampm),
    );
    date = formatDate(start);
  }

  return localeText.eventAriaLabel({
    title: occurrence.title,
    when,
    date,
    resource: resourceName ? localeText.resourceAriaLabel(resourceName) : undefined,
    recurring: isRecurring ? localeText.eventAriaLabelRecurring : undefined,
  });
}
