/* eslint-disable class-methods-use-this */
import defaultMoment, { LongDateFormatKey } from 'moment';
import BaseAdapterMoment from '@date-io/moment';
import { MuiFormatTokenMap, MuiPickersAdapter } from '../internals/models';

// From https://momentjs.com/docs/#/displaying/format/
const formatTokenMap: MuiFormatTokenMap = {
  // Month
  M: 'month',
  Mo: 'month',
  MM: 'month',
  MMM: { sectionName: 'month', contentType: 'letter' },
  MMMM: { sectionName: 'month', contentType: 'letter' },

  // Day of Month
  D: 'day',
  Do: 'day',
  DD: 'day',

  // Year
  Y: 'year',
  YY: 'year',
  YYYY: 'year',
  YYYYYY: 'year',

  // AM / PM
  A: 'meridiem',
  a: 'meridiem',

  // Hour
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',
  k: 'hours',
  kk: 'hours',

  // Minute
  m: 'minutes',
  mm: 'minutes',

  // Second
  s: 'seconds',
  ss: 'seconds',
};

export class AdapterMoment
  extends BaseAdapterMoment
  implements MuiPickersAdapter<defaultMoment.Moment>
{
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  /**
   * The current getFormatHelperText method uses an outdated format parsing logic.
   * We should use this one in the future to support all localized formats.
   */
  public expandFormat = (format: string) => {
    // @see https://github.com/moment/moment/blob/develop/src/lib/format/format.js#L6
    const localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})|./g;

    return format
      .match(localFormattingTokens)!
      .map((token) => {
        const firstCharacter = token[0];
        if (firstCharacter === 'L' || firstCharacter === ';') {
          return this.moment
            .localeData(this.getCurrentLocaleCode())
            .longDateFormat(token as LongDateFormatKey);
        }

        return token;
      })
      .join('');
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
  };

  public getWeekNumber = (date: defaultMoment.Moment) => {
    return date.week();
  };
}
