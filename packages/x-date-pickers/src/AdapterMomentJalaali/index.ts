/* eslint-disable class-methods-use-this */
import BaseAdapterMomentJalaali from '@date-io/jalaali';
import defaultMoment, { LongDateFormatKey } from 'moment-jalaali';
import { MuiFormatTokenMap, MuiPickersAdapter } from '../internals/models';

type Moment = defaultMoment.Moment;

// From https://momentjs.com/docs/#/displaying/format/
const formatTokenMap: MuiFormatTokenMap = {
  // Month
  jM: 'month',
  jMo: 'month',
  jMM: 'month',
  jMMM: { sectionName: 'month', contentType: 'letter' },
  jMMMM: { sectionName: 'month', contentType: 'letter' },

  // Day of Month
  jD: 'day',
  jDo: 'day',
  jDD: 'day',

  // Year
  jYY: 'year',
  jYYYY: 'year',
  jYYYYYY: 'year',

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

export class AdapterMomentJalaali
  extends BaseAdapterMomentJalaali
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
      .replace('dd', 'jDD'); // Fix for https://github.com/dmtrKovalenko/date-io/pull/632;
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format)
      .replace(/a/gi, '(a|p)m')
      .replace('jY', 'Y')
      .replace('jM', 'M')
      .replace('jD', 'D')
      .toLocaleLowerCase();
  };

  public getWeekNumber = (date: defaultMoment.Moment) => {
    return date.jWeek();
  };

  public addYears = (date: Moment, count: number) => {
    return count < 0
      ? date.clone().subtract(Math.abs(count), 'jYear')
      : date.clone().add(count, 'jYear');
  };

  public addMonths = (date: Moment, count: number) => {
    return count < 0
      ? date.clone().subtract(Math.abs(count), 'jMonth')
      : date.clone().add(count, 'jMonth');
  };

  public setMonth = (date: Moment, month: number) => {
    return date.clone().jMonth(month);
  };

  public isValid = (value: any) => {
    // We can't to `this.moment(value)` because moment-jalaali looses the invalidity information when creating a new moment object from an existing one
    if (!this.moment.isMoment(value)) {
      return false;
    }

    return value.isValid(value);
  };
}
