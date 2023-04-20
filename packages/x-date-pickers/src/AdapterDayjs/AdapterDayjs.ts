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

interface AdapterDayjsOptions {
  locale?: string;
  /** Make sure that your dayjs instance extends customParseFormat and advancedFormat */
  instance?: typeof defaultDayjs;
  formats?: Partial<AdapterFormats>;
}

type Constructor = (...args: Parameters<typeof defaultDayjs>) => Dayjs;

const localeNotFoundWarning = buildWarning([
  'Your locale has not been found.',
  'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale',
  "Or you forget to import the locale with `require('dayjs/locale/{localeUsed}')`",
  'fallback on English locale',
]);

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  YY: 'year',
  YYYY: { sectionType: 'year', contentType: 'digit', maxLength: 4 },

  // Month
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  D: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  DD: 'day',
  Do: { sectionType: 'day', contentType: 'digit-with-letter' },

  // Day of the week
  d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
  dd: { sectionType: 'weekDay', contentType: 'letter' },
  ddd: { sectionType: 'weekDay', contentType: 'letter' },
  dddd: { sectionType: 'weekDay', contentType: 'letter' },

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

  public lib = 'dayjs';

  public rawDayJsInstance: typeof defaultDayjs;

  public dayjs: Constructor;

  public locale?: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats, instance }: AdapterDayjsOptions = {}) {
    this.rawDayJsInstance = instance || defaultDayjs;
    this.dayjs = withLocale(this.rawDayJsInstance, locale);
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };

    defaultDayjs.extend(weekOfYear);
  }

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

  public isNull = (value: Dayjs | null) => {
    return value === null;
  };

  public isValid = (value: any) => {
    return this.dayjs(value).isValid();
  };

  public format = (value: Dayjs, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Dayjs, formatString: string) => {
    return this.dayjs(value).format(formatString);
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public getDiff = (value: Dayjs, comparing: Dayjs, unit?: AdapterUnits) => {
    return value.diff(comparing, unit as AdapterUnits);
  };

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
    }

    return this.dayjs(value).isSame(comparing);
  };

  public isSameYear = (value: Dayjs, comparing: Dayjs) => {
    return value.isSame(comparing, 'year');
  };

  public isSameMonth = (value: Dayjs, comparing: Dayjs) => {
    return value.isSame(comparing, 'month');
  };

  public isSameDay = (value: Dayjs, comparing: Dayjs) => {
    return value.isSame(comparing, 'day');
  };

  public isSameHour = (value: Dayjs, comparing: Dayjs) => {
    return value.isSame(comparing, 'hour');
  };

  public isAfter = (value: Dayjs, comparing: Dayjs) => {
    return value.isAfter(comparing);
  };

  public isAfterYear = (date: Dayjs, comparing: Dayjs) => {
    return date.isAfter(comparing, 'year');
  };

  public isAfterDay = (date: Dayjs, comparing: Dayjs) => {
    return date.isAfter(comparing, 'day');
  };

  public isBefore = (date: Dayjs, comparing: Dayjs) => {
    return date.isBefore(comparing);
  };

  public isBeforeYear = (date: Dayjs, comparing: Dayjs) => {
    return date.isBefore(comparing, 'year');
  };

  public isBeforeDay = (date: Dayjs, comparing: Dayjs) => {
    return date.isBefore(comparing, 'day');
  };

  public isWithinRange = (date: Dayjs, [start, end]: [Dayjs, Dayjs]) => {
    return date.isBetween(start, end, null, '[]');
  };

  public startOfYear = (value: Dayjs) => {
    return value.startOf('year');
  };

  public startOfMonth = (value: Dayjs) => {
    return value.startOf('month');
  };

  public startOfWeek = (value: Dayjs) => {
    return value.startOf('week');
  };

  public startOfDay = (value: Dayjs) => {
    return value.startOf('day');
  };

  public endOfYear = (value: Dayjs) => {
    return value.endOf('year');
  };

  public endOfMonth = (value: Dayjs) => {
    return value.endOf('month');
  };

  public endOfWeek = (value: Dayjs) => {
    return value.endOf('week');
  };

  public endOfDay = (value: Dayjs) => {
    return value.endOf('day');
  };

  public addYears = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'year') : value.add(amount, 'year');
  };

  public addMonths = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'month') : value.add(amount, 'month');
  };

  public addWeeks = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'week') : value.add(amount, 'week');
  };

  public addDays = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'day') : value.add(amount, 'day');
  };

  public addHours = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'hour') : value.add(amount, 'hour');
  };

  public addMinutes = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'minute') : value.add(amount, 'minute');
  };

  public addSeconds = (value: Dayjs, amount: number) => {
    return amount < 0 ? value.subtract(Math.abs(amount), 'second') : value.add(amount, 'second');
  };

  public getYear = (value: Dayjs) => {
    return value.year();
  };

  public getMonth = (value: Dayjs) => {
    return value.month();
  };

  public getDate = (value: Dayjs) => {
    return value.date();
  };

  public getHours = (value: Dayjs) => {
    return value.hour();
  };

  public getMinutes = (value: Dayjs) => {
    return value.minute();
  };

  public getSeconds = (value: Dayjs) => {
    return value.second();
  };

  public setYear = (value: Dayjs, year: number) => {
    return value.set('year', year);
  };

  public setMonth = (value: Dayjs, month: number) => {
    return value.set('month', month);
  };

  public setDate = (value: Dayjs, date: number) => {
    return value.set('date', date);
  };

  public setHours = (value: Dayjs, hours: number) => {
    return value.set('hour', hours);
  };

  public setMinutes = (value: Dayjs, minutes: number) => {
    return value.set('minute', minutes);
  };

  public setSeconds = (value: Dayjs, seconds: number) => {
    return value.set('second', seconds);
  };

  public getDaysInMonth = (value: Dayjs) => {
    return value.daysInMonth();
  };

  public getNextMonth = (value: Dayjs) => {
    return value.add(1, 'month');
  };

  public getPreviousMonth = (value: Dayjs) => {
    return value.subtract(1, 'month');
  };

  public getMonthArray = (value: Dayjs) => {
    const firstMonth = value.startOf('year');
    const monthArray = [firstMonth];

    while (monthArray.length < 12) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public mergeDateAndTime = (dateParam: Dayjs, timeParam: Dayjs) => {
    return dateParam.hour(timeParam.hour()).minute(timeParam.minute()).second(timeParam.second());
  };

  public getWeekdays = () => {
    const start = this.dayjs().startOf('week');
    return [0, 1, 2, 3, 4, 5, 6].map((diff) => this.formatByString(start.add(diff, 'day'), 'dd'));
  };

  public getWeekArray = (value: Dayjs) => {
    const start = value.startOf('month').startOf('week');
    const end = value.endOf('month').endOf('week');

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

  public getWeekNumber = (value: Dayjs) => {
    return value.week();
  };

  public getYearRange = (start: Dayjs, end: Dayjs) => {
    const startDate = start.startOf('year');
    const endDate = end.endOf('year');
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
