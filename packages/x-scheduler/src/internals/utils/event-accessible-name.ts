import type {
  SchedulerRenderableEventOccurrence,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerEventLocaleText } from '../../models/translations';
import { formatHourAndMinutes } from './date-utils';

export interface GetEventAccessibleNameParameters {
  occurrence: SchedulerRenderableEventOccurrence;
  adapter: Adapter;
  ampm: boolean;
  localeText: SchedulerEventLocaleText;
  isRecurring: boolean;
  /**
   * Name of the resource to announce, if any.
   */
  resourceName?: string | null;
}

/**
 * Builds the accessible name of an event from its title, when it happens, its resource, and
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
      formatHourAndMinutes(start, adapter, ampm),
      formatHourAndMinutes(end, adapter, ampm),
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
