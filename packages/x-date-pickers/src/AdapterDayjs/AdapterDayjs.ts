/* eslint-disable class-methods-use-this */
import defaultDayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { FieldFormatTokenMap, MuiPickersAdapter, AdapterFormats, AdapterUnits } from '../models';
import { buildWarning } from '../internals/utils/warning';

defaultDayjs.extend(customParseFormatPlugin);
defaultDayjs.extend(localizedFormatPlugin);
defaultDayjs.extend(isBetweenPlugin);

const localeNotFoundWarning = buildWarning([
  'Your locale has not been found.',
  'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale',
  "Or you forget to import the locale with `require('dayjs/locale/{localeUsed}')`",
  'fallback on English locale',
]);

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  YY: 'year',
  YYYY: 'year',

  // Month
  M: 'month',
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  D: 'day',
  DD: 'day',
  Do: 'day',

  // Day of the week
  d: 'weekDay',
  dd: { sectionType: 'weekDay', contentType: 'letter' },
  ddd: { sectionType: 'weekDay', contentType: 'letter' },
  dddd: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',

  // Minutes
  m: 'minutes',
  mm: 'minutes',

  // Seconds
  s: 'seconds',
  ss: 'seconds',
};

interface Opts {
  locale?: string;
  /** Make sure that your dayjs instance extends customParseFormat and advancedFormat */
  instance?: typeof defaultDayjs;
  formats?: Partial<AdapterFormats>;
}

type Constructor = (...args: Parameters<typeof defaultDayjs>) => Dayjs;

const defaultFormats: AdapterFormats = {
  normalDateWithWeekday: 'ddd, MMM D',
  normalDate: 'D MMMM',
  shortDate: 'MMM D',
  monthAndDate: 'MMMM D',
  dayOfMonth: 'D',
  year: 'YYYY',
  month: 'MMMM',
  monthShort: 'MMM',
  monthAndYear: 'MMMM YYYY',
  weekday: 'dddd',
  weekdayShort: 'ddd',
  minutes: 'mm',
  hours12h: 'hh',
  hours24h: 'HH',
  seconds: 'ss',
  fullTime: 'LT',
  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',
  fullDate: 'll',
  fullDateWithWeekday: 'dddd, LL',
  fullDateTime: 'lll',
  fullDateTime12h: 'll hh:mm A',
  fullDateTime24h: 'll HH:mm',
  keyboardDate: 'L',
  keyboardDateTime: 'L LT',
  keyboardDateTime12h: 'L hh:mm A',
  keyboardDateTime24h: 'L HH:mm',
};

const withLocale = (dayjs: any, locale?: string): Constructor =>
  !locale ? dayjs : (...args) => dayjs(...args).locale(locale);

/**
 * Based on `@date-io/dayjs`
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
export class AdapterDayjs implements MuiPickersAdapter<Dayjs> {
  public isMUIAdapter = true;

  public rawDayJsInstance: typeof defaultDayjs;

  public lib = 'dayjs';

  public dayjs: Constructor;

  public locale?: string;

  public formats: AdapterFormats;

  constructor({ locale, formats, instance }: Opts = {}) {
    this.rawDayJsInstance = instance || defaultDayjs;
    this.dayjs = withLocale(this.rawDayJsInstance, locale);
    this.locale = locale;

    this.formats = { ...defaultFormats, ...formats };

    defaultDayjs.extend(weekOfYear);
  }

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  private getLocaleFormats = () => {
    const locales = this.rawDayJsInstance.Ls ?? defaultDayjs.Ls;
    const locale = this.locale || 'en';

    let localeObject = locales[locale];

    if (localeObject === undefined) {
      localeNotFoundWarning();
      localeObject = locales.en;
    }

    return localeObject.formats;
  };

  public date = (value?: any) => {
    if (value === null) {
      return null;
    }

    return this.dayjs(value);
  };

  public toJsDate = (value: Dayjs) => {
    return value.toDate();
  };

  public parseISO = (isoString: string) => {
    return this.dayjs(isoString);
  };

  public toISO = (value: Dayjs) => {
    return value.toISOString();
  };

  public parse = (value: any, format: string) => {
    if (value === '') {
      return null;
    }

    return this.dayjs(value, format, this.locale, true);
  };

  public getCurrentLocaleCode = () => {
    return this.locale || 'en';
  };

  public is12HourCycleInCurrentLocale = () => {
    /* istanbul ignore next */
    return /A|a/.test(this.getLocaleFormats().LT || '');
  };

  public expandFormat = (format: string) => {
    const localeFormats = this.getLocaleFormats();

    // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
    const t = (formatBis: string) =>
      formatBis.replace(
        /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
        (_: string, a: string, b: string) => a || b.slice(1),
      );

    return format.replace(
      /(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,
      (_: string, a: string, b: string) => {
        const B = b && b.toUpperCase();
        return (
          a ||
          localeFormats[b as keyof typeof localeFormats] ||
          t(localeFormats[B as keyof typeof localeFormats] as string)
        );
      },
    );
  };

  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
  };

  public isNull = (date: Dayjs | null) => {
    return date === null;
  };

  public isValid = (value: any) => {
    return this.dayjs(value).isValid();
  };

  public format = (date: Dayjs, formatKey: keyof AdapterFormats) => {
    return this.formatByString(date, this.formats[formatKey]);
  };

  public formatByString = (date: Dayjs, formatString: string) => {
    return this.dayjs(date).format(formatString);
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public getDiff = (date: Dayjs, comparing: Dayjs, units?: AdapterUnits) => {
    return date.diff(comparing, units as AdapterUnits);
  };

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
    }

    return this.dayjs(value).isSame(comparing);
  };

  public isSameYear = (date: Dayjs, comparing: Dayjs) => {
    return date.isSame(comparing, 'year');
  };

  public isSameMonth = (date: Dayjs, comparing: Dayjs) => {
    return date.isSame(comparing, 'month');
  };

  public isSameDay = (date: Dayjs, comparing: Dayjs) => {
    return date.isSame(comparing, 'day');
  };

  public isSameHour = (date: Dayjs, comparing: Dayjs) => {
    return date.isSame(comparing, 'hour');
  };

  public isAfter = (date: Dayjs, value: Dayjs) => {
    return date.isAfter(value);
  };

  public isAfterYear = (date: Dayjs, value: Dayjs) => {
    return date.isAfter(value, 'year');
  };

  public isAfterDay = (date: Dayjs, value: Dayjs) => {
    return date.isAfter(value, 'day');
  };

  public isBefore = (date: Dayjs, value: Dayjs) => {
    return date.isBefore(value);
  };

  public isBeforeYear = (date: Dayjs, value: Dayjs) => {
    return date.isBefore(value, 'year');
  };

  public isBeforeDay = (date: Dayjs, value: Dayjs) => {
    return date.isBefore(value, 'day');
  };

  public isWithinRange = (date: Dayjs, [start, end]: [Dayjs, Dayjs]) => {
    return date.isBetween(start, end, null, '[]');
  };

  public startOfYear = (date: Dayjs) => {
    return date.startOf('year');
  };

  public startOfMonth = (date: Dayjs) => {
    return date.startOf('month');
  };

  public endOfYear = (date: Dayjs) => {
    return date.endOf('year');
  };

  public startOfWeek = (date: Dayjs) => {
    return date.startOf('week');
  };

  public startOfDay = (date: Dayjs) => {
    return date.startOf('day');
  };

  public endOfMonth = (date: Dayjs) => {
    return date.endOf('month');
  };

  public endOfWeek = (date: Dayjs) => {
    return date.endOf('week');
  };

  public endOfDay = (date: Dayjs) => {
    return date.endOf('day');
  };

  public addYears = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'year') : date.add(count, 'year');
  };

  public addMonths = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'month') : date.add(count, 'month');
  };

  public addWeeks = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'week') : date.add(count, 'week');
  };

  public addDays = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'day') : date.add(count, 'day');
  };

  public addHours = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'hour') : date.add(count, 'hour');
  };

  public addMinutes = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'minute') : date.add(count, 'minute');
  };

  public addSeconds = (date: Dayjs, count: number) => {
    return count < 0 ? date.subtract(Math.abs(count), 'second') : date.add(count, 'second');
  };

  public getYear = (date: Dayjs) => {
    return date.year();
  };

  public getMonth = (date: Dayjs) => {
    return date.month();
  };

  public getDate = (date: Dayjs) => {
    return date.date();
  };

  public getHours = (date: Dayjs) => {
    return date.hour();
  };

  public getMinutes = (date: Dayjs) => {
    return date.minute();
  };

  public getSeconds = (date: Dayjs) => {
    return date.second();
  };

  public setYear = (date: Dayjs, year: number) => {
    return date.set('year', year);
  };

  public setMonth = (date: Dayjs, count: number) => {
    return date.set('month', count);
  };

  public setDate = (date: Dayjs, count: number) => {
    return date.set('date', count);
  };

  public setHours = (date: Dayjs, count: number) => {
    return date.set('hour', count);
  };

  public setMinutes = (date: Dayjs, count: number) => {
    return date.set('minute', count);
  };

  public setSeconds = (date: Dayjs, count: number) => {
    return date.set('second', count);
  };

  public getDaysInMonth = (date: Dayjs) => {
    return date.daysInMonth();
  };

  public getNextMonth = (date: Dayjs) => {
    return date.add(1, 'month');
  };

  public getPreviousMonth = (date: Dayjs) => {
    return date.subtract(1, 'month');
  };

  public getMonthArray = (date: Dayjs) => {
    const firstMonth = date.startOf('year');
    const monthArray = [firstMonth];

    while (monthArray.length < 12) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public mergeDateAndTime = (date: Dayjs, time: Dayjs) => {
    return date.hour(time.hour()).minute(time.minute()).second(time.second());
  };

  public getWeekdays = () => {
    const start = this.dayjs().startOf('week');
    return [0, 1, 2, 3, 4, 5, 6].map((diff) => this.formatByString(start.add(diff, 'day'), 'dd'));
  };

  public getWeekArray = (date: Dayjs) => {
    const start = this.dayjs(date).startOf('month').startOf('week');
    const end = this.dayjs(date).endOf('month').endOf('week');

    let count = 0;
    let current = start;
    const nestedWeeks: Dayjs[][] = [];

    while (current.isBefore(end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = current.add(1, 'day');
      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (date: Dayjs) => {
    return date.week();
  };

  public getYearRange = (start: Dayjs, end: Dayjs) => {
    const startDate = this.dayjs(start).startOf('year');
    const endDate = this.dayjs(end).endOf('year');
    const years: Dayjs[] = [];

    let current = startDate;
    while (current.isBefore(endDate)) {
      years.push(current);
      current = current.add(1, 'year');
    }

    return years;
  };

  public getMeridiemText = (ampm: 'am' | 'pm') => {
    return ampm === 'am' ? 'AM' : 'PM';
  };
}
