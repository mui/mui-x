/* eslint-disable class-methods-use-this */
import { addDays } from 'date-fns-v3/addDays';
import { addSeconds } from 'date-fns-v3/addSeconds';
import { addMinutes } from 'date-fns-v3/addMinutes';
import { addHours } from 'date-fns-v3/addHours';
import { addWeeks } from 'date-fns-v3/addWeeks';
import { addMonths } from 'date-fns-v3/addMonths';
import { addYears } from 'date-fns-v3/addYears';
import { endOfDay } from 'date-fns-v3/endOfDay';
import { endOfWeek } from 'date-fns-v3/endOfWeek';
import { endOfYear } from 'date-fns-v3/endOfYear';
import { format as dateFnsFormat, longFormatters } from 'date-fns-v3/format';
import { getDate } from 'date-fns-v3/getDate';
import { getDaysInMonth } from 'date-fns-v3/getDaysInMonth';
import { getHours } from 'date-fns-v3/getHours';
import { getMinutes } from 'date-fns-v3/getMinutes';
import { getMonth } from 'date-fns-v3/getMonth';
import { getSeconds } from 'date-fns-v3/getSeconds';
import { getMilliseconds } from 'date-fns-v3/getMilliseconds';
import { getWeek } from 'date-fns-v3/getWeek';
import { getYear } from 'date-fns-v3/getYear';
import { isAfter } from 'date-fns-v3/isAfter';
import { isBefore } from 'date-fns-v3/isBefore';
import { isEqual } from 'date-fns-v3/isEqual';
import { isSameDay } from 'date-fns-v3/isSameDay';
import { isSameYear } from 'date-fns-v3/isSameYear';
import { isSameMonth } from 'date-fns-v3/isSameMonth';
import { isSameHour } from 'date-fns-v3/isSameHour';
import { isValid } from 'date-fns-v3/isValid';
import { parse as dateFnsParse } from 'date-fns-v3/parse';
import { setDate } from 'date-fns-v3/setDate';
import { setHours } from 'date-fns-v3/setHours';
import { setMinutes } from 'date-fns-v3/setMinutes';
import { setMonth } from 'date-fns-v3/setMonth';
import { setSeconds } from 'date-fns-v3/setSeconds';
import { setMilliseconds } from 'date-fns-v3/setMilliseconds';
import { setYear } from 'date-fns-v3/setYear';
import { startOfDay } from 'date-fns-v3/startOfDay';
import { startOfMonth } from 'date-fns-v3/startOfMonth';
import { endOfMonth } from 'date-fns-v3/endOfMonth';
import { startOfWeek } from 'date-fns-v3/startOfWeek';
import { startOfYear } from 'date-fns-v3/startOfYear';
import { isWithinInterval } from 'date-fns-v3/isWithinInterval';
import { enUS } from 'date-fns-v3/locale/en-US';
import { Locale as DateFnsLocale } from 'date-fns-v3/locale';
import { AdapterFormats, AdapterOptions, MuiPickersAdapter } from '../models';
import { AdapterDateFnsBase } from '../AdapterDateFnsBase';

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'date-fns': Date;
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
export class AdapterDateFns
  extends AdapterDateFnsBase<DateFnsLocale>
  implements MuiPickersAdapter<Date, DateFnsLocale>
{
  constructor({ locale, formats }: AdapterOptions<DateFnsLocale, never> = {}) {
    if (typeof addDays !== 'function') {
      throw new Error(
        [
          `MUI: The \`date-fns\` package v2.x is not compatible with this adapter.`,
          'Please, install v3.x of the package or use the `AdapterDateFns` instead.',
        ].join('\n'),
      );
    }
    if (!longFormatters) {
      throw new Error(
        'MUI: The minimum supported `date-fns` package version compatible with this adapter is `3.2.x`.',
      );
    }
    super({ locale: locale ?? enUS, formats, longFormatters });
  }

  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    return dateFnsParse(value, format, new Date(), { locale: this.locale });
  };

  public isValid = (value: Date | null) => {
    if (value == null) {
      return false;
    }

    return isValid(value);
  };

  public format = (value: Date, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Date, formatString: string) => {
    return dateFnsFormat(value, formatString, { locale: this.locale });
  };

  public isEqual = (value: Date | null, comparing: Date | null) => {
    if (value === null && comparing === null) {
      return true;
    }

    if (value === null || comparing === null) {
      return false;
    }

    return isEqual(value, comparing);
  };

  public isSameYear = (value: Date, comparing: Date) => {
    return isSameYear(value, comparing);
  };

  public isSameMonth = (value: Date, comparing: Date) => {
    return isSameMonth(value, comparing);
  };

  public isSameDay = (value: Date, comparing: Date) => {
    return isSameDay(value, comparing);
  };

  public isSameHour = (value: Date, comparing: Date) => {
    return isSameHour(value, comparing);
  };

  public isAfter = (value: Date, comparing: Date) => {
    return isAfter(value, comparing);
  };

  public isAfterYear = (value: Date, comparing: Date) => {
    return isAfter(value, endOfYear(comparing));
  };

  public isAfterDay = (value: Date, comparing: Date) => {
    return isAfter(value, endOfDay(comparing));
  };

  public isBefore = (value: Date, comparing: Date) => {
    return isBefore(value, comparing);
  };

  public isBeforeYear = (value: Date, comparing: Date) => {
    return isBefore(value, this.startOfYear(comparing));
  };

  public isBeforeDay = (value: Date, comparing: Date) => {
    return isBefore(value, this.startOfDay(comparing));
  };

  public isWithinRange = (value: Date, [start, end]: [Date, Date]) => {
    return isWithinInterval(value, { start, end });
  };

  public startOfYear = (value: Date) => {
    return startOfYear(value);
  };

  public startOfMonth = (value: Date) => {
    return startOfMonth(value);
  };

  public startOfWeek = (value: Date) => {
    return startOfWeek(value, { locale: this.locale });
  };

  public startOfDay = (value: Date) => {
    return startOfDay(value);
  };

  public endOfYear = (value: Date) => {
    return endOfYear(value);
  };

  public endOfMonth = (value: Date) => {
    return endOfMonth(value);
  };

  public endOfWeek = (value: Date) => {
    return endOfWeek(value, { locale: this.locale });
  };

  public endOfDay = (value: Date) => {
    return endOfDay(value);
  };

  public addYears = (value: Date, amount: number) => {
    return addYears(value, amount);
  };

  public addMonths = (value: Date, amount: number) => {
    return addMonths(value, amount);
  };

  public addWeeks = (value: Date, amount: number) => {
    return addWeeks(value, amount);
  };

  public addDays = (value: Date, amount: number) => {
    return addDays(value, amount);
  };

  public addHours = (value: Date, amount: number) => {
    return addHours(value, amount);
  };

  public addMinutes = (value: Date, amount: number) => {
    return addMinutes(value, amount);
  };

  public addSeconds = (value: Date, amount: number) => {
    return addSeconds(value, amount);
  };

  public getYear = (value: Date) => {
    return getYear(value);
  };

  public getMonth = (value: Date) => {
    return getMonth(value);
  };

  public getDate = (value: Date) => {
    return getDate(value);
  };

  public getHours = (value: Date) => {
    return getHours(value);
  };

  public getMinutes = (value: Date) => {
    return getMinutes(value);
  };

  public getSeconds = (value: Date) => {
    return getSeconds(value);
  };

  public getMilliseconds = (value: Date) => {
    return getMilliseconds(value);
  };

  public setYear = (value: Date, year: number) => {
    return setYear(value, year);
  };

  public setMonth = (value: Date, month: number) => {
    return setMonth(value, month);
  };

  public setDate = (value: Date, date: number) => {
    return setDate(value, date);
  };

  public setHours = (value: Date, hours: number) => {
    return setHours(value, hours);
  };

  public setMinutes = (value: Date, minutes: number) => {
    return setMinutes(value, minutes);
  };

  public setSeconds = (value: Date, seconds: number) => {
    return setSeconds(value, seconds);
  };

  public setMilliseconds = (value: Date, milliseconds: number) => {
    return setMilliseconds(value, milliseconds);
  };

  public getDaysInMonth = (value: Date) => {
    return getDaysInMonth(value);
  };

  public getWeekArray = (value: Date) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));

    let count = 0;
    let current = start;
    const nestedWeeks: Date[][] = [];

    while (this.isBefore(current, end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = this.addDays(current, 1);
      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (value: Date) => {
    return getWeek(value, { locale: this.locale });
  };

  public getYearRange = ([start, end]: [Date, Date]) => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years: Date[] = [];

    let current = startDate;
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };
}
