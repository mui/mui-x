/* eslint-disable class-methods-use-this */
import { DateTime, Info } from 'luxon';
import {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
  PickersTimezone,
} from '../models';

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
  yy: 'year',
  yyyy: { sectionType: 'year', contentType: 'digit', maxLength: 4 },

  // Month
  L: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  LL: 'month',
  LLL: { sectionType: 'month', contentType: 'letter' },
  LLLL: { sectionType: 'month', contentType: 'letter' },
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  dd: 'day',

  // Day of the week
  c: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  ccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccc: { sectionType: 'weekDay', contentType: 'letter' },
  E: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
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
  year: 'yyyy',
  month: 'LLLL',
  monthShort: 'MMM',
  dayOfMonth: 'd',
  // Full day of the month format (i.e. 3rd) is not supported
  // Falling back to regular format
  dayOfMonthFull: 'd',
  weekday: 'cccc',
  weekdayShort: 'ccccc',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'a',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'DD',
  keyboardDate: 'D',
  shortDate: 'MMM d',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',

  fullTime: 't',
  fullTime12h: 'hh:mm a',
  fullTime24h: 'HH:mm',

  keyboardDateTime: 'D t',
  keyboardDateTime12h: 'D hh:mm a',
  keyboardDateTime24h: 'D T',
};

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    luxon: DateTime;
  }
}

/**
 * Based on `@date-io/luxon`
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
export class AdapterLuxon implements MuiPickersAdapter<string> {
  public isMUIAdapter = true;

  public isTimezoneCompatible = true;

  public lib = 'luxon';

  public locale: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: "'", end: "'" };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats }: AdapterOptions<string, never> = {}) {
    this.locale = locale || 'en-US';
    this.formats = { ...defaultFormats, ...formats };
  }

  private setLocaleToValue = (value: DateTime) => {
    const expectedLocale = this.getCurrentLocaleCode();
    if (expectedLocale === value.locale) {
      return value;
    }

    return value.setLocale(expectedLocale);
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone: PickersTimezone = 'default',
  ): DateBuilderReturnType<T> => {
    type R = DateBuilderReturnType<T>;
    if (value === null) {
      return <R>null;
    }

    if (typeof value === 'undefined') {
      // @ts-ignore
      return <R>DateTime.fromJSDate(new Date(), { locale: this.locale, zone: timezone });
    }

    // @ts-ignore
    return <R>DateTime.fromISO(value, { locale: this.locale, zone: timezone });
  };

  public getInvalidDate = () => DateTime.fromJSDate(new Date('Invalid Date'));

  public getTimezone = (value: DateTime): string => {
    // When using the system zone, we want to return "system", not something like "Europe/Paris"
    if (value.zone.type === 'system') {
      return 'system';
    }

    return value.zoneName!;
  };

  public setTimezone = (value: DateTime, timezone: PickersTimezone): DateTime => {
    if (!value.zone.equals(Info.normalizeZone(timezone))) {
      return value.setZone(timezone);
    }

    return value;
  };

  public toJsDate = (value: DateTime) => {
    return value.toJSDate();
  };

  public parse = (value: string, formatString: string) => {
    if (value === '') {
      return null;
    }

    return DateTime.fromFormat(value, formatString, { locale: this.locale });
  };

  public getCurrentLocaleCode = () => {
    return this.locale;
  };

  /* istanbul ignore next */
  public is12HourCycleInCurrentLocale = () => {
    if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
      return true; // Luxon defaults to en-US if Intl not found
    }

    return Boolean(
      new Intl.DateTimeFormat(this.locale, { hour: 'numeric' })?.resolvedOptions()?.hour12,
    );
  };

  public expandFormat = (format: string) => {
    // Extract escaped section to avoid extending them
    const catchEscapedSectionsRegexp = /''|'(''|[^'])+('|$)|[^']*/g;

    // This RegExp tests if a string is only mad of supported tokens
    const validTokens = [...Object.keys(this.formatTokenMap), 'yyyyy'];
    const isWordComposedOfTokens = new RegExp(`^(${validTokens.join('|')})+$`);

    // Extract words to test if they are a token or a word to escape.
    const catchWordsRegexp = /(?:^|[^a-z])([a-z]+)(?:[^a-z]|$)|([a-z]+)/gi;
    return (
      format
        .match(catchEscapedSectionsRegexp)!
        .map((token: string) => {
          const firstCharacter = token[0];
          if (firstCharacter === "'") {
            return token;
          }
          const expandedToken = DateTime.expandFormat(token, { locale: this.locale });

          return expandedToken.replace(catchWordsRegexp, (substring, g1, g2) => {
            const word = g1 || g2; // words are either in group 1 or group 2

            if (isWordComposedOfTokens.test(word)) {
              return substring;
            }
            return `'${substring}'`;
          });
        })
        .join('')
        // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
        // This value is supported by luxon parser but not luxon formatter.
        // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
        .replace('yyyyy', 'yyyy')
    );
  };

  public isValid = (value: DateTime | null): boolean => {
    if (value === null) {
      return false;
    }

    return value.isValid;
  };

  public format = (value: DateTime, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: DateTime, format: string) => {
    return value.setLocale(this.locale).toFormat(format);
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public isEqual = (value: DateTime | null, comparing: DateTime | null) => {
    if (value === null && comparing === null) {
      return true;
    }

    if (value === null || comparing === null) {
      return false;
    }

    return +value === +comparing;
  };

  public isSameYear = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, 'year');
  };

  public isSameMonth = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, 'month');
  };

  public isSameDay = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, 'day');
  };

  public isSameHour = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    return value.hasSame(comparingInValueTimezone, 'hour');
  };

  public isAfter = (value: DateTime, comparing: DateTime) => {
    return value > comparing;
  };

  public isAfterYear = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.endOfYear(comparingInValueTimezone), 'years').toObject();
    return diff.years! > 0;
  };

  public isAfterDay = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.endOfDay(comparingInValueTimezone), 'days').toObject();
    return diff.days! > 0;
  };

  public isBefore = (value: DateTime, comparing: DateTime) => {
    return value < comparing;
  };

  public isBeforeYear = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.startOfYear(comparingInValueTimezone), 'years').toObject();
    return diff.years! < 0;
  };

  public isBeforeDay = (value: DateTime, comparing: DateTime) => {
    const comparingInValueTimezone = this.setTimezone(comparing, this.getTimezone(value));
    const diff = value.diff(this.startOfDay(comparingInValueTimezone), 'days').toObject();
    return diff.days! < 0;
  };

  public isWithinRange = (value: DateTime, [start, end]: [DateTime, DateTime]) => {
    return (
      this.isEqual(value, start) ||
      this.isEqual(value, end) ||
      (this.isAfter(value, start) && this.isBefore(value, end))
    );
  };

  public startOfYear = (value: DateTime) => {
    return value.startOf('year');
  };

  public startOfMonth = (value: DateTime) => {
    return value.startOf('month');
  };

  public startOfWeek = (value: DateTime) => {
    return this.setLocaleToValue(value).startOf('week', { useLocaleWeeks: true });
  };

  public startOfDay = (value: DateTime) => {
    return value.startOf('day');
  };

  public endOfYear = (value: DateTime) => {
    return value.endOf('year');
  };

  public endOfMonth = (value: DateTime) => {
    return value.endOf('month');
  };

  public endOfWeek = (value: DateTime) => {
    return this.setLocaleToValue(value).endOf('week', { useLocaleWeeks: true });
  };

  public endOfDay = (value: DateTime) => {
    return value.endOf('day');
  };

  public addYears = (value: DateTime, amount: number) => {
    return value.plus({ years: amount });
  };

  public addMonths = (value: DateTime, amount: number) => {
    return value.plus({ months: amount });
  };

  public addWeeks = (value: DateTime, amount: number) => {
    return value.plus({ weeks: amount });
  };

  public addDays = (value: DateTime, amount: number) => {
    return value.plus({ days: amount });
  };

  public addHours = (value: DateTime, amount: number) => {
    return value.plus({ hours: amount });
  };

  public addMinutes = (value: DateTime, amount: number) => {
    return value.plus({ minutes: amount });
  };

  public addSeconds = (value: DateTime, amount: number) => {
    return value.plus({ seconds: amount });
  };

  public getYear = (value: DateTime) => {
    return value.get('year');
  };

  public getMonth = (value: DateTime) => {
    // See https://github.com/moment/luxon/blob/master/docs/moment.md#major-functional-differences
    return value.get('month') - 1;
  };

  public getDate = (value: DateTime) => {
    return value.get('day');
  };

  public getHours = (value: DateTime) => {
    return value.get('hour');
  };

  public getMinutes = (value: DateTime) => {
    return value.get('minute');
  };

  public getSeconds = (value: DateTime) => {
    return value.get('second');
  };

  public getMilliseconds = (value: DateTime) => {
    return value.get('millisecond');
  };

  public setYear = (value: DateTime, year: number) => {
    return value.set({ year });
  };

  public setMonth = (value: DateTime, month: number) => {
    return value.set({ month: month + 1 });
  };

  public setDate = (value: DateTime, date: number) => {
    return value.set({ day: date });
  };

  public setHours = (value: DateTime, hours: number) => {
    return value.set({ hour: hours });
  };

  public setMinutes = (value: DateTime, minutes: number) => {
    return value.set({ minute: minutes });
  };

  public setSeconds = (value: DateTime, seconds: number) => {
    return value.set({ second: seconds });
  };

  public setMilliseconds = (value: DateTime, milliseconds: number) => {
    return value.set({ millisecond: milliseconds });
  };

  public getDaysInMonth = (value: DateTime) => {
    return value.daysInMonth!;
  };

  public getWeekArray = (value: DateTime) => {
    const firstDay = this.startOfWeek(this.startOfMonth(value));
    const lastDay = this.endOfWeek(this.endOfMonth(value));

    const { days } = lastDay.diff(firstDay, 'days').toObject();

    const weeks: DateTime[][] = [];
    new Array<number>(Math.round(days!))
      .fill(0)
      .map((_, i) => i)
      .map((day) => firstDay.plus({ days: day }))
      .forEach((v, i) => {
        if (i === 0 || (i % 7 === 0 && i > 6)) {
          weeks.push([v]);
          return;
        }

        weeks[weeks.length - 1].push(v);
      });

    return weeks;
  };

  public getWeekNumber = (value: DateTime) => {
    /* istanbul ignore next */
    return value.localWeekNumber ?? value.weekNumber;
  };

  public getDayOfWeek = (value: DateTime) => {
    return value.weekday;
  };

  public getYearRange = ([start, end]: [DateTime, DateTime]) => {
    const startDate = this.startOfYear(start);
    const endDate = this.endOfYear(end);
    const years: DateTime[] = [];

    let current = startDate;
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };
}
