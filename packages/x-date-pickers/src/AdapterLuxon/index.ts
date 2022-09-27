import { DateTime } from 'luxon';
import BaseAdapterLuxon from '@date-io/luxon';
import { MuiFormatTokenMap, MuiPickerFieldAdapter } from '../internals/models';
import { buildWarning } from '../internals/utils/warning';

const luxonVersionWarning = buildWarning([
  'Your luxon version does not support `expandFormat`.',
  'Consider upgrading it to v3.0.2 or above to have access to the helper text.',
]);

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
};

export class AdapterLuxon extends BaseAdapterLuxon implements MuiPickerFieldAdapter<DateTime> {
  public formatTokenMap = formatTokenMap;

  // eslint-disable-next-line class-methods-use-this
  public expandFormat = (format: string) => {
    if (!DateTime.expandFormat) {
      throw Error(
        'Your luxon version does not support `expandFormat`. Consider upgrading it to v3.0.2',
      );
    }
    // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
    // This value is supported by luxon parser but not luxon formatter.
    // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
    return DateTime.expandFormat(format).replace('yyyyy', 'yyyy');
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    if (!DateTime.expandFormat) {
      luxonVersionWarning();
      return '';
    }
    return this.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();
  };
}
