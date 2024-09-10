/* eslint-disable class-methods-use-this */
// TODO remove when date-fns-jalali-v3 is the default
// @ts-nocheck
import { addSeconds } from 'date-fns-jalali/addSeconds';
import { addMinutes } from 'date-fns-jalali/addMinutes';
import { addHours } from 'date-fns-jalali/addHours';
import { addDays } from 'date-fns-jalali/addDays';
import { addWeeks } from 'date-fns-jalali/addWeeks';
import { addMonths } from 'date-fns-jalali/addMonths';
import { addYears } from 'date-fns-jalali/addYears';
import { endOfDay } from 'date-fns-jalali/endOfDay';
import { endOfWeek } from 'date-fns-jalali/endOfWeek';
import { endOfYear } from 'date-fns-jalali/endOfYear';
import { format as dateFnsFormat, longFormatters } from 'date-fns-jalali/format';
import { getHours } from 'date-fns-jalali/getHours';
import { getSeconds } from 'date-fns-jalali/getSeconds';
import { getMilliseconds } from 'date-fns-jalali/getMilliseconds';
import { getWeek } from 'date-fns-jalali/getWeek';
import { getYear } from 'date-fns-jalali/getYear';
import { getMonth } from 'date-fns-jalali/getMonth';
import { getDate } from 'date-fns-jalali/getDate';
import { getDaysInMonth } from 'date-fns-jalali/getDaysInMonth';
import { getMinutes } from 'date-fns-jalali/getMinutes';
import { isAfter } from 'date-fns-jalali/isAfter';
import { isBefore } from 'date-fns-jalali/isBefore';
import { isEqual } from 'date-fns-jalali/isEqual';
import { isSameDay } from 'date-fns-jalali/isSameDay';
import { isSameYear } from 'date-fns-jalali/isSameYear';
import { isSameMonth } from 'date-fns-jalali/isSameMonth';
import { isSameHour } from 'date-fns-jalali/isSameHour';
import { isValid } from 'date-fns-jalali/isValid';
import { parse as dateFnsParse } from 'date-fns-jalali/parse';
import { setDate } from 'date-fns-jalali/setDate';
import { setHours } from 'date-fns-jalali/setHours';
import { setMinutes } from 'date-fns-jalali/setMinutes';
import { setMonth } from 'date-fns-jalali/setMonth';
import { setSeconds } from 'date-fns-jalali/setSeconds';
import { setMilliseconds } from 'date-fns-jalali/setMilliseconds';
import { setYear } from 'date-fns-jalali/setYear';
import { startOfDay } from 'date-fns-jalali/startOfDay';
import { startOfMonth } from 'date-fns-jalali/startOfMonth';
import { endOfMonth } from 'date-fns-jalali/endOfMonth';
import { startOfWeek } from 'date-fns-jalali/startOfWeek';
import { startOfYear } from 'date-fns-jalali/startOfYear';
import { isWithinInterval } from 'date-fns-jalali/isWithinInterval';
import { faIR as defaultLocale } from 'date-fns-jalali/locale/fa-IR';
// date-fns-jalali v2 does not export types
// @ts-ignore TODO remove when date-fns-jalali-v3 is the default
import { Locale as DateFnsLocale } from 'date-fns-jalali/locale/types';
import { AdapterFormats, AdapterOptions, MuiPickersAdapter } from '../models';
import { AdapterDateFnsBase } from '../AdapterDateFnsBase';

const defaultFormats: AdapterFormats = {
  year: 'yyyy',
  month: 'LLLL',
  monthShort: 'MMM',
  dayOfMonth: 'd',
  dayOfMonthFull: 'do',
  weekday: 'EEEE',
  weekdayShort: 'EEEEEE',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'aa',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'PPP',
  keyboardDate: 'P',
  shortDate: 'd MMM',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, d MMMM',

  fullTime: 'p',
  fullTime12h: 'hh:mm aaa',
  fullTime24h: 'HH:mm',
  keyboardDateTime: 'P p',
  keyboardDateTime12h: 'P hh:mm aa',
  keyboardDateTime24h: 'P HH:mm',
};

const NUMBER_SYMBOL_MAP = {
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
  '0': '۰',
};

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'date-fns-jalali': Date;
  }
}

/**
 * Based on `@date-io/date-fns-jalali`
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
export class AdapterDateFnsJalali
  extends AdapterDateFnsBase<DateFnsLocale>
  implements MuiPickersAdapter<Date, DateFnsLocale>
{
  constructor({ locale, formats }: AdapterOptions<DateFnsLocale, never> = {}) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production') {
      if (typeof addDays !== 'function') {
        throw new Error(
          [
            `MUI: The \`date-fns-jalali\` package v2.x is not compatible with this adapter.`,
            'Please, install v3.x of the package or use the `AdapterDateFnsJalali` instead.',
          ].join('\n'),
        );
      }
      if (!longFormatters) {
        throw new Error(
          'MUI: The minimum supported `date-fns-jalali` package version compatible with this adapter is `3.2.x`.',
        );
      }
    }
    super({
      locale: locale ?? defaultLocale,
      // some formats are different in jalali adapter,
      // this ensures that `AdapterDateFnsBase` formats are overridden
      formats: { ...defaultFormats, ...formats },
      longFormatters,
      lib: 'date-fns-jalali',
    });
  }

  // TODO: explicit return types can be removed once there is only one date-fns version supported
  public parse = (value: string, format: string): Date | null => {
    if (value === '') {
      return null;
    }

    return dateFnsParse(value, format, new Date(), { locale: this.locale });
  };

  public isValid = (value: Date | null): boolean => {
    if (value == null) {
      return false;
    }

    return isValid(value);
  };

  public format = (value: Date, formatKey: keyof AdapterFormats): string => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Date, formatString: string): string => {
    return dateFnsFormat(value, formatString, { locale: this.locale });
  };

  public formatNumber = (numberToFormat: string): string => {
    return numberToFormat
      .replace(/\d/g, (match) => NUMBER_SYMBOL_MAP[match as keyof typeof NUMBER_SYMBOL_MAP])
      .replace(/,/g, '،');
  };

  public isEqual = (value: Date | null, comparing: Date | null): boolean => {
    if (value === null && comparing === null) {
      return true;
    }

    if (value === null || comparing === null) {
      return false;
    }

    return isEqual(value, comparing);
  };

  public isSameYear = (value: Date, comparing: Date): boolean => {
    return isSameYear(value, comparing);
  };

  public isSameMonth = (value: Date, comparing: Date): boolean => {
    return isSameMonth(value, comparing);
  };

  public isSameDay = (value: Date, comparing: Date): boolean => {
    return isSameDay(value, comparing);
  };

  public isSameHour = (value: Date, comparing: Date): boolean => {
    return isSameHour(value, comparing);
  };

  public isAfter = (value: Date, comparing: Date): boolean => {
    return isAfter(value, comparing);
  };

  public isAfterYear = (value: Date, comparing: Date): boolean => {
    return isAfter(value, this.endOfYear(comparing));
  };

  public isAfterDay = (value: Date, comparing: Date): boolean => {
    return isAfter(value, this.endOfDay(comparing));
  };

  public isBefore = (value: Date, comparing: Date): boolean => {
    return isBefore(value, comparing);
  };

  public isBeforeYear = (value: Date, comparing: Date): boolean => {
    return isBefore(value, this.startOfYear(comparing));
  };

  public isBeforeDay = (value: Date, comparing: Date): boolean => {
    return isBefore(value, this.startOfDay(comparing));
  };

  public isWithinRange = (value: Date, [start, end]: [Date, Date]): boolean => {
    return isWithinInterval(value, { start, end });
  };

  public startOfYear = (value: Date): Date => {
    return startOfYear(value);
  };

  public startOfMonth = (value: Date): Date => {
    return startOfMonth(value);
  };

  public startOfWeek = (value: Date): Date => {
    return startOfWeek(value, { locale: this.locale });
  };

  public startOfDay = (value: Date): Date => {
    return startOfDay(value);
  };

  public endOfYear = (value: Date): Date => {
    return endOfYear(value);
  };

  public endOfMonth = (value: Date): Date => {
    return endOfMonth(value);
  };

  public endOfWeek = (value: Date): Date => {
    return endOfWeek(value, { locale: this.locale });
  };

  public endOfDay = (value: Date): Date => {
    return endOfDay(value);
  };

  public addYears = (value: Date, amount: number): Date => {
    return addYears(value, amount);
  };

  public addMonths = (value: Date, amount: number): Date => {
    return addMonths(value, amount);
  };

  public addWeeks = (value: Date, amount: number): Date => {
    return addWeeks(value, amount);
  };

  public addDays = (value: Date, amount: number): Date => {
    return addDays(value, amount);
  };

  public addHours = (value: Date, amount: number): Date => {
    return addHours(value, amount);
  };

  public addMinutes = (value: Date, amount: number): Date => {
    return addMinutes(value, amount);
  };

  public addSeconds = (value: Date, amount: number): Date => {
    return addSeconds(value, amount);
  };

  public getYear = (value: Date): number => {
    return getYear(value);
  };

  public getMonth = (value: Date): number => {
    return getMonth(value);
  };

  public getDate = (value: Date): number => {
    return getDate(value);
  };

  public getHours = (value: Date): number => {
    return getHours(value);
  };

  public getMinutes = (value: Date): number => {
    return getMinutes(value);
  };

  public getSeconds = (value: Date): number => {
    return getSeconds(value);
  };

  public getMilliseconds = (value: Date): number => {
    return getMilliseconds(value);
  };

  public setYear = (value: Date, year: number): Date => {
    return setYear(value, year);
  };

  public setMonth = (value: Date, month: number): Date => {
    return setMonth(value, month);
  };

  public setDate = (value: Date, date: number): Date => {
    return setDate(value, date);
  };

  public setHours = (value: Date, hours: number): Date => {
    return setHours(value, hours);
  };

  public setMinutes = (value: Date, minutes: number): Date => {
    return setMinutes(value, minutes);
  };

  public setSeconds = (value: Date, seconds: number): Date => {
    return setSeconds(value, seconds);
  };

  public setMilliseconds = (value: Date, milliseconds: number): Date => {
    return setMilliseconds(value, milliseconds);
  };

  public getDaysInMonth = (value: Date): number => {
    return getDaysInMonth(value);
  };

  public getWeekArray = (value: Date): Date[][] => {
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

  public getWeekNumber = (date: Date): number => {
    return getWeek(date, { locale: this.locale });
  };

  public getYearRange = ([start, end]: [Date, Date]): Date[] => {
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
