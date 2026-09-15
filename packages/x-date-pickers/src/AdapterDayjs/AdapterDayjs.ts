/* v8 ignore start */
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
// dayjs has no exports field defined
// See https://github.com/iamkun/dayjs/issues/2562
/* eslint-disable import/extensions */
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear.js';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat.js';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat.js';
import isBetweenPlugin from 'dayjs/plugin/isBetween.js';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat.js';
/* v8 ignore stop */
/* eslint-enable import/extensions */
import { warnOnce } from '@mui/x-internals/warning';
import type {
  FieldFormatTokenMap,
  MuiPickersAdapter,
  AdapterFormats,
  AdapterOptions,
  PickersTimezone,
  DateBuilderReturnType,
} from '../models';

dayjs.extend(localizedFormatPlugin);
dayjs.extend(weekOfYearPlugin);
dayjs.extend(isBetweenPlugin);
dayjs.extend(advancedFormatPlugin);

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

  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',

  keyboardDateTime12h: 'L hh:mm A',
  keyboardDateTime24h: 'L HH:mm',
};

function throwMissingUTCPluginError() {
  throw new Error(
    'MUI X Date Pickers: Missing dayjs UTC plugin. ' +
      'UTC and timezone support requires the dayjs UTC plugin to be enabled. ' +
      'See https://mui.com/x/react-date-pickers/timezone/#day-js-and-utc for setup instructions.',
  );
}

function throwMissingTimezonePluginError() {
  throw new Error(
    'MUI X Date Pickers: Missing dayjs timezone plugin. ' +
      'Timezone support requires both the dayjs UTC and timezone plugins to be enabled. ' +
      'See https://mui.com/x/react-date-pickers/timezone/#day-js-and-timezone for setup instructions.',
  );
}

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
export class AdapterDayjs implements MuiPickersAdapter<string> {
  public isMUIAdapter = true;

  public isTimezoneCompatible = true;

  public lib = 'dayjs';

  public locale?: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats }: AdapterOptions<string, never> = {}) {
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };

    // Moved plugins to the constructor to allow for users to use options on the library
    // for reference: https://github.com/mui/mui-x/pull/11151
    dayjs.extend(customParseFormatPlugin);
  }

  private setLocaleToValue = (value: Dayjs) => {
    const expectedLocale = this.getCurrentLocaleCode();
    if (expectedLocale === value.locale()) {
      return value;
    }

    return value.locale(expectedLocale);
  };

  private hasUTCPlugin = () => typeof dayjs.utc !== 'undefined';

  private hasTimezonePlugin = () => typeof dayjs.tz !== 'undefined';

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
        return dayjs.tz.guess();
      }
      default: {
        return timezone;
      }
    }
  };

  private createSystemDate = (value: string | undefined): Dayjs => {
    return this.setLocaleToValue(dayjs(value));
  };

  private createUTCDate = (value: string | undefined): Dayjs => {
    /* v8 ignore next 3 */
    if (!this.hasUTCPlugin()) {
      throwMissingUTCPluginError();
    }

    return this.setLocaleToValue(dayjs.utc(value));
  };

  private createTZDate = (value: string | undefined, timezone: PickersTimezone): Dayjs => {
    /* v8 ignore next 3 */
    if (!this.hasUTCPlugin()) {
      throwMissingUTCPluginError();
    }

    /* v8 ignore next 3 */
    if (!this.hasTimezonePlugin()) {
      throwMissingTimezonePluginError();
    }

    const keepLocalTime = value !== undefined && !value.endsWith('Z');

    return this.setLocaleToValue(dayjs(value).tz(this.cleanTimezone(timezone), keepLocalTime));
  };

  private getLocaleFormats = () => {
    const locales = dayjs.Ls;
    const locale = this.locale || 'en';

    let localeObject = locales[locale];

    if (localeObject === undefined) {
      /* v8 ignore start */
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X: Your locale has not been found.',
          'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale.',
          "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
          'fallback on English locale.',
        ]);
      }
      /* v8 ignore stop */
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
  protected adjustOffset = (value: Dayjs) => {
    if (!this.hasTimezonePlugin()) {
      return value;
    }

    const timezone = this.getTimezone(value);
    if (timezone !== 'UTC') {
      const fixedValue = value.tz(this.cleanTimezone(timezone), true);
      // TODO: Simplify the case when we raise the `dayjs` peer dep to 1.11.12 (https://github.com/iamkun/dayjs/releases/tag/v1.11.12)
      /* v8 ignore next 3 */
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

  /**
   * Before a timezone was standardized, IANA falls back on the Local Mean Time of the location, whose
   * offset is not a round number of minutes (`Asia/Kolkata` is `GMT+05:53:28`). `dayjs` mishandles those
   * offsets. `system` and `UTC` values keep an offset that matches their instant, so they are immune.
   */
  private isAffectedByLocalMeanTime = (value: Dayjs) => {
    const timezone = this.getTimezone(value);

    return this.hasUTCPlugin() && timezone !== 'system' && timezone !== 'UTC';
  };

  /**
   * The wall clock of the value, as a plain UTC value on which `dayjs` is reliable.
   * Returns `null` when the value cannot round-trip through the ISO format: years above 9999 don't,
   * and an invalid value formats to `Invalid Date`.
   */
  private getWallClock = (value: Dayjs) => {
    const wallClock = this.setLocaleToValue(dayjs.utc(value.format('YYYY-MM-DDTHH:mm:ss.SSS')));

    return wallClock.isValid() ? wallClock : null;
  };

  /**
   * On the dates described by `isAffectedByLocalMeanTime`, `dayjs` moves the day of the month when only
   * the year or the month was meant to change.
   * `daysInMonth()` is unusable on such a value because it derives from the equally broken
   * `endOf('month')`, hence computing it on the wall clock instead.
   * See https://github.com/mui/mui-x/issues/23163
   */
  private restoreDayOfMonth = (value: Dayjs, reference: Dayjs) => {
    if (!this.isAffectedByLocalMeanTime(value)) {
      return value;
    }

    const wallClock = this.getWallClock(value);
    if (wallClock === null) {
      return value;
    }

    // A shorter target month legitimately clamps the day (`Jan 31` + 1 month is `Feb 28`).
    const expectedDayOfMonth = Math.min(reference.date(), wallClock.daysInMonth());
    if (value.date() === expectedDayOfMonth) {
      return value;
    }

    return value.set('date', expectedDayOfMonth);
  };

  /**
   * `dayjs` computes `startOf` and `endOf` on a value bound to a timezone by formatting it, applying the
   * change in the system timezone, then converting back. That last conversion is unreliable on the dates
   * described by `isAffectedByLocalMeanTime`: `startOf('day')` keeps the seconds of the offset, and
   * `endOf('month')` returns the first instant of the next month.
   *
   * The setters are not affected, so we compute the expected wall clock on a plain UTC value and rebuild
   * the result with them whenever `dayjs` returned something else. `dayjs` stays in charge on every
   * other date, which keeps the DST handling it already does.
   * See https://github.com/mui/mui-x/issues/23301
   */
  private alignToWallClock = (
    value: Dayjs,
    result: Dayjs,
    getExpectedWallClock: (wallClock: Dayjs) => Dayjs,
  ) => {
    if (!this.isAffectedByLocalMeanTime(value)) {
      return result;
    }

    const wallClock = this.getWallClock(value);
    const resultWallClock = this.getWallClock(result);
    if (wallClock === null || resultWallClock === null) {
      return result;
    }

    const expectedWallClock = getExpectedWallClock(wallClock);
    if (resultWallClock.valueOf() === expectedWallClock.valueOf()) {
      return result;
    }

    let alignedValue = this.setYear(value, expectedWallClock.year());
    alignedValue = this.setMonth(alignedValue, expectedWallClock.month());
    alignedValue = this.setDate(alignedValue, expectedWallClock.date());
    alignedValue = this.setHours(alignedValue, expectedWallClock.hour());
    alignedValue = this.setMinutes(alignedValue, expectedWallClock.minute());
    alignedValue = this.setSeconds(alignedValue, expectedWallClock.second());

    return this.setMilliseconds(alignedValue, expectedWallClock.millisecond());
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone: PickersTimezone = 'default',
  ): DateBuilderReturnType<T> => {
    type R = DateBuilderReturnType<T>;
    if (value === null) {
      return null as unknown as R;
    }

    if (timezone === 'UTC') {
      return this.createUTCDate(value) as unknown as R;
    }
    if (timezone === 'system' || (timezone === 'default' && !this.hasTimezonePlugin())) {
      return this.createSystemDate(value) as unknown as R;
    }
    return this.createTZDate(value, timezone) as unknown as R;
  };

  public getInvalidDate = () => dayjs(new Date('Invalid date'));

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
      /* v8 ignore next 3 */
      if (!this.hasUTCPlugin()) {
        throwMissingUTCPluginError();
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

      /* v8 ignore next */
      throwMissingTimezonePluginError();
    }

    return this.setLocaleToValue(dayjs.tz(value, this.cleanTimezone(timezone)));
  };

  public toJsDate = (value: Dayjs) => {
    return value.toDate();
  };

  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    return dayjs(value, format, this.locale, true);
  };

  public getCurrentLocaleCode = () => {
    return this.locale || 'en';
  };

  public is12HourCycleInCurrentLocale = () => {
    /* v8 ignore next */
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

  public isValid = (value: Dayjs | null): value is Dayjs => {
    if (value == null) {
      return false;
    }

    return value.isValid();
  };

  public format = (value: Dayjs, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: Dayjs, formatString: string) => {
    return this.setLocaleToValue(value).format(formatString);
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
    return this.alignToWallClock(value, this.adjustOffset(value.startOf('year')), (wallClock) =>
      wallClock.startOf('year'),
    );
  };

  public startOfMonth = (value: Dayjs) => {
    return this.alignToWallClock(value, this.adjustOffset(value.startOf('month')), (wallClock) =>
      wallClock.startOf('month'),
    );
  };

  public startOfWeek = (value: Dayjs) => {
    return this.alignToWallClock(
      value,
      this.adjustOffset(this.setLocaleToValue(value).startOf('week')),
      (wallClock) => wallClock.startOf('week'),
    );
  };

  public startOfDay = (value: Dayjs) => {
    return this.alignToWallClock(value, this.adjustOffset(value.startOf('day')), (wallClock) =>
      wallClock.startOf('day'),
    );
  };

  public endOfYear = (value: Dayjs) => {
    return this.alignToWallClock(value, this.adjustOffset(value.endOf('year')), (wallClock) =>
      wallClock.endOf('year'),
    );
  };

  public endOfMonth = (value: Dayjs) => {
    return this.alignToWallClock(value, this.adjustOffset(value.endOf('month')), (wallClock) =>
      wallClock.endOf('month'),
    );
  };

  public endOfWeek = (value: Dayjs) => {
    return this.alignToWallClock(
      value,
      this.adjustOffset(this.setLocaleToValue(value).endOf('week')),
      (wallClock) => wallClock.endOf('week'),
    );
  };

  public endOfDay = (value: Dayjs) => {
    return this.alignToWallClock(value, this.adjustOffset(value.endOf('day')), (wallClock) =>
      wallClock.endOf('day'),
    );
  };

  public addYears = (value: Dayjs, amount: number) => {
    return this.adjustOffset(this.restoreDayOfMonth(value.add(amount, 'year'), value));
  };

  public addMonths = (value: Dayjs, amount: number) => {
    return this.adjustOffset(this.restoreDayOfMonth(value.add(amount, 'month'), value));
  };

  public addWeeks = (value: Dayjs, amount: number) => {
    return this.adjustOffset(value.add(amount, 'week'));
  };

  public addDays = (value: Dayjs, amount: number) => {
    return this.adjustOffset(value.add(amount, 'day'));
  };

  public addHours = (value: Dayjs, amount: number) => {
    return this.adjustOffset(value.add(amount, 'hour'));
  };

  public addMinutes = (value: Dayjs, amount: number) => {
    return this.adjustOffset(value.add(amount, 'minute'));
  };

  public addSeconds = (value: Dayjs, amount: number) => {
    return this.adjustOffset(value.add(amount, 'second'));
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
    return this.adjustOffset(this.restoreDayOfMonth(value.set('year', year), value));
  };

  public setMonth = (value: Dayjs, month: number) => {
    return this.adjustOffset(this.restoreDayOfMonth(value.set('month', month), value));
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
    // `daysInMonth()` derives from `endOf('month')`, which is broken on the dates described by
    // `isAffectedByLocalMeanTime` and returns `1` there.
    if (this.isAffectedByLocalMeanTime(value)) {
      const wallClock = this.getWallClock(value);
      if (wallClock !== null) {
        return wallClock.daysInMonth();
      }
    }

    return value.daysInMonth();
  };

  public getWeekArray = (value: Dayjs) => {
    const start = this.startOfWeek(this.startOfMonth(value));
    const end = this.endOfWeek(this.endOfMonth(value));

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
