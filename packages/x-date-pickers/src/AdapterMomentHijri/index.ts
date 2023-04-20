/* eslint-disable class-methods-use-this */
import BaseAdapterMomentHijri from '@date-io/hijri';
// @ts-ignore
import defaultMoment, { LongDateFormatKey } from 'moment-hijri';
import { FieldFormatTokenMap, MuiPickersAdapter } from '../models';

// From https://momentjs.com/docs/#/displaying/format/
const formatTokenMap: FieldFormatTokenMap = {
  // Year
  iY: { sectionType: 'year', contentType: 'letter' },
  iYY: { sectionType: 'year', contentType: 'letter' },
  iYYYY: { sectionType: 'year', contentType: 'letter' },

  // Month
  iM: 'month',
  iMM: 'month',
  iMMM: { sectionType: 'month', contentType: 'letter' },
  iMMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  iD: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  iDD: 'day',

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  HH: 'hours',
  h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  hh: 'hours',
  k: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  kk: 'hours',

  // Minutes
  m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
  mm: 'minutes',

  // Seconds
  s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
  ss: 'seconds',
};

export class AdapterMomentHijri
  extends BaseAdapterMomentHijri
  implements MuiPickersAdapter<defaultMoment.Moment>
{
  public isMUIAdapter = true;

  public formatTokenMap = formatTokenMap;

  public escapedCharacters = { start: '[', end: ']' };

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
      .join('')
      .replace('dd', 'iDD'); // Fix for https://github.com/dmtrKovalenko/date-io/pull/632
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format)
      .replace(/a/gi, '(a|p)m')
      .replace('iY', 'Y')
      .replace('iM', 'M')
      .replace('iD', 'D')
      .toLocaleLowerCase();
  };

  public getWeekNumber = (date: defaultMoment.Moment) => {
    return date.iWeek();
  };
}
