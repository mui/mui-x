/* eslint-disable class-methods-use-this */
import defaultHMoment, { Moment } from 'moment-hijri';
import { AdapterMoment } from '../AdapterMoment';
import {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
} from '../models';

// From https://momentjs.com/docs/#/displaying/format/
const formatTokenMap: FieldFormatTokenMap = {
  // Year
  iY: { sectionType: 'year', contentType: 'letter' },
  iYY: { sectionType: 'year', contentType: 'letter' },
  iYYYY: { sectionType: 'year', contentType: 'letter' },

  // Month
  iM: 'month',
  iMM: 'month',
  iMMM: { sectionType: 'month', contentType: 'letter' },
  iMMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  iD: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  iDD: 'day',

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  HH: 'hours',
  h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  hh: 'hours',

  // Minutes
  m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
  mm: 'minutes',

  // Seconds
  s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
  ss: 'seconds',
};

const defaultFormats: AdapterFormats = {
  year: 'iYYYY',
  month: 'iMMMM',
  monthShort: 'iMMM',
  dayOfMonth: 'iD',
  weekday: 'dddd',
  weekdayShort: 'ddd',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'A',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'iYYYY, iMMMM Do',
  fullDateWithWeekday: 'iYYYY, iMMMM Do, dddd',
  keyboardDateTime: 'iYYYY/iMM/iDD LT',
  shortDate: 'iD iMMM',
  normalDate: 'dddd, iD iMMM',
  normalDateWithWeekday: 'DD iMMMM',
  monthAndYear: 'iMMMM iYYYY',
  monthAndDate: 'iD iMMMM',

  fullTime: 'LT',
  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',

  fullDateTime: 'iYYYY, iMMMM Do, hh:mm A',
  fullDateTime12h: 'iD iMMMM hh:mm A',
  fullDateTime24h: 'iD iMMMM HH:mm',
  keyboardDate: 'iYYYY/iMM/iDD',
  keyboardDateTime12h: 'iYYYY/iMM/iDD hh:mm A',
  keyboardDateTime24h: 'iYYYY/iMM/iDD HH:mm',
};

const NUMBER_SYMBOL_MAP = {
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '0': '٠',
};

/**
 * Based on `@date-io/hijri`
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
export class AdapterMomentHijri extends AdapterMoment implements MuiPickersAdapter<Moment, string> {
  public lib = 'moment-hijri';

  public moment: typeof defaultHMoment;

  public isTimezoneCompatible = false;

  public formatTokenMap = formatTokenMap;

  constructor({ formats, instance }: AdapterOptions<string, typeof defaultHMoment> = {}) {
    super({ locale: 'ar-SA', instance });

    this.moment = instance || defaultHMoment;
    this.locale = 'ar-SA';
    this.formats = { ...defaultFormats, ...formats };
  }

  public date = (value?: any) => {
    if (value === null) {
      return null;
    }

    return this.moment(value).locale('ar-SA');
  };

  public dateWithTimezone = <T extends string | null | undefined>(
    value: T,
  ): DateBuilderReturnType<T, Moment> => {
    return <DateBuilderReturnType<T, Moment>>this.date(value);
  };

  public getTimezone = (): string => {
    return 'default';
  };

  public setTimezone = (value: Moment): Moment => {
    return value;
  };

  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    return this.moment(value, format, true).locale('ar-SA');
  };

  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format)
      .replace(/a/gi, '(a|p)m')
      .replace('iY', 'Y')
      .replace('iM', 'M')
      .replace('iD', 'D')
      .toLocaleLowerCase();
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat
      .replace(/\d/g, (match) => NUMBER_SYMBOL_MAP[match as keyof typeof NUMBER_SYMBOL_MAP])
      .replace(/,/g, '،');
  };

  public startOfYear = (value: Moment) => {
    return value.clone().startOf('iYear');
  };

  public startOfMonth = (value: Moment) => {
    return value.clone().startOf('iMonth');
  };

  public endOfYear = (value: Moment) => {
    return value.clone().endOf('iYear');
  };

  public endOfMonth = (value: Moment) => {
    return value.clone().endOf('iMonth');
  };

  public addYears = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'iYear')
      : value.clone().add(amount, 'iYear');
  };

  public addMonths = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'iMonth')
      : value.clone().add(amount, 'iMonth');
  };

  public getYear = (value: Moment) => {
    return value.iYear();
  };

  public getMonth = (value: Moment) => {
    return value.iMonth();
  };

  public getDate = (value: Moment) => {
    return value.iDate();
  };

  public setYear = (value: Moment, year: number) => {
    return value.clone().iYear(year);
  };

  public setMonth = (value: Moment, month: number) => {
    return value.clone().iMonth(month);
  };

  public setDate = (value: Moment, date: number) => {
    return value.clone().iDate(date);
  };

  public getNextMonth = (value: Moment) => {
    return value.clone().add(1, 'iMonth');
  };

  public getPreviousMonth = (value: Moment) => {
    return value.clone().subtract(1, 'iMonth');
  };

  public getWeekdays = () => {
    return [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
      return this.date()!.weekday(dayOfWeek).format('dd');
    });
  };

  public getWeekArray = (value: Moment) => {
    const start = value.clone().startOf('iMonth').startOf('week');

    const end = value.clone().endOf('iMonth').endOf('week');

    let count = 0;
    let current = start;
    const nestedWeeks: Moment[][] = [];

    while (current.isBefore(end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = current.clone().add(1, 'day');
      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (value: Moment) => {
    return value.iWeek();
  };

  public getYearRange = (start: Moment, end: Moment) => {
    // moment-hijri only supports dates between 1356-01-01 H and 1499-12-29 H
    // We need to throw if outside min/max bounds, otherwise the while loop below will be infinite.
    if (start.isBefore('1937-03-14')) {
      throw new Error('min date must be on or after 1356-01-01 H (1937-03-14)');
    }
    if (end.isAfter('2076-11-26')) {
      throw new Error('max date must be on or before 1499-12-29 H (2076-11-26)');
    }

    const startDate = this.moment(start).startOf('iYear');
    const endDate = this.moment(end).endOf('iYear');
    const years: Moment[] = [];

    let current = startDate;
    while (current.isBefore(endDate)) {
      years.push(current);
      current = current.clone().add(1, 'iYear');
    }

    return years;
  };

  public getMeridiemText = (ampm: 'am' | 'pm') => {
    return ampm === 'am' ? this.date()!.hours(2).format('A') : this.date()!.hours(14).format('A');
  };
}
