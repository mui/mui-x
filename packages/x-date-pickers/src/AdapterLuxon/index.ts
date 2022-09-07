import { DateTime } from 'luxon';
import BaseAdapterLuxon from '@date-io/luxon';
import { MuiFormatTokenMap, MuiPickerFieldAdapter } from '../internals/models';

const formatTokenMap: MuiFormatTokenMap = {
  // seconds
  s: 'second',
  ss: 'second',
  // minutes
  m: 'minute',
  mm: 'minute',
  // hours
  H: 'hour',
  HH: 'hour',
  h: 'hour',
  hh: 'hour',
  // meridiems
  a: 'am-pm',
  // dates
  d: 'day',
  dd: 'day',

  L: 'month',
  LL: 'month',
  LLL: 'month',
  LLLL: 'month',
  LLLLL: 'month',
  // months - format
  M: 'month',
  MM: 'month',
  MMM: 'month',
  MMMM: 'month',
  MMMMM: 'month',

  // years
  y: 'year',
  yy: 'year',
  yyyy: 'year',
  yyyyy: 'year',
};

export class AdapterLuxon extends BaseAdapterLuxon implements MuiPickerFieldAdapter<DateTime> {
  public formatTokenMap = formatTokenMap;

  // eslint-disable-next-line class-methods-use-this
  public expandFormat = (format: string) => {
    return DateTime.expandFormat(format);
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
  };
}
