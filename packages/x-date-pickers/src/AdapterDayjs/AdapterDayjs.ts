/* eslint-disable class-methods-use-this */
import defaultDayjs, { Dayjs } from 'dayjs';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import {
  FieldFormatTokenMap,
  MuiPickersAdapter,
  AdapterFormats,
  AdapterOptions,
  PickersTimezone,
  DateBuilderReturnType,
} from '../models';
import { warnOnce } from '../internals/utils/warning';

defaultDayjs.extend(localizedFormatPlugin);
defaultDayjs.extend(weekOfYearPlugin);
defaultDayjs.extend(isBetweenPlugin);
defaultDayjs.extend(advancedFormatPlugin);

type Constructor = (...args: Parameters<typeof defaultDayjs>) => Dayjs;

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
  year: 'YYYY',
  month: 'MMMM',
  monthShort: 'MMM',
  dayOfMonth: 'D',
  dayOfMonthFull: 'Do',
  weekday: 'dddd',
  weekdayShort: 'dd',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'A',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'll',
  keyboardDate: 'L',
  shortDate: 'MMM D',
  normalDate: 'D MMMM',
  normalDateWithWeekday: 'ddd, MMM D',

  fullTime: 'LT',
  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',

  keyboardDateTime: 'L LT',
  keyboardDateTime12h: 'L hh:mm A',
  keyboardDateTime24h: 'L HH:mm',
};

const MISSING_UTC_PLUGIN = [
  'Missing UTC plugin',
  'To be able to use UTC or timezones, you have to enable the `utc` plugin',
  'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-utc',
].join('\n');

const MISSING_TIMEZONE_PLUGIN = [
  'Missing timezone plugin',
  'To be able to use timezones, you have to enable both the `utc` and the `timezone` plugin',
  'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-timezone',
].join('\n');

const withLocale = (dayjs: any, locale?: string): Constructor =>
  !locale ? dayjs : (...args) => dayjs(...args).locale(locale);

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    dayjs: Dayjs;
  }
}

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
export class AdapterDayjs implements MuiPickersAdapter<Dayjs, string> {
  public isMUIAdapter = true;

  public isTimezoneCompatible = true;

  public lib = 'dayjs';

  public dayjs: Constructor;

  public locale?: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats }: AdapterOptions<string, never> = {}) {
    this.dayjs = withLocale(defaultDayjs, locale);
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };

    // Moved plugins to the constructor to allow for users to use options on the library
    // for reference: https://github.com/mui/mui-x/pull/11151
    defaultDayjs.extend(customParseFormatPlugin);
  }

  private setLocaleToValue = (value: Dayjs) => {
    const expectedLocale = this.getCurrentLocaleCode();
    if (expectedLocale === value.locale()) {
      return value;
    }

    return value.locale(expectedLocale);
  };

  private hasUTCPlugin = () => typeof defaultDayjs.utc !== 'undefined';

  private hasTimezonePlugin = () => typeof defaultDayjs.tz !== 'undefined';

  private isSame = (value: Dayjs, comparing: Dayjs, comparisonTemplate: string) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value))!;

    return value.format(comparisonTemplate) === comparingInValueTimezone.format(comparisonTemplate);
  };

  /**
   * Replaces "default" by undefined and "system" by the system timezone before passing it to `dayjs`.
   */
  private cleanTimezone = (timezone: string) => {
    switch (timezone) {
      case 'default': {
        return undefined;
      }
      case 'system': {
        return defaultDayjs.tz.guess();
      }
      default: {
        return timezone;
      }
    }
  };

  private createSystemDate = (value: string | undefined): Dayjs => {
    if (this.hasUTCPlugin() && this.hasTimezonePlugin()) {
      const timezone = defaultDayjs.tz.guess();

      // We can't change the system timezone in the tests
      /* istanbul ignore next */
      if (timezone !== 'UTC') {
        return defaultDayjs.tz(value, timezone);
      }

      return defaultDayjs(value);
    }

    return defaultDayjs(value);
  };

  private createUTCDate = (value: string | undefined): Dayjs => {
    /* istanbul ignore next */
    if (!this.hasUTCPlugin()) {
      throw new Error(MISSING_UTC_PLUGIN);
    }

    return defaultDayjs.utc(value);
  };

  private createTZDate = (value: string | undefined, timezone: PickersTimezone): Dayjs => {
    /* istanbul ignore next */
    if (!this.hasUTCPlugin()) {
      throw new Error(MISSING_UTC_PLUGIN);
    }

    /* istanbul ignore next */
    if (!this.hasTimezonePlugin()) {
      throw new Error(MISSING_TIMEZONE_PLUGIN);
    }

    const keepLocalTime = value !== undefined && !value.endsWith('Z');
    return defaultDayjs(value).tz(this.cleanTimezone(timezone), keepLocalTime);
  };

  private getLocaleFormats = () => {
    const locales = defaultDayjs.Ls;
    const locale = this.locale || 'en';

    let localeObject = locales[locale];

    if (localeObject === undefined) {
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X: Your locale has not been found.',
          'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale.',
          "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
          'fallback on English locale.',
        ]);
      }
      localeObject = locales.en;
    }

    return localeObject.formats;
  };

  /**
   * If the new day does not have the same offset as the old one (when switching to summer day time for example),
   * Then dayjs will not automatically adjust the offset (moment does).
   * We have to parse again the value to make sure the `fixOffset` method is applied.
   * See https://github.com/iamkun/dayjs/blob/b3624de619d6e734cd0ffdbbd3502185041c1b60/src/plugin/timezone/index.js#L72
   */
  private adjustOffset = (value: Dayjs) => {
    if (!this.hasTimezonePlugin()) {
      return value;
    }

    const timezone = this.getTimezone(value);
    if (timezone !== 'UTC') {
      const fixedValue = value.tz(this.cleanTimezone(timezone), true);
      // @ts-ignore
      if (fixedValue.$offset === (value.$offset ?? 0)) {
        return value;
      }
      // Change only what is needed to avoid creating a new object with unwanted data
      // Especially important when used in an environment where utc or timezone dates are used only in some places
      // Reference: https://github.com/mui/mui-x/issues/13290
      // @ts-ignore
      value.$offset = fixedValue.$offset;
    }

    return value;
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone: PickersTimezone = 'default',
  ): DateBuilderReturnType<T, Dayjs> => {
    type R = DateBuilderReturnType<T, Dayjs>;
    if (value === null) {
      return <R>null;
    }

    let parsedValue: Dayjs;
    if (timezone === 'UTC') {
      parsedValue = this.createUTCDate(value);
    } else if (timezone === 'system' || (timezone === 'default' && !this.hasTimezonePlugin())) {
      parsedValue = this.createSystemDate(value);
    } else {
      parsedValue = this.createTZDate(value, timezone);
    }

    if (this.locale === undefined) {
      return <R>parsedValue;
    }

    return <R>parsedValue.locale(this.locale);
  };

  public getInvalidDate = () => defaultDayjs(new Date('Invalid date'));

  public getTimezone = (value: Dayjs): string => {
    if (this.hasTimezonePlugin()) {
      // @ts-ignore
      const zone = value.$x?.$timezone;

      if (zone) {
        return zone;
      }
    }

    if (this.hasUTCPlugin() && value.isUTC()) {
      return 'UTC';
    }

    return 'system';
  };

  public setTimezone = (value: Dayjs, timezone: PickersTimezone): Dayjs => {
    if (this.getTimezone(value) === timezone) {
      return value;
    }

    if (timezone === 'UTC') {
      /* istanbul ignore next */
      if (!this.hasUTCPlugin()) {
        throw new Error(MISSING_UTC_PLUGIN);
      }

      return value.utc();
    }

    // We know that we have the UTC plugin.
    // Otherwise, the value timezone would always equal "system".
    // And it would be caught by the first "if" of this method.
    if (timezone === 'system') {
      return value.local();
    }

    if (!this.hasTimezonePlugin()) {
      if (timezone === 'default') {
        return value;
      }

      /* istanbul ignore next */
      throw new Error(MISSING_TIMEZONE_PLUGIN);
    }

    return defaultDayjs.tz(value, this.cleanTimezone(timezone));
  };

  public toJsDate = (value: Dayjs) => {
    return value.toDate();
  };

  public parse = (value: string, format: string) => {
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

  public isValid = (value: Dayjs | null) => {
    if (value == null) {
      return false;
    }

    return value.isValid();
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

  public isEqual = (value: Dayjs | null, comparing: Dayjs | null) => {
    if (value === null && comparing === null) {
      return true;
    }

    if (value === null || comparing === null) {
      return false;
    }

    return value.toDate().getTime() === comparing.toDate().getTime();
  };

  public isSameYear = (value: Dayjs, comparing: Dayjs) => {
    return this.isSame(value, comparing, 'YYYY');
  };

  public isSameMonth = (value: Dayjs, comparing: Dayjs) => {
    return this.isSame(value, comparing, 'YYYY-MM');
  };

  public isSameDay = (value: Dayjs, comparing: Dayjs) => {
    return this.isSame(value, comparing, 'YYYY-MM-DD');
  };

  public isSameHour = (value: Dayjs, comparing: Dayjs) => {
    return value.isSame(comparing, 'hour');
  };

  public isAfter = (value: Dayjs, comparing: Dayjs) => {
    return value > comparing;
  };

  public isAfterYear = (value: Dayjs, comparing: Dayjs) => {
    if (!this.hasUTCPlugin()) {
      return value.isAfter(comparing, 'year');
    }

    return !this.isSameYear(value, comparing) && value.utc() > comparing.utc();
  };

  public isAfterDay = (value: Dayjs, comparing: Dayjs) => {
    if (!this.hasUTCPlugin()) {
      return value.isAfter(comparing, 'day');
    }

    return !this.isSameDay(value, comparing) && value.utc() > comparing.utc();
  };

  public isBefore = (value: Dayjs, comparing: Dayjs) => {
    return value < comparing;
  };

  public isBeforeYear = (value: Dayjs, comparing: Dayjs) => {
    if (!this.hasUTCPlugin()) {
      return value.isBefore(comparing, 'year');
    }

    return !this.isSameYear(value, comparing) && value.utc() < comparing.utc();
  };

  public isBeforeDay = (value: Dayjs, comparing: Dayjs) => {
    if (!this.hasUTCPlugin()) {
      return value.isBefore(comparing, 'day');
    }

    return !this.isSameDay(value, comparing) && value.utc() < comparing.utc();
  };

  public isWithinRange = (value: Dayjs, [start, end]: [Dayjs, Dayjs]) => {
    return value >= start && value <= end;
  };

  public startOfYear = (value: Dayjs) => {
    return this.adjustOffset(value.startOf('year'));
  };

  public startOfMonth = (value: Dayjs) => {
    return this.adjustOffset(value.startOf('month'));
  };

  public startOfWeek = (value: Dayjs) => {
    return this.adjustOffset(value.startOf('week'));
  };

  public startOfDay = (value: Dayjs) => {
    return this.adjustOffset(value.startOf('day'));
  };

  public endOfYear = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('year'));
  };

  public endOfMonth = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('month'));
  };

  public endOfWeek = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('week'));
  };

  public endOfDay = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('day'));
  };

  public addYears = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'year') : value.add(amount, 'year'),
    );
  };

  public addMonths = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'month') : value.add(amount, 'month'),
    );
  };

  public addWeeks = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'week') : value.add(amount, 'week'),
    );
  };

  public addDays = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'day') : value.add(amount, 'day'),
    );
  };

  public addHours = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'hour') : value.add(amount, 'hour'),
    );
  };

  public addMinutes = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'minute') : value.add(amount, 'minute'),
    );
  };

  public addSeconds = (value: Dayjs, amount: number) => {
    return this.adjustOffset(
      amount < 0 ? value.subtract(Math.abs(amount), 'second') : value.add(amount, 'second'),
    );
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

  public getMilliseconds = (value: Dayjs) => {
    return value.millisecond();
  };

  public setYear = (value: Dayjs, year: number) => {
    return this.adjustOffset(value.set('year', year));
  };

  public setMonth = (value: Dayjs, month: number) => {
    return this.adjustOffset(value.set('month', month));
  };

  public setDate = (value: Dayjs, date: number) => {
    return this.adjustOffset(value.set('date', date));
  };

  public setHours = (value: Dayjs, hours: number) => {
    return this.adjustOffset(value.set('hour', hours));
  };

  public setMinutes = (value: Dayjs, minutes: number) => {
    return this.adjustOffset(value.set('minute', minutes));
  };

  public setSeconds = (value: Dayjs, seconds: number) => {
    return this.adjustOffset(value.set('second', seconds));
  };

  public setMilliseconds = (value: Dayjs, milliseconds: number) => {
    return this.adjustOffset(value.set('millisecond', milliseconds));
  };

  public getDaysInMonth = (value: Dayjs) => {
    return value.daysInMonth();
  };

  public getWeekArray = (value: Dayjs) => {
    const cleanValue = this.setLocaleToValue(value);
    const start = this.startOfWeek(this.startOfMonth(cleanValue));
    const end = this.endOfWeek(this.endOfMonth(cleanValue));

    let count = 0;
    let current = start;
    const nestedWeeks: Dayjs[][] = [];

    while (current < end) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
      nestedWeeks[weekNumber].push(current);

      current = this.addDays(current, 1);

      count += 1;
    }

    return nestedWeeks;
  };

  public getWeekNumber = (value: Dayjs) => {
    return value.week();
  };

  public getDayOfWeek(value: Dayjs): number {
    return value.day() + 1;
  }

  public getYearRange = ([start, end]: [Dayjs, Dayjs]) => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years: Dayjs[] = [];

    let current = startDate;
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };
}
