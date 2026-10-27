import type { PlainDate, PlainDateFields } from './PlainDate';
import { getCalendar } from './calendar';

/**
 * Sets date fields on the fields of a date, following Temporal: a year, an era or a year of era
 * replaces all three, and a month or a month code replaces both. A year keeps the month code
 * rather than the position of the month, which can change with the year, such as after a Hebrew
 * leap month.
 */
export function mergeDateFields(
  base: PlainDate,
  fields: Partial<PlainDateFields>,
): PlainDateFields {
  const replacesYear =
    fields.year !== undefined || fields.era !== undefined || fields.eraYear !== undefined;
  const replacesMonth = fields.month !== undefined || fields.monthCode !== undefined;
  // Read once: a date in the ISO calendar computes each field when it's read.
  const calendarDate = base.calendarDate ?? getCalendar(base.calendarId).getDate(base.dayNumber);
  return {
    calendar: base.calendarId,
    era: replacesYear ? fields.era : calendarDate.era,
    eraYear: replacesYear ? fields.eraYear : calendarDate.eraYear,
    year: replacesYear ? fields.year : calendarDate.year,
    month: replacesYear || replacesMonth ? fields.month : calendarDate.month,
    monthCode: replacesMonth ? fields.monthCode : calendarDate.monthCode,
    day: fields.day === undefined ? calendarDate.day : fields.day,
  };
}
