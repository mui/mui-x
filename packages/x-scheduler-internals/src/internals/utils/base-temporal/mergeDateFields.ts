import type { PlainDate, PlainDateFields } from './PlainDate';

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
  return {
    calendar: base.calendarId,
    era: replacesYear ? fields.era : base.era,
    eraYear: replacesYear ? fields.eraYear : base.eraYear,
    year: replacesYear ? fields.year : base.year,
    month: replacesYear || replacesMonth ? fields.month : base.month,
    monthCode: replacesMonth ? fields.monthCode : base.monthCode,
    day: fields.day === undefined ? base.day : fields.day,
  };
}
