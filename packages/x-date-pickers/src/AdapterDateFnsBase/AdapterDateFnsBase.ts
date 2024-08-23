/* eslint-disable class-methods-use-this */
import {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
} from '../models';
import { MakeRequired } from '../internals/models/helpers';

type DateFnsLocaleBase = {
  formatLong?: {
    date: (...args: Array<any>) => any;
    time: (...args: Array<any>) => any;
    dateTime: (...args: Array<any>) => any;
  };
  code?: string;
};

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
  yy: 'year',
  yyy: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
  yyyy: 'year',

  // Month
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMMM: { sectionType: 'month', contentType: 'letter' },
  MMM: { sectionType: 'month', contentType: 'letter' },
  L: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  LL: 'month',
  LLL: { sectionType: 'month', contentType: 'letter' },
  LLLL: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  dd: 'day',
  do: { sectionType: 'day', contentType: 'digit-with-letter' },

  // Day of the week
  E: { sectionType: 'weekDay', contentType: 'letter' },
  EE: { sectionType: 'weekDay', contentType: 'letter' },
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionType: 'weekDay', contentType: 'letter' },
  i: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  ii: 'weekDay',
  iii: { sectionType: 'weekDay', contentType: 'letter' },
  iiii: { sectionType: 'weekDay', contentType: 'letter' },
  e: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  ee: 'weekDay',
  eee: { sectionType: 'weekDay', contentType: 'letter' },
  eeee: { sectionType: 'weekDay', contentType: 'letter' },
  eeeee: { sectionType: 'weekDay', contentType: 'letter' },
  eeeeee: { sectionType: 'weekDay', contentType: 'letter' },
  c: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
  cc: 'weekDay',
  ccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccc: { sectionType: 'weekDay', contentType: 'letter' },
  ccccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccccc: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  a: 'meridiem',
  aa: 'meridiem',
  aaa: 'meridiem',

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
  dayOfMonthFull: 'do',
  weekday: 'EEEE',
  weekdayShort: 'EEEEEE',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'aa',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'PP',
  keyboardDate: 'P',
  shortDate: 'MMM d',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',

  fullTime: 'p',
  fullTime12h: 'hh:mm aa',
  fullTime24h: 'HH:mm',

  keyboardDateTime: 'P p',
  keyboardDateTime12h: 'P hh:mm aa',
  keyboardDateTime24h: 'P HH:mm',
};

type DateFnsAdapterBaseOptions<DateFnsLocale extends DateFnsLocaleBase> = MakeRequired<
  AdapterOptions<DateFnsLocale, never>,
  'locale'
> & {
  longFormatters: Record<
    'p' | 'P',
    (token: string, formatLong: DateFnsLocaleBase['formatLong']) => string
  >;
  lib?: string;
};

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
export class AdapterDateFnsBase<DateFnsLocale extends DateFnsLocaleBase>
  implements
    Pick<
      MuiPickersAdapter<Date, DateFnsLocale>,
      | 'date'
      | 'getInvalidDate'
      | 'getTimezone'
      | 'setTimezone'
      | 'toJsDate'
      | 'getCurrentLocaleCode'
      | 'is12HourCycleInCurrentLocale'
      | 'expandFormat'
      | 'formatNumber'
    >
{
  public isMUIAdapter = true;

  public isTimezoneCompatible = false;

  public lib: string;

  public locale: DateFnsLocale;

  public formats: AdapterFormats;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  public longFormatters: DateFnsAdapterBaseOptions<DateFnsLocale>['longFormatters'];

  constructor(props: DateFnsAdapterBaseOptions<DateFnsLocale>) {
    const { locale, formats, longFormatters, lib } = props;
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };
    this.longFormatters = longFormatters;
    this.lib = lib || 'date-fns';
  }

  public date = <T extends string | null | undefined>(
    value?: T,
  ): DateBuilderReturnType<T, Date> => {
    type R = DateBuilderReturnType<T, Date>;
    if (typeof value === 'undefined') {
      return <R>new Date();
    }

    if (value === null) {
      return <R>null;
    }

    return <R>new Date(value);
  };

  public getInvalidDate = () => new Date('Invalid Date');

  public getTimezone = (): string => {
    return 'default';
  };

  public setTimezone = (value: Date): Date => {
    return value;
  };

  public toJsDate = (value: Date) => {
    return value;
  };

  public getCurrentLocaleCode = (): string => {
    // `code` is undefined only in `date-fns` types, but all locales have it
    return this.locale.code!;
  };

  // Note: date-fns input types are more lenient than this adapter, so we need to expose our more
  // strict signature and delegate to the more lenient signature. Otherwise, we have downstream type errors upon usage.
  public is12HourCycleInCurrentLocale = () => {
    return /a/.test(this.locale.formatLong!.time({ width: 'short' }));
  };

  public expandFormat = (format: string) => {
    const longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

    // @see https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L31
    return format
      .match(longFormatRegexp)!
      .map((token: string) => {
        const firstCharacter = token[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          const longFormatter = this.longFormatters[firstCharacter];
          return longFormatter(token, this.locale.formatLong);
        }
        return token;
      })
      .join('');
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public getDayOfWeek = (value: Date) => {
    return value.getDay() + 1;
  };
}
