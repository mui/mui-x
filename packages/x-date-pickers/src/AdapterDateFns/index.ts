import BaseAdapterDateFns from '@date-io/date-fns';
import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import getWeek from 'date-fns/getWeek';
import { MuiFormatTokenMap, MuiPickersAdapter } from '../internals/models';

const formatTokenMap: MuiFormatTokenMap = {
  y: 'year',
  yy: 'year',
  yyy: 'year',
  yyyy: 'year',
  M: 'month',
  MM: 'month',
  MMMM: { sectionName: 'month', contentType: 'letter' },
  MMM: { sectionName: 'month', contentType: 'letter' },
  LLL: { sectionName: 'month', contentType: 'letter' },
  LLLL: { sectionName: 'month', contentType: 'letter' },
  E: { sectionName: 'weekDay', contentType: 'letter' },
  EE: { sectionName: 'weekDay', contentType: 'letter' },
  EEE: { sectionName: 'weekDay', contentType: 'letter' },
  EEEE: { sectionName: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionName: 'weekDay', contentType: 'letter' },
  i: 'weekDay',
  ii: 'weekDay',
  iii: { sectionName: 'weekDay', contentType: 'letter' },
  iiii: { sectionName: 'weekDay', contentType: 'letter' },
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
