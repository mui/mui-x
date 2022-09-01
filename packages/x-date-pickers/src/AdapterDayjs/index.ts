import { Dayjs } from 'dayjs';
import BaseAdapterDayjs from '@date-io/dayjs';
import { MuiFormatTokenMap, MuiPickerFieldAdapter } from '../internals/models';

const formatTokenMap: MuiFormatTokenMap = {
  YY: 'year',
  YYYY: 'year',
  M: 'month',
  MM: 'month',
  MMM: 'month',
  MMMM: 'month',
  D: 'day',
  DD: 'day',
  H: 'hour',
  HH: 'hour',
  h: 'hour',
  hh: 'hour',
  m: 'minute',
  mm: 'minute',
  s: 'second',
  ss: 'second',
  A: 'am-pm',
  a: 'am-pm',
};

export class AdapterDayjs extends BaseAdapterDayjs implements MuiPickerFieldAdapter<Dayjs> {
  public formatTokenMap = formatTokenMap;

  /**
   * The current getFormatHelperText method uses an outdated format parsing logic.
   * We should use this one in the future to support all localized formats.
   */
  public expandFormat = (format: string) => {
    const localeFormats = this.rawDayJsInstance.Ls[this.locale || 'en']?.formats;

    // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
    const t = (formatBis: string) =>
      formatBis.replace(
        /(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,
        (_: string, a: string, b: string) => a || b.slice(1),
      );

    return format.replace(
      /(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,
      (_: string, a: string, b: string) => {
        const B = b && b.toUpperCase();
        return (
          a ||
          localeFormats[b as keyof typeof localeFormats] ||
          t(localeFormats[B as keyof typeof localeFormats] as string)
        );
      },
    );
  };

  // Redefined here just to show how it can be written using expandFormat
  public getFormatHelperText = (format: string) => {
    return this.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
  };
}
