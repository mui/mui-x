import { TZDate } from '@date-fns/tz';
import { endOfDay } from 'date-fns/endOfDay';
import { endOfYear } from 'date-fns/endOfYear';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameHour } from 'date-fns/isSameHour';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameYear } from 'date-fns/isSameYear';
import { AdapterDateFns } from '../AdapterDateFns';
import { DateBuilderReturnType, PickersTimezone } from '../models';

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'date-fns-tz': TZDate;
  }
}

const timezoneWithOffsetRegExp = /(Z|[+-]\d{2}:\d{2}|[+-]\d{4})$/i;
type DateWithTimezoneMethod = {
  withTimeZone: (timezone: string) => Date;
};

const hasWithTimeZone = (value: Date): value is Date & DateWithTimezoneMethod => {
  return (
    typeof (value as unknown as Partial<DateWithTimezoneMethod>).withTimeZone === 'function'
  );
};

/**
 * A timezone-aware date-fns adapter powered by `@date-fns/tz`.
 */
export class AdapterTZDateFns extends AdapterDateFns {
  public isTimezoneCompatible = true;

  public lib = 'date-fns-tz';

  private static defaultTimezone: string | undefined;

  public static setDefaultTimezone = (timezone: string | undefined) => {
    AdapterTZDateFns.defaultTimezone = timezone;
  };

  private resolveTimezone = (timezone: PickersTimezone): string => {
    if (timezone === 'default') {
      return AdapterTZDateFns.defaultTimezone ?? 'system';
    }

    return timezone;
  };

  private hasTimezonePart = (value: string): boolean => {
    return timezoneWithOffsetRegExp.test(value);
  };

  private createTZDateWithLocalTime = (value: string, timezone: string): TZDate => {
    // Normalize date-only strings ("2024-06-15") to datetime ("2024-06-15T00:00:00")
    // so they are parsed as local time rather than UTC (which is the ES spec behavior
    // for date-only ISO strings). This ensures getFullYear()/getDate()/etc. return
    // values matching the string's literal components regardless of system timezone.
    const normalizedValue = value.includes('T') ? value : `${value}T00:00:00`;
    const date = new Date(normalizedValue);

    return new TZDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
      timezone,
    );
  };

  private toTimezone = (value: Date, timezone: string): Date => {
    if (timezone === 'system') {
      return this.toJsDate(value);
    }

    if (value instanceof TZDate && value.timeZone === timezone) {
      return value;
    }

    if (hasWithTimeZone(value)) {
      return value.withTimeZone(timezone);
    }

    return new TZDate(value, timezone);
  };

  private normalizeComparingValue = (value: Date, comparing: Date): Date => {
    return this.setTimezone(comparing, this.getTimezone(value));
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone: PickersTimezone = 'default',
  ): DateBuilderReturnType<T> => {
    type R = DateBuilderReturnType<T>;
    if (value === null) {
      return <R>null;
    }

    const resolvedTimezone = this.resolveTimezone(timezone);
    if (typeof value === 'undefined') {
      if (resolvedTimezone === 'system') {
        return <R>new Date();
      }

      return <R>TZDate.tz(resolvedTimezone);
    }

    if (resolvedTimezone === 'system') {
      return <R>new Date(value);
    }

    if (this.hasTimezonePart(value)) {
      return <R>new TZDate(value, resolvedTimezone);
    }

    return <R>this.createTZDateWithLocalTime(value, resolvedTimezone);
  };

  public getTimezone = (value: Date | null): string => {
    if (value == null) {
      // Return 'default' (not 'system') so that resolveTimezone() will look up
      // the configured defaultTimezone when chaining operations on null values.
      return 'default';
    }

    if (value instanceof TZDate) {
      return value.timeZone ?? 'system';
    }

    return 'system';
  };

  public setTimezone = (value: Date, timezone: PickersTimezone): Date => {
    const resolvedTimezone = this.resolveTimezone(timezone);
    if (this.getTimezone(value) === resolvedTimezone) {
      return value;
    }

    return this.toTimezone(value, resolvedTimezone);
  };

  public toJsDate = (value: Date) => {
    if (value instanceof TZDate) {
      return new Date(value.getTime());
    }

    return value;
  };

  public isSameYear = (value: Date, comparing: Date): boolean => {
    return isSameYear(value, this.normalizeComparingValue(value, comparing));
  };

  public isSameMonth = (value: Date, comparing: Date): boolean => {
    return isSameMonth(value, this.normalizeComparingValue(value, comparing));
  };

  public isSameDay = (value: Date, comparing: Date): boolean => {
    return isSameDay(value, this.normalizeComparingValue(value, comparing));
  };

  public isSameHour = (value: Date, comparing: Date): boolean => {
    return isSameHour(value, this.normalizeComparingValue(value, comparing));
  };

  public isAfterYear = (value: Date, comparing: Date): boolean => {
    const comparingInValueTimezone = this.normalizeComparingValue(value, comparing);
    return isAfter(value, endOfYear(comparingInValueTimezone));
  };

  public isAfterDay = (value: Date, comparing: Date): boolean => {
    const comparingInValueTimezone = this.normalizeComparingValue(value, comparing);
    return isAfter(value, endOfDay(comparingInValueTimezone));
  };

  public isBeforeYear = (value: Date, comparing: Date): boolean => {
    const comparingInValueTimezone = this.normalizeComparingValue(value, comparing);
    return isBefore(value, this.startOfYear(comparingInValueTimezone));
  };

  public isBeforeDay = (value: Date, comparing: Date): boolean => {
    const comparingInValueTimezone = this.normalizeComparingValue(value, comparing);
    return isBefore(value, this.startOfDay(comparingInValueTimezone));
  };
}
