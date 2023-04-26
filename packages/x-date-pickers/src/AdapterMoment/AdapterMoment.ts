/* eslint-disable class-methods-use-this */
import defaultMoment, { Moment, LongDateFormatKey } from 'moment';
import { AdapterFormats, AdapterUnits, FieldFormatTokenMap, MuiPickersAdapter } from '../models';

interface AdapterMomentOptions {
  locale?: string;
  instance?: typeof defaultMoment;
  formats?: Partial<AdapterFormats>;
}

// From https://momentjs.com/docs/#/displaying/format/
const formatTokenMap: FieldFormatTokenMap = {
  // Year
  Y: 'year',
  YY: 'year',
  YYYY: 'year',

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
  E: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  e: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
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
  k: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  kk: 'hours',

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

/**
 * Based on `@date-io/moment`
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
export class AdapterMoment implements MuiPickersAdapter<Moment> {
  public isMUIAdapter = true;

  public lib = 'moment';

  public moment: typeof defaultMoment;

  public locale?: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats, instance }: AdapterMomentOptions = {}) {
    this.moment = instance || defaultMoment;
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };
  }

  public date = (value?: any) => {
    if (value === null) {
      return null;
    }

    const moment = this.moment(value);
    moment.locale(this.getCurrentLocaleCode());

    return moment;
  };

  public toJsDate = (value: Moment) => {
    return value.toDate();
  };

  public parseISO = (isoString: string) => {
    return this.moment(isoString, true);
  };

  public toISO = (value: Moment) => {
    return value.toISOString();
  };

  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    if (this.locale) {
      return this.moment(value, format, this.locale, true);
    }

    return this.moment(value, format, true);
  };

  public getCurrentLocaleCode = () => {
    return this.locale || defaultMoment.locale();
  };

  public is12HourCycleInCurrentLocale = () => {
    return /A|a/.test(defaultMoment.localeData(this.getCurrentLocaleCode()).longDateFormat('LT'));
  };

  public expandFormat = (format: string) => {
    // @see https://github.com/moment/moment/blob/develop/src/lib/format/format.js#L6
    const localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})|./g;

    return format
      .match(localFormattingTokens)!
      .map((token) => {
        const firstCharacter = token[0];
        if (firstCharacter === 'L' || firstCharacter === ';') {
          return defaultMoment
            .localeData(this.getCurrentLocaleCode())
            .longDateFormat(token as LongDateFormatKey);
        }

        return token;
      })
      .join('');
  };

  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
  };

  public isNull = (value: Moment | null) => {
    return value === null;
  };

  public isValid = (value: any) => {
    return this.moment(value).isValid();
  };

  public format = (value: Moment, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Moment, formatString: string) => {
    const clonedDate = value.clone();
    clonedDate.locale(this.getCurrentLocaleCode());
    return clonedDate.format(formatString);
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public getDiff = (value: Moment, comparing: Moment | string, unit?: AdapterUnits) => {
    return value.diff(comparing, unit);
  };

  public isEqual = (value: any, comparing: any) => {
    if (value === null && comparing === null) {
      return true;
    }

    return this.moment(value).isSame(comparing);
  };

  public isSameYear = (value: Moment, comparing: Moment) => {
    return value.isSame(comparing, 'year');
  };

  public isSameMonth = (value: Moment, comparing: Moment) => {
    return value.isSame(comparing, 'month');
  };

  public isSameDay = (value: Moment, comparing: Moment) => {
    return value.isSame(comparing, 'day');
  };

  public isSameHour = (value: Moment, comparing: Moment) => {
    return value.isSame(comparing, 'hour');
  };

  public isAfter = (value: Moment, comparing: Moment) => {
    return value.isAfter(comparing);
  };

  public isAfterYear = (value: Moment, comparing: Moment) => {
    return value.isAfter(comparing, 'year');
  };

  public isAfterDay = (value: Moment, comparing: Moment) => {
    return value.isAfter(comparing, 'day');
  };

  public isBefore = (value: Moment, comparing: Moment) => {
    return value.isBefore(comparing);
  };

  public isBeforeYear = (value: Moment, comparing: Moment) => {
    return value.isBefore(comparing, 'year');
  };

  public isBeforeDay = (value: Moment, comparing: Moment) => {
    return value.isBefore(comparing, 'day');
  };

  public isWithinRange = (value: Moment, [start, end]: [Moment, Moment]) => {
    return value.isBetween(start, end, null, '[]');
  };

  public startOfYear = (value: Moment) => {
    return value.clone().startOf('year');
  };

  public startOfMonth = (value: Moment) => {
    return value.clone().startOf('month');
  };

  public startOfWeek = (value: Moment) => {
    return value.clone().startOf('week');
  };

  public startOfDay = (value: Moment) => {
    return value.clone().startOf('day');
  };

  public endOfYear = (value: Moment) => {
    return value.clone().endOf('year');
  };

  public endOfMonth = (value: Moment) => {
    return value.clone().endOf('month');
  };

  public endOfWeek = (value: Moment) => {
    return value.clone().endOf('week');
  };

  public endOfDay = (value: Moment) => {
    return value.clone().endOf('day');
  };

  public addYears = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'years')
      : value.clone().add(amount, 'years');
  };

  public addMonths = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'months')
      : value.clone().add(amount, 'months');
  };

  public addWeeks = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'weeks')
      : value.clone().add(amount, 'weeks');
  };

  public addDays = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'days')
      : value.clone().add(amount, 'days');
  };

  public addHours = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'hours')
      : value.clone().add(amount, 'hours');
  };

  public addMinutes = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'minutes')
      : value.clone().add(amount, 'minutes');
  };

  public addSeconds = (value: Moment, amount: number) => {
    return amount < 0
      ? value.clone().subtract(Math.abs(amount), 'seconds')
      : value.clone().add(amount, 'seconds');
  };

  public getYear = (value: Moment) => {
    return value.get('year');
  };

  public getMonth = (value: Moment) => {
    return value.get('month');
  };

  public getDate = (value: Moment) => {
    return value.get('date');
  };

  public getHours = (value: Moment) => {
    return value.get('hours');
  };

  public getMinutes = (value: Moment) => {
    return value.get('minutes');
  };

  public getSeconds = (value: Moment) => {
    return value.get('seconds');
  };

  public setYear = (value: Moment, year: number) => {
    return value.clone().year(year);
  };

  public setMonth = (value: Moment, month: number) => {
    return value.clone().month(month);
  };

  public setDate = (value: Moment, date: number) => {
    return value.clone().date(date);
  };

  public setHours = (value: Moment, hours: number) => {
    return value.clone().hours(hours);
  };

  public setMinutes = (value: Moment, minutes: number) => {
    return value.clone().minutes(minutes);
  };

  public setSeconds = (value: Moment, seconds: number) => {
    return value.clone().seconds(seconds);
  };

  public getDaysInMonth = (value: Moment) => {
    return value.daysInMonth();
  };

  public getNextMonth = (value: Moment) => {
    return value.clone().add(1, 'month');
  };

  public getPreviousMonth = (value: Moment) => {
    return value.clone().subtract(1, 'month');
  };

  public getMonthArray = (value: Moment) => {
    const firstMonth = value.clone().startOf('year');
    const monthArray = [firstMonth];

    while (monthArray.length < 12) {
      const prevMonth = monthArray[monthArray.length - 1];
      monthArray.push(this.getNextMonth(prevMonth));
    }

    return monthArray;
  };

  public mergeDateAndTime = (dateParam: Moment, timeParam: Moment) => {
    return dateParam
      .clone()
      .hour(timeParam.hour())
      .minute(timeParam.minute())
      .second(timeParam.second());
  };

  public getWeekdays = () => {
    return defaultMoment.weekdaysShort(true);
  };

  public getWeekArray = (value: Moment) => {
    const start = value.clone().startOf('month').startOf('week');
    const end = value.clone().endOf('month').endOf('week');

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
    return value.week();
  };

  public getYearRange = (start: Moment, end: Moment) => {
    const startDate = this.moment(start).startOf('year');
    const endDate = this.moment(end).endOf('year');
    const years: Moment[] = [];

    let current = startDate;
    while (current.isBefore(endDate)) {
      years.push(current);
      current = current.clone().add(1, 'year');
    }

    return years;
  };

  public getMeridiemText = (ampm: 'am' | 'pm') => {
    if (this.is12HourCycleInCurrentLocale()) {
      // AM/PM translation only possible in those who have 12 hour cycle in locale.
      return this.moment
        .localeData(this.getCurrentLocaleCode())
        .meridiem(ampm === 'am' ? 0 : 13, 0, false);
    }

    return ampm === 'am' ? 'AM' : 'PM'; // fallback for de, ru, ...etc
  };
}
