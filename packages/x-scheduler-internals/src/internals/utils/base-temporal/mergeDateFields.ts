import type { PlainDate, PlainDateFields, PlainDateWithFields } from './PlainDate';
import { getCalendar } from './calendar';
import { readWithFields } from './iso';

const DATE_FIELDS = ['year', 'era', 'eraYear', 'month', 'monthCode', 'day'] as const;
const DATE_FIELDS_WITHOUT_ERAS = ['year', 'month', 'monthCode', 'day'] as const;

/**
 * Sets the fields `with()` receives on the fields of a date, following Temporal: a year, an era or
 * a year of era replaces all three, and a month or a month code replaces both. A year keeps the
 * month code rather than the position of the month, which can change with the year, such as after
 * a Hebrew leap month. A calendar without eras ignores their fields.
 * Throws like `readWithFields()`, where `otherFields` are the other fields of the value.
 */
export function mergeDateFields(
  base: PlainDate,
  fields: PlainDateWithFields,
  apiName: string,
  otherFields: readonly string[] = [],
): PlainDateFields {
  const calendar = getCalendar(base.calendarId);
  const partial = readWithFields(fields, apiName, [
    ...(calendar.getYearFromEra == null ? DATE_FIELDS_WITHOUT_ERAS : DATE_FIELDS),
    ...otherFields,
  ]);
  const replacesYear =
    partial.year !== undefined || partial.era !== undefined || partial.eraYear !== undefined;
  const replacesMonth = partial.month !== undefined || partial.monthCode !== undefined;
  // Read once: a date in the ISO calendar computes each field when it's read.
  const calendarDate = base.calendarDate ?? calendar.getDate(base.dayNumber);
  return {
    calendar: base.calendarId,
    era: replacesYear ? partial.era : calendarDate.era,
    eraYear: replacesYear ? partial.eraYear : calendarDate.eraYear,
    year: replacesYear ? partial.year : calendarDate.year,
    month: replacesYear || replacesMonth ? partial.month : calendarDate.month,
    monthCode: replacesMonth ? partial.monthCode : calendarDate.monthCode,
    day: partial.day === undefined ? calendarDate.day : partial.day,
  };
}
