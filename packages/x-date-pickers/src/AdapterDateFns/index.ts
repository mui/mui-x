import BaseAdapterDateFns from '@date-io/date-fns';
import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import getWeek from 'date-fns/getWeek';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../models';

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

export class AdapterDateFns extends BaseAdapterDateFns implements MuiPickersAdapter<Date> {
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  public expandFormat = (format: string) => {
    const longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

    // @see https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L31
    return format
      .match(longFormatRegexp)!
      .map((token: string) => {
        const firstCharacter = token[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          const longFormatter = longFormatters[firstCharacter];
          const locale = this.locale || defaultLocale;
          return longFormatter(token, locale.formatLong, {});
        }
        return token;
      })
      .join('');
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format)
      .replace(/(aaa|aa|a)/g, '(a|p)m')
      .toLocaleLowerCase();
  };

  public getWeekNumber = (date: Date) => {
    return getWeek(date, { locale: this.locale });
  };
}
