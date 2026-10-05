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

  declare public locale?: string;

  declare public formats: AdapterFormats;

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

  private timezoneFormatters = new Map<string, Intl.DateTimeFormat>();

  private valueOfDSTFix: boolean | undefined;

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
        warnOnce(
          [
            'MUI X: Your locale has not been found.',
            'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale.',
            "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
            'fallback on English locale.',
          ].join('\n'),
        );
      }
      /* v8 ignore stop */
      localeObject = locales.en;
    }

    return localeObject.formats;
  };

  /**
   * `dayjs` does not update the offset when `set` or `add` crosses a DST change (moment does).
   * Plain `system` values follow the JS Date DST, and a copied offset breaks later `dayjs` calls.
   */
  protected adjustOffset = (value: Dayjs) => {
    if (!this.hasTimezonePlugin()) {
      return value;
    }

    const timezone = this.getTimezone(value);
    // Plain system values already follow the native Date offset.
    // @ts-ignore
    if (timezone === 'UTC' || (timezone === 'system' && value.$offset === undefined)) {
      return value;
    }

    // Before 1.11.22, `tz` derives the offset through the system timezone, so read it from Intl.
    if (timezone !== 'system' && this.hasValueOfDSTFix() && value.isValid()) {
      const wallDate = new Date(0);
      wallDate.setUTCFullYear(value.year(), value.month(), value.date());
      wallDate.setUTCHours(value.hour(), value.minute(), value.second(), value.millisecond());
      // @ts-ignore
      const currentOffset: number = value.$u ? 0 : value.$offset;
      const offset = this.getWallTimeOffset(wallDate.getTime(), timezone, currentOffset);
      if (offset === currentOffset) {
        return value;
      }

      // A UTC-mode value ignores `$offset`, and a value without `$offset` follows the system offset.
      // @ts-ignore
      if (value.$u || offset === 0) {
        return this.createNamedZoneValue(
          wallDate.getTime() - offset * 60_000,
          offset,
          timezone,
          value.locale(),
        );
      }

      // @ts-ignore
      value.$offset = offset;
      return value;
    }

    // dayjs 1.11.12 and 1.11.13 change the value itself when the new offset is 0.
    const fixedValue = value.clone().tz(this.cleanTimezone(timezone), true);
    // An offset of `0` equals no offset, and before dayjs 1.11.12 assigning `0` breaks UTC values.
    // @ts-ignore
    if ((fixedValue.$offset ?? 0) !== (value.$offset ?? 0)) {
      // @ts-ignore
      value.$offset = fixedValue.$offset;
    }
    return value;
  };

  /**
   * Before 1.11.2, `valueOf()` of a value without `$x.$localOffset` uses the system offset of today,
   * not of the value date (https://github.com/iamkun/dayjs/issues/1448).
   */
  private hasValueOfDSTFix = () => {
    if (this.valueOfDSTFix === undefined) {
      const probe = dayjs(0);
      const date = new Date(0);
      date.getTimezoneOffset = () => 1;
      // @ts-ignore
      probe.$d = date;
      // @ts-ignore
      probe.$offset = 0;
      this.valueOfDSTFix = probe.valueOf() === -60_000;
    }

    return this.valueOfDSTFix;
  };

  /**
   * The offset of the timezone at the timestamp, in minutes. Local Mean Time offsets keep their seconds.
   * Older dayjs.tz() implementations derive the offset through the system timezone, hence reading it from Intl.
   * The numeric parts also work on Node 14 and 16, which do not support `timeZoneName: 'longOffset'`.
   */
  private getTimezoneOffsetAt = (timezone: string, timestamp: number) => {
    let formatter = this.timezoneFormatters.get(timezone);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hourCycle: 'h23',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      this.timezoneFormatters.set(timezone, formatter);
    }

    const wall: Partial<Record<Intl.DateTimeFormatPartTypes, number>> = {};
    formatter.formatToParts(timestamp).forEach((part) => {
      wall[part.type] = Number(part.value);
    });
    const date = new Date(timestamp);
    let seconds =
      (wall.hour! - date.getUTCHours()) * 3600 +
      (wall.minute! - date.getUTCMinutes()) * 60 +
      (wall.second! - date.getUTCSeconds());
    // An offset is shorter than a day, so another day of the month is the next or the previous day.
    if (wall.day !== date.getUTCDate()) {
      seconds += seconds < 0 ? 86_400 : -86_400;
    }

    return seconds / 60;
  };

  /**
   * Builds the value of a named timezone at the timestamp, with the offset (in minutes) of that timezone.
   */
  private createNamedZoneValue = (
    timestamp: number,
    offset: number,
    timezone: string,
    locale: string,
  ) => {
    let result: Dayjs;
    if (offset === 0) {
      // A UTC value keeps the wall time, even when it falls in a DST gap of the system timezone.
      result = dayjs.utc(timestamp).locale(locale);
    } else {
      const wallDate = new Date(timestamp + offset * 60_000);
      const localDate = new Date(0);
      localDate.setFullYear(
        wallDate.getUTCFullYear(),
        wallDate.getUTCMonth(),
        wallDate.getUTCDate(),
      );
      localDate.setHours(
        wallDate.getUTCHours(),
        wallDate.getUTCMinutes(),
        wallDate.getUTCSeconds(),
        wallDate.getUTCMilliseconds(),
      );
      result = dayjs(localDate).locale(locale);
      // @ts-ignore
      result.$offset = offset;
      // A wall time in a DST gap of the system timezone moves the local Date, so `valueOf()` needs the
      // actual displacement. Later `set` and `add` calls copy it, so only store it when it is needed.
      if (result.valueOf() !== timestamp) {
        // dayjs ignores a falsy `$localOffset`. A boxed zero keeps numeric coercion equal to zero.
        // @ts-ignore
        result.$x.$localOffset =
          (localDate.getTime() - timestamp) / 60_000 - offset || new Number(0);
      }
    }
    // @ts-ignore
    result.$x.$timezone = timezone;
    return result;
  };

  /**
   * The offset of the timezone for a wall time, given in milliseconds as if it was UTC.
   * A repeated wall time keeps the preferred offset when it is valid, else it takes the occurrence nearest to
   * that offset, or the first occurrence. A wall time in a gap takes the offset before the gap, so its instant
   * moves forward past the gap.
   */
  private getWallTimeOffset = (wallTime: number, timezone: string, preferredOffset?: number) => {
    const isValidOffset = (offset: number) =>
      this.getTimezoneOffsetAt(timezone, wallTime - offset * 60_000) === offset;
    if (preferredOffset !== undefined) {
      if (isValidOffset(preferredOffset)) {
        return preferredOffset;
      }

      const nearestOffset = this.getTimezoneOffsetAt(timezone, wallTime - preferredOffset * 60_000);
      if (isValidOffset(nearestOffset)) {
        return nearestOffset;
      }
    }

    const offsets = [
      this.getTimezoneOffsetAt(timezone, wallTime - 86_400_000),
      this.getTimezoneOffsetAt(timezone, wallTime + 86_400_000),
    ];
    const validOffsets = offsets.filter(isValidOffset);
    return validOffsets.length > 0 ? Math.max(...validOffsets) : Math.min(...offsets);
  };

  /**
   * For a named timezone, `startOf('day')` can give a midnight in a DST gap (`America/Santiago`) or the
   * previous day. Elapsed-time additions from such a value leave the day, so build the first instant of the day.
   */
  private getStartOfDayInTimezone = (value: Dayjs, timezone: string) => {
    const midnight = new Date(0);
    midnight.setUTCFullYear(value.year(), value.month(), value.date());
    const timestamp =
      midnight.getTime() - this.getWallTimeOffset(midnight.getTime(), timezone) * 60_000;

    return this.createNamedZoneValue(
      timestamp,
      this.getTimezoneOffsetAt(timezone, timestamp),
      timezone,
      value.locale(),
    );
  };

  /**
   * Hours, minutes and seconds measure elapsed time. Rebuild named-zone values from the target
   * instant: adjusting the offset while keeping the wall time changes the elapsed duration.
   */
  private addTime = (value: Dayjs, amount: number, unit: 'hour' | 'minute' | 'second') => {
    // @ts-ignore
    const timezone = value.$x?.$timezone;
    if (!this.hasTimezonePlugin() || !timezone || !this.hasValueOfDSTFix()) {
      return this.adjustOffset(value.add(amount, unit));
    }

    const timestamp =
      value.valueOf() + amount * { hour: 3_600_000, minute: 60_000, second: 1000 }[unit];
    if (!Number.isFinite(timestamp)) {
      return value.add(amount, unit);
    }

    return this.createNamedZoneValue(
      timestamp,
      this.getTimezoneOffsetAt(timezone, timestamp),
      timezone,
      value.locale(),
    );
  };

  /**
   * Before a timezone was standardized, IANA falls back on the Local Mean Time of the location, whose
   * offset is not a round number of minutes (`Asia/Kolkata` is `GMT+05:53:28`). `dayjs` mishandles those
   * offsets. Only values bound to a timezone with `dayjs.tz` are affected, including `dayjs.tz(value, 'UTC')`.
   */
  private isAffectedByLocalMeanTime = (value: Dayjs) => {
    const zone = (value as Dayjs & { $x?: { $timezone?: string } }).$x?.$timezone;

    return this.hasUTCPlugin() && this.hasTimezonePlugin() && !!zone;
  };

  /**
   * The number of days in the month of the value, read from its own year and month fields.
   * A clone is not reliable: before 1.11.14, `dayjs` can give it other fields (https://github.com/iamkun/dayjs/pull/2505).
   */
  private getDaysInMonthFromFields = (value: Dayjs) => {
    const lastDayOfMonth = new Date(0);
    lastDayOfMonth.setUTCFullYear(value.year(), value.month() + 1, 0);

    return lastDayOfMonth.getUTCDate();
  };

  /**
   * On the dates described by `isAffectedByLocalMeanTime`, `dayjs` moves the day of the month when only
   * the year or the month was meant to change.
   * `daysInMonth()` is unusable on such a value because it derives from the equally broken
   * `endOf('month')`, hence computing it from the fields instead.
   * See https://github.com/mui/mui-x/issues/23163
   */
  private restoreDayOfMonth = (value: Dayjs, reference: Dayjs) => {
    if (!this.isAffectedByLocalMeanTime(value) || !value.isValid()) {
      return value;
    }

    // A shorter target month legitimately clamps the day (`Jan 31` + 1 month is `Feb 28`).
    const expectedDayOfMonth = Math.min(reference.date(), this.getDaysInMonthFromFields(value));
    if (value.date() === expectedDayOfMonth) {
      return value;
    }

    return value.set('date', expectedDayOfMonth);
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
    return this.adjustOffset(value.startOf('year'));
  };

  public startOfMonth = (value: Dayjs) => {
    return this.adjustOffset(value.startOf('month'));
  };

  public startOfWeek = (value: Dayjs) => {
    return this.adjustOffset(this.setLocaleToValue(value).startOf('week'));
  };

  public startOfDay = (value: Dayjs) => {
    // @ts-ignore
    const timezone = value.$x?.$timezone;
    if (this.hasTimezonePlugin() && timezone && this.hasValueOfDSTFix() && value.isValid()) {
      return this.getStartOfDayInTimezone(value, timezone);
    }

    return this.adjustOffset(value.startOf('day'));
  };

  public endOfYear = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('year'));
  };

  public endOfMonth = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('month'));
  };

  public endOfWeek = (value: Dayjs) => {
    return this.adjustOffset(this.setLocaleToValue(value).endOf('week'));
  };

  public endOfDay = (value: Dayjs) => {
    return this.adjustOffset(value.endOf('day'));
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
    return this.addTime(value, amount, 'hour');
  };

  public addMinutes = (value: Dayjs, amount: number) => {
    return this.addTime(value, amount, 'minute');
  };

  public addSeconds = (value: Dayjs, amount: number) => {
    return this.addTime(value, amount, 'second');
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
      return this.getDaysInMonthFromFields(value);
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
