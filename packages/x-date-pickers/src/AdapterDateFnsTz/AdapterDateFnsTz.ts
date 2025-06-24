/* eslint-disable class-methods-use-this */
import { TZDate, TZDateMini } from '@date-fns/tz';
import { addDays } from 'date-fns/addDays';
import { addSeconds } from 'date-fns/addSeconds';
import { addMinutes } from 'date-fns/addMinutes';
import { addHours } from 'date-fns/addHours';
import { addWeeks } from 'date-fns/addWeeks';
import { addMonths } from 'date-fns/addMonths';
import { addYears } from 'date-fns/addYears';
import { endOfDay } from 'date-fns/endOfDay';
import { endOfWeek } from 'date-fns/endOfWeek';
import { endOfYear } from 'date-fns/endOfYear';
import { format as dateFnsFormat, longFormatters } from 'date-fns/format';
import { getDate } from 'date-fns/getDate';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';
import { getMonth } from 'date-fns/getMonth';
import { getSeconds } from 'date-fns/getSeconds';
import { getMilliseconds } from 'date-fns/getMilliseconds';
import { getWeek } from 'date-fns/getWeek';
import { getYear } from 'date-fns/getYear';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isEqual } from 'date-fns/isEqual';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameYear } from 'date-fns/isSameYear';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameHour } from 'date-fns/isSameHour';
import { isValid } from 'date-fns/isValid';
import { parse as dateFnsParse } from 'date-fns/parse';
import { setDate } from 'date-fns/setDate';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { setMonth } from 'date-fns/setMonth';
import { setSeconds } from 'date-fns/setSeconds';
import { setMilliseconds } from 'date-fns/setMilliseconds';
import { setYear } from 'date-fns/setYear';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { startOfYear } from 'date-fns/startOfYear';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { enUS } from 'date-fns/locale/en-US';
import { Locale as DateFnsLocale } from 'date-fns/locale';
import {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  MuiPickersAdapter,
  PickersTimezone,
} from '../models';
import { AdapterDateFnsBase } from '../AdapterDateFnsBase';

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'date-fns-tz': TZDate;
  }
}

/**
 * Based on `@date-io/date-fns`
 *
 * MIT License
 *
 * Copyright (c) 2017 Dmitriy Kovalenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export class AdapterDateFnsTz
  extends AdapterDateFnsBase<DateFnsLocale, TZDate>
  implements MuiPickersAdapter<DateFnsLocale>
{
  constructor({ locale, formats }: AdapterOptions<DateFnsLocale, never> = {}) {
    /* v8 ignore start */
    if (process.env.NODE_ENV !== 'production') {
      if (typeof addDays !== 'function') {
        throw new Error(
          [
            'MUI: The `date-fns` package v2.x is not compatible with this adapter.',
            'Please, install v3.x or v4.x of the package or use the `AdapterDateFnsV2` instead.',
          ].join('\n'),
        );
      }
      if (!longFormatters) {
        throw new Error(
          'MUI: The minimum supported `date-fns` package version compatible with this adapter is `3.2.x`.',
        );
      }
    }
    /* v8 ignore stop */
    super({ locale: locale ?? enUS, formats, longFormatters });
  }

  public date = <T extends string | null | undefined>(value?: T): DateBuilderReturnType<T> => {
    type R = DateBuilderReturnType<T>;
    if (typeof value === 'undefined') {
      return new Date() as unknown as R;
    }

    if (value === null) {
      return null as unknown as R;
    }

    return new TZDateMini(value) as unknown as R;
  };

  // TODO: explicit return types can be removed once there is only one date-fns version supported
  public parse = (value: string, format: string): TZDate | null => {
    if (value === '') {
      return null;
    }

    return dateFnsParse<TZDate, TZDate>(value, format, new TZDateMini(), {
      locale: this.locale,
      //@ts-expect-error
      in: (value: string | number | Date) => new TZDateMini(value),
    });
  };

  public isValid = (value: TZDate | null): value is TZDate => {
    if (value == null) {
      return false;
    }

    return isValid(value);
  };

  public format = (value: TZDate, formatKey: keyof AdapterFormats): string => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: TZDate, formatString: string): string => {
    return dateFnsFormat(value, formatString, { locale: this.locale });
  };

  public isEqual = (value: TZDate | null, comparing: TZDate | null): boolean => {
    if (value === null && comparing === null) {
      return true;
    }

    if (value === null || comparing === null) {
      return false;
    }

    return isEqual(value, comparing);
  };

  public isSameYear = (value: TZDate, comparing: TZDate): boolean => {
    return isSameYear(value, comparing);
  };

  public isSameMonth = (value: TZDate, comparing: TZDate): boolean => {
    return isSameMonth(value, comparing);
  };

  public isSameDay = (value: TZDate, comparing: TZDate): boolean => {
    return isSameDay(value, comparing);
  };

  public isSameHour = (value: TZDate, comparing: TZDate): boolean => {
    return isSameHour(value, comparing);
  };

  public isAfter = (value: TZDate, comparing: TZDate): boolean => {
    return isAfter(value, comparing);
  };

  public isAfterYear = (value: TZDate, comparing: TZDate): boolean => {
    return isAfter(value, endOfYear(comparing));
  };

  public isAfterDay = (value: TZDate, comparing: TZDate): boolean => {
    return isAfter(value, endOfDay(comparing));
  };

  public isBefore = (value: TZDate, comparing: TZDate): boolean => {
    return isBefore(value, comparing);
  };

  public isBeforeYear = (value: TZDate, comparing: TZDate): boolean => {
    return isBefore(value, this.startOfYear(comparing));
  };

  public isBeforeDay = (value: TZDate, comparing: TZDate): boolean => {
    return isBefore(value, this.startOfDay(comparing));
  };

  public isWithinRange = (value: TZDate, [start, end]: [TZDate, TZDate]): boolean => {
    return isWithinInterval(value, { start, end });
  };

  public startOfYear = (value: TZDate): TZDate => {
    return startOfYear(value);
  };

  public startOfMonth = (value: TZDate): TZDate => {
    return startOfMonth(value);
  };

  public startOfWeek = (value: TZDate): TZDate => {
    return startOfWeek(value, { locale: this.locale });
  };

  public startOfDay = (value: TZDate): TZDate => {
    return startOfDay(value);
  };

  public endOfYear = (value: TZDate): TZDate => {
    return endOfYear(value);
  };

  public endOfMonth = (value: TZDate): TZDate => {
    return endOfMonth(value);
  };

  public endOfWeek = (value: TZDate): TZDate => {
    return endOfWeek(value, { locale: this.locale });
  };

  public endOfDay = (value: TZDate): TZDate => {
    return endOfDay(value);
  };

  public addYears = (value: TZDate, amount: number): TZDate => {
    return addYears(value, amount);
  };

  public addMonths = (value: TZDate, amount: number): TZDate => {
    return addMonths(value, amount);
  };

  public addWeeks = (value: TZDate, amount: number): TZDate => {
    return addWeeks(value, amount);
  };

  public addDays = (value: TZDate, amount: number): TZDate => {
    return addDays(value, amount);
  };

  public addHours = (value: TZDate, amount: number): TZDate => {
    return addHours(value, amount);
  };

  public addMinutes = (value: TZDate, amount: number): TZDate => {
    return addMinutes(value, amount);
  };

  public addSeconds = (value: TZDate, amount: number): TZDate => {
    return addSeconds(value, amount);
  };

  public getYear = (value: TZDate): number => {
    return getYear(value);
  };

  public getMonth = (value: TZDate): number => {
    return getMonth(value);
  };

  public getDate = (value: TZDate): number => {
    return getDate(value);
  };

  public getHours = (value: TZDate): number => {
    return getHours(value);
  };

  public getMinutes = (value: TZDate): number => {
    return getMinutes(value);
  };

  public getSeconds = (value: TZDate): number => {
    return getSeconds(value);
  };

  public getMilliseconds = (value: TZDate): number => {
    return getMilliseconds(value);
  };

  public setYear = (value: TZDate, year: number): TZDate => {
    return setYear(value, year);
  };

  public setMonth = (value: TZDate, month: number): TZDate => {
    return setMonth(value, month);
  };

  public setDate = (value: TZDate, date: number): TZDate => {
    return setDate(value, date);
  };

  public setHours = (value: TZDate, hours: number): TZDate => {
    return setHours(value, hours);
  };

  public setMinutes = (value: TZDate, minutes: number): TZDate => {
    return setMinutes(value, minutes);
  };

  public setSeconds = (value: TZDate, seconds: number): TZDate => {
    return setSeconds(value, seconds);
  };

  public setMilliseconds = (value: TZDate, milliseconds: number): TZDate => {
    return setMilliseconds(value, milliseconds);
  };

  public getDaysInMonth = (value: TZDate): number => {
    return getDaysInMonth(value);
  };

  public getWeekArray = (value: TZDate): TZDate[][] => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));

    let count = 0;
    let current = start;
    const nestedWeeks: TZDate[][] = [];

    while (this.isBefore(current, end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = this.addDays(current, 1);
      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (value: TZDate): number => {
    return getWeek(value, { locale: this.locale });
  };

  public getYearRange = ([start, end]: [TZDate, TZDate]): TZDate[] => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years: TZDate[] = [];

    let current = startDate;
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };

  public getTimezone = (value: TZDate): string => {
    return value.timeZone ?? 'default';
  };

  public setTimezone = (value: TZDate, timezone: PickersTimezone): TZDate => {
    if (this.getTimezone(value) === timezone) {
      return value;
    }

    if (timezone === 'system' || timezone === 'default') {
      return new TZDateMini(value);
    }

    return TZDateMini.tz(timezone, value);
  };
}
