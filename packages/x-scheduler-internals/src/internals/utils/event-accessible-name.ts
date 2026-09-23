import type { SchedulerRenderableEventOccurrence, TemporalSupportedObject } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { formatHourAndMinutes, formatWeekDayDayOfMonthAndMonth } from './date-utils';

export interface SchedulerEventAccessibleNameLocaleText {
  /**
   * Time range of a timed event that starts and ends on the same day.
   * @example "7:30 AM to 8:30 AM"
   */
  eventAccessibleNameTimeRange: (start: string, end: string) => string;
  /**
   * Date range of an event that spans several days.
   * @example "From Monday 26 May to Wednesday 28 May"
   */
  eventAccessibleNameDateRange: (start: string, end: string) => string;
  /**
   * Announced instead of the time range for an all-day event.
   */
  eventAccessibleNameAllDay: string;
  /**
   * Appended to the name of a recurring event.
   */
  eventAccessibleNameRecurring: string;
  /**
   * Resource the event belongs to.
   * @example "Resource: Sport"
   */
  resourceAriaLabel: (resourceName: string) => string;
}

export const DEFAULT_EVENT_ACCESSIBLE_NAME_LOCALE_TEXT: SchedulerEventAccessibleNameLocaleText = {
  eventAccessibleNameTimeRange: (start, end) => `${start} to ${end}`,
  eventAccessibleNameDateRange: (start, end) => `From ${start} to ${end}`,
  eventAccessibleNameAllDay: 'All day',
  eventAccessibleNameRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Resource: ${resourceName}`,
};

export interface GetEventAccessibleNameParameters {
  occurrence: SchedulerRenderableEventOccurrence;
  adapter: Adapter;
  ampm: boolean;
  localeText: SchedulerEventAccessibleNameLocaleText;
  isRecurring: boolean;
  /**
   * Name of the resource to announce. Leave it out where the surrounding row already carries it.
   */
  resourceName?: string | null;
}

/**
 * Builds the accessible name of an event: title, then when it happens, then the resource and
 * whether it recurs.
 * @example "Running, 7:30 AM to 8:30 AM, Thursday 3 July, Resource: Sport, Recurring"
 */
export function getEventAccessibleName(parameters: GetEventAccessibleNameParameters): string {
  const { occurrence, adapter, ampm, localeText, isRecurring, resourceName } = parameters;
  const start = occurrence.displayTimezone.start.value;
  const end = occurrence.displayTimezone.end.value;
  const isMultiDay = !adapter.isSameDay(start, end);

  const formatDate = (date: TemporalSupportedObject) =>
    formatWeekDayDayOfMonthAndMonth(date, adapter);
  const formatDateTime = (date: TemporalSupportedObject) =>
    `${formatDate(date)} ${formatHourAndMinutes(date, adapter, ampm)}`;

  const parts: string[] = [occurrence.title];

  if (occurrence.allDay) {
    parts.push(localeText.eventAccessibleNameAllDay);
    parts.push(
      isMultiDay
        ? localeText.eventAccessibleNameDateRange(formatDate(start), formatDate(end))
        : formatDate(start),
    );
  } else if (isMultiDay) {
    parts.push(localeText.eventAccessibleNameDateRange(formatDateTime(start), formatDateTime(end)));
  } else {
    parts.push(
      localeText.eventAccessibleNameTimeRange(
        formatHourAndMinutes(start, adapter, ampm),
        formatHourAndMinutes(end, adapter, ampm),
      ),
    );
    parts.push(formatDate(start));
  }

  if (resourceName) {
    parts.push(localeText.resourceAriaLabel(resourceName));
  }

  if (isRecurring) {
    parts.push(localeText.eventAccessibleNameRecurring);
  }

  return parts.join(', ');
}
