/* eslint-disable class-methods-use-this */
import { DateTime } from 'luxon';
import BaseAdapterLuxon from '@date-io/luxon';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../internals/models';

const formatTokenMap: FieldFormatTokenMap = {
  s: 'seconds',
  ss: 'seconds',

  m: 'minutes',
  mm: 'minutes',

  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',

  a: 'meridiem',

  d: 'day',
  dd: 'day',

  c: 'weekDay',
  ccc: { sectionName: 'weekDay', contentType: 'letter' },
  cccc: { sectionName: 'weekDay', contentType: 'letter' },
  ccccc: { sectionName: 'weekDay', contentType: 'letter' },
  E: 'weekDay',
  EEE: { sectionName: 'weekDay', contentType: 'letter' },
  EEEE: { sectionName: 'weekDay', contentType: 'letter' },
  EEEEE: { sectionName: 'weekDay', contentType: 'letter' },

  L: 'month',
  LL: 'month',
  LLL: { sectionName: 'month', contentType: 'letter' },
  LLLL: { sectionName: 'month', contentType: 'letter' },
  M: 'month',
  MM: 'month',
  MMM: { sectionName: 'month', contentType: 'letter' },
  MMMM: { sectionName: 'month', contentType: 'letter' },

  y: 'year',
  yy: 'year',
  yyyy: 'year',
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
    // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
    // This value is supported by luxon parser but not luxon formatter.
    // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
    return DateTime.expandFormat(format, { locale: this.locale }).replace('yyyyy', 'yyyy');
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
  };

  public getWeekNumber = (date: DateTime) => {
    return date.weekNumber;
  };
}
