/* eslint-disable class-methods-use-this */
import { DateTime } from 'luxon';
import BaseAdapterLuxon from '@date-io/luxon';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../models';

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
  yy: 'year',
  yyyy: 'year',

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
  ccccc: { sectionType: 'weekDay', contentType: 'letter' },
  E: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionType: 'weekDay', contentType: 'letter' },

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

export class AdapterLuxon extends BaseAdapterLuxon implements MuiPickersAdapter<DateTime> {
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: "'", end: "'" };

  public expandFormat = (format: string) => {
    if (!DateTime.expandFormat) {
      throw Error(
        'Your luxon version does not support `expandFormat`. Consider upgrading it to v3.0.2',
      );
    }
    // Extract escaped section to avoid extending them
    const longFormatRegexp = /''|'(''|[^'])+('|$)|[^']*/g;
    return (
      format
        .match(longFormatRegexp)!
        .map((token: string) => {
          const firstCharacter = token[0];
          if (firstCharacter === "'") {
            return token;
          }
          return DateTime.expandFormat(token, { locale: this.locale });
        })
        .join('')
        // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
        // This value is supported by luxon parser but not luxon formatter.
        // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
        .replace('yyyyy', 'yyyy')
    );
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
  };

  public getWeekNumber = (date: DateTime) => {
    return date.weekNumber;
  };
}
