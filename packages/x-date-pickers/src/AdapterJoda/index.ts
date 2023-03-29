/* eslint-disable class-methods-use-this */
import { Unit } from '@date-io/core/IUtils';
import AdapterJoda from '@date-io/js-joda';
import {
  ChronoUnit,
  LocalDate,
  LocalDateTime,
  Temporal,
  TemporalQueries,
  ZonedDateTime,
} from '@js-joda/core';
import { WeekFields } from '@js-joda/locale_en-us';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../internals/models';

type CalendarType = LocalDateTime | LocalDate | ZonedDateTime;

// See https://js-joda.github.io/js-joda/manual/formatting.html
// and https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: 'year',
  yy: 'year',
  yyyy: 'year',

  // Month
  M: 'month',
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: 'day',
  dd: 'day',

  // Day of the week
  u: 'weekDay',
  E: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',
  k: 'hours',
  kk: 'hours',

  // Minutes
  m: 'minutes',
  mm: 'minutes',

  // Seconds
  s: 'seconds',
  ss: 'seconds',
};

/**
 * Modifies @date-io's js-joda adapters to work with MUI-X's usage.  See
 * https://github.com/mui/mui-x/issues/4703
 */
export class MuiAdapterJoda extends AdapterJoda implements MuiPickersAdapter<Temporal> {
  constructor(...props: ConstructorParameters<typeof AdapterJoda>) {
    super(...props);
    this.overrideGetDiff();
  }

  // MUI properties and methods
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  expandFormat(format: string) {
    return format;
  }

  getWeekNumber(date: Temporal) {
    return date.get(WeekFields.ISO.weekOfYear());
  }

  // Overrides to @date-io methods to address limitations in its js-joda support
  // See https://github.com/mui/mui-x/issues/4703
  mergeDateAndTime(date: Temporal, time: Temporal): Temporal {
    const datePart = date.query(TemporalQueries.localDate());
    const timePart = time.query(TemporalQueries.localTime());
    if (datePart && timePart) {
      // This gives the same result as @date-io's implementation's
      // "LocalDate.from(date).atTime(LocalTime.from(time))"
      return datePart.atTime(timePart);
    }
    if (!datePart) {
      // E.g., if MUI-X's TimePicker wants to preserve the date part, but the
      // user just gave a LocalTime.
      return time;
    }
    if (!timePart) {
      // E.g., if MUI-X's CalendarPicker wants to preserve the time part, but
      // the user just gave a LocalDate:
      return date;
    }

    // Fall back to @date-io's implementation, which will throw due to null
    // date and time.
    return super.mergeDateAndTime(date, time);
  }

  private overrideGetDiff() {
    // Override getDiff to fix https://github.com/dmtrKovalenko/date-io/pull/634
    // getDiff is an arrow function (class property), so we have to do it this
    // way.
    const baseGetDiff = this.getDiff;
    this.getDiff = (value: CalendarType, comparing: CalendarType | string, unit?: Unit): number => {
      const compareTo = super.date(comparing);
      if (
        compareTo &&
        value instanceof LocalDate &&
        compareTo instanceof LocalDate &&
        unit !== 'quarters'
      ) {
        const chronoUnitName = (
          unit == null || unit === 'milliseconds' ? 'MILLIS' : unit.toUpperCase()
        ) as keyof typeof ChronoUnit;
        const chronoUnit = ChronoUnit[chronoUnitName];
        if (chronoUnit && !chronoUnit.isDateBased()) {
          // Convert days using the estimated duration of one day.
          const days = ChronoUnit.DAYS.between(compareTo, value);
          return (days * ChronoUnit.DAYS.duration().toMillis()) / chronoUnit.duration().toMillis();
        }
      }

      return baseGetDiff.call(this, value, comparing, unit);
    };
  }
}
