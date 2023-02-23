import BaseAdapterDateFns from '@date-io/date-fns';
import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import getWeek from 'date-fns/getWeek';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../internals/models';

const formatTokenMap: FieldFormatTokenMap = {
  y: 'year',
  yy: 'year',
  yyy: 'year',
  yyyy: 'year',
  M: 'month',
  MM: 'month',
  MMMM: { sectionType: 'month', contentType: 'letter' },
  MMM: { sectionType: 'month', contentType: 'letter' },
  LLL: { sectionType: 'month', contentType: 'letter' },
  LLLL: { sectionType: 'month', contentType: 'letter' },
  E: { sectionType: 'weekDay', contentType: 'letter' },
  EE: { sectionType: 'weekDay', contentType: 'letter' },
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionType: 'weekDay', contentType: 'letter' },
  i: 'weekDay',
  ii: 'weekDay',
  iii: { sectionType: 'weekDay', contentType: 'letter' },
  iiii: { sectionType: 'weekDay', contentType: 'letter' },
  e: 'weekDay',
  ee: 'weekDay',
  eee: { sectionType: 'weekDay', contentType: 'letter' },
  eeee: { sectionType: 'weekDay', contentType: 'letter' },
  eeeee: { sectionType: 'weekDay', contentType: 'letter' },
  eeeeee: { sectionType: 'weekDay', contentType: 'letter' },
  c: 'weekDay',
  cc: 'weekDay',
  ccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccc: { sectionType: 'weekDay', contentType: 'letter' },
  ccccc: { sectionType: 'weekDay', contentType: 'letter' },
  cccccc: { sectionType: 'weekDay', contentType: 'letter' },
  d: 'day',
  dd: 'day',
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',
  mm: 'minutes',
  ss: 'seconds',
  a: 'meridiem',
  aa: 'meridiem',
  aaa: 'meridiem',
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
