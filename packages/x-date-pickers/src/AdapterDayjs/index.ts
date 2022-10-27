import { Dayjs } from 'dayjs';
import BaseAdapterDayjs from '@date-io/dayjs';
import { MuiFormatTokenMap, MuiPickerFieldAdapter } from '../internals/models';
import { buildWarning } from '../internals/utils/warning';

const localeNotFoundWarning = buildWarning([
  'Your locale has not been found.',
  'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale',
  "Or you forget to import the locale with `require('dayjs/locale/{localeUsed}')`",
  'fallback on English locale',
]);

const formatTokenMap: MuiFormatTokenMap = {
  YY: 'year',
  YYYY: 'year',
  M: 'month',
  MM: 'month',
  MMM: { sectionName: 'month', contentType: 'letter' },
  MMMM: { sectionName: 'month', contentType: 'letter' },
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
  A: 'meridiem',
  a: 'meridiem',
};

export class AdapterDayjs extends BaseAdapterDayjs implements MuiPickerFieldAdapter<Dayjs> {
  public formatTokenMap = formatTokenMap;

  /**
   * The current getFormatHelperText method uses an outdated format parsing logic.
   * We should use this one in the future to support all localized formats.
   */
  public expandFormat = (format: string) => {
    const localeObject = this.rawDayJsInstance.Ls[this.locale || 'en'];

    console.log('HEY', this.locale);

    if (localeObject === undefined) {
      localeNotFoundWarning();
    }
    const localeFormats =
      localeObject === undefined ? this.rawDayJsInstance.Ls.en.formats : localeObject.formats;

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
