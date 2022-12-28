import BaseAdapterDateFnsJalali from '@date-io/date-fns-jalali';
import defaultLocale from 'date-fns-jalali/locale/fa-IR';
import getWeek from 'date-fns-jalali/getWeek';
// @ts-ignore
import longFormatters from 'date-fns-jalali/_lib/format/longFormatters';
import { DateIOFormats } from '@date-io/core/IUtils';
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

interface Opts {
  locale?: typeof defaultLocale;
  formats?: Partial<DateIOFormats>;
}

export class AdapterDateFnsJalali
  extends BaseAdapterDateFnsJalali
  implements MuiPickersAdapter<Date>
{
  public isMUIAdapter = true;

  constructor(options: Opts) {
    super({
      ...options,
      formats: {
        ...options.formats,
        dayOfMonthWithOrdinal: 'do',
      },
    });
  }

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  public expandFormat = (format: string) => {
    // @see https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L31
    const longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
    const locale = this.locale ?? defaultLocale;
    return format
      .match(longFormatRegexp)!
      .map((token) => {
        const firstCharacter = token[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          const longFormatter = longFormatters[firstCharacter];
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
