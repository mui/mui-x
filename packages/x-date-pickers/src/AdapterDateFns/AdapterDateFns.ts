/* eslint-disable class-methods-use-this */
import addDays from 'date-fns/addDays';
import addSeconds from 'date-fns/addSeconds';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import addWeeks from 'date-fns/addWeeks';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import endOfDay from 'date-fns/endOfDay';
import endOfWeek from 'date-fns/endOfWeek';
import endOfYear from 'date-fns/endOfYear';
import dateFnsFormat from 'date-fns/format';
import getDate from 'date-fns/getDate';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import getMonth from 'date-fns/getMonth';
import getSeconds from 'date-fns/getSeconds';
import getMilliseconds from 'date-fns/getMilliseconds';
import getWeek from 'date-fns/getWeek';
import getYear from 'date-fns/getYear';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import isSameDay from 'date-fns/isSameDay';
import isSameYear from 'date-fns/isSameYear';
import isSameMonth from 'date-fns/isSameMonth';
import isSameHour from 'date-fns/isSameHour';
import isValid from 'date-fns/isValid';
import dateFnsParse from 'date-fns/parse';
import setDate from 'date-fns/setDate';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setMonth from 'date-fns/setMonth';
import setSeconds from 'date-fns/setSeconds';
import setMilliseconds from 'date-fns/setMilliseconds';
import setYear from 'date-fns/setYear';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import startOfYear from 'date-fns/startOfYear';
import isWithinInterval from 'date-fns/isWithinInterval';
import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import { AdapterFormats, AdapterOptions, MuiPickersAdapter } from '../models';
import { AdapterDateFnsBase } from '../AdapterDateFnsBase';

type DateFnsLocale = typeof defaultLocale;

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
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production') {
      if (typeof addDays !== 'function') {
        throw new Error(
          [
            'MUI: The `date-fns` package v3.x is not compatible with this adapter.',
            'Please, install v2.x of the package or use the `AdapterDateFnsV3` instead.',
          ].join('\n'),
        );
      }
    }
    super({ locale: locale ?? defaultLocale, formats, longFormatters });
  }

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
    return isAfter(value, endOfYear(comparing));
  };

  public isAfterDay = (value: Date, comparing: Date): boolean => {
    return isAfter(value, endOfDay(comparing));
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

  public getWeekNumber = (value: Date): number => {
    return getWeek(value, { locale: this.locale });
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
