/* eslint-disable class-methods-use-this */
// TODO remove when date-fns-v3 is the default
// @ts-nocheck
import { addDays } from 'date-fns/addDays';
import { addSeconds } from 'date-fns/addSeconds';
import { addMinutes } from 'date-fns/addMinutes';
import { addHours } from 'date-fns/addHours';
import { addWeeks } from 'date-fns/addWeeks';
import { addMonths } from 'date-fns/addMonths';
import { addYears } from 'date-fns/addYears';
import { differenceInYears } from 'date-fns/differenceInYears';
import { differenceInQuarters } from 'date-fns/differenceInQuarters';
import { differenceInMonths } from 'date-fns/differenceInMonths';
import { differenceInWeeks } from 'date-fns/differenceInWeeks';
import { differenceInDays } from 'date-fns/differenceInDays';
import { differenceInHours } from 'date-fns/differenceInHours';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { endOfDay } from 'date-fns/endOfDay';
import { endOfWeek } from 'date-fns/endOfWeek';
import { endOfYear } from 'date-fns/endOfYear';
// @ts-ignore TODO remove when date-fns-v3 is the default
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
import { formatISO } from 'date-fns/formatISO';
import { parseISO } from 'date-fns/parseISO';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { enUS } from 'date-fns/locale/en-US';
// date-fns v2 does not export types
// @ts-ignore TODO remove when date-fns-v3 is the default
import { Locale as DateFnsLocale } from 'date-fns/locale/types';
import { AdapterFormats, AdapterOptions, AdapterUnits, MuiPickersAdapter } from '../models';
import { AdapterDateFnsBase } from '../AdapterDateFnsBase';

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

  public parseISO = (isoString: string) => {
    return parseISO(isoString);
  };

  public toISO = (value: Date) => {
    return formatISO(value, { format: 'extended' });
  };

  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    return dateFnsParse(value, format, new Date(), { locale: this.locale });
  };

  public isValid = (value: any) => {
    return isValid(this.date(value));
  };

  public format = (value: Date, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Date, formatString: string) => {
    return dateFnsFormat(value, formatString, { locale: this.locale });
  };

  public getDiff = (value: Date, comparing: Date | string, unit?: AdapterUnits) => {
    switch (unit) {
      case 'years':
        return differenceInYears(value, this.date(comparing)!);
      case 'quarters':
        return differenceInQuarters(value, this.date(comparing)!);
      case 'months':
        return differenceInMonths(value, this.date(comparing)!);
      case 'weeks':
        return differenceInWeeks(value, this.date(comparing)!);
      case 'days':
        return differenceInDays(value, this.date(comparing)!);
      case 'hours':
        return differenceInHours(value, this.date(comparing)!);
      case 'minutes':
        return differenceInMinutes(value, this.date(comparing)!);
      case 'seconds':
        return differenceInSeconds(value, this.date(comparing)!);
      default: {
        return differenceInMilliseconds(value, this.date(comparing)!);
      }
    }
  };

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
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

  public getNextMonth = (value: Date) => {
    return addMonths(value, 1);
  };

  public getPreviousMonth = (value: Date) => {
    return addMonths(value, -1);
  };

  public getMonthArray = (value: Date) => {
    const firstMonth = startOfYear(value);
    const monthArray = [firstMonth];

    while (monthArray.length < 12) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public mergeDateAndTime = (dateParam: Date, timeParam: Date) => {
    return this.setSeconds(
      this.setMinutes(
        this.setHours(dateParam, this.getHours(timeParam)),
        this.getMinutes(timeParam),
      ),
      this.getSeconds(timeParam),
    );
  };

  public getWeekdays = () => {
    const now = new Date();
    return eachDayOfInterval({
      start: startOfWeek(now, { locale: this.locale }),
      end: endOfWeek(now, { locale: this.locale }),
    }).map((day) => this.formatByString(day, 'EEEEEE'));
  };

  public getWeekArray = (value: Date) => {
    const start = startOfWeek(startOfMonth(value), { locale: this.locale });
    const end = endOfWeek(endOfMonth(value), { locale: this.locale });

    let count = 0;
    let current = start;
    const nestedWeeks: Date[][] = [];

    while (isBefore(current, end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = addDays(current, 1);
      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (value: Date) => {
    return getWeek(value, { locale: this.locale });
  };

  public getYearRange = (start: Date, end: Date) => {
    const startDate = startOfYear(start);
    const endDate = endOfYear(end);
    const years: Date[] = [];

    let current = startDate;
    while (isBefore(current, endDate)) {
      years.push(current);
      current = addYears(current, 1);
    }

    return years;
  };
}
