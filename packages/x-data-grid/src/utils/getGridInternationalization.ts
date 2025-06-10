import { GridLocaleText } from '../models/api/gridLocaleTextApi';

export type Internationalization = Pick<
  GridLocaleText,
  'intlNumberFormat' | 'intlDateFormat' | 'intlDateTimeFormat'
>;

export const getGridInternationalization = (
  locales?: Intl.LocalesArgument,
): Internationalization => {
  const internationalization = {
    numberFormat: new Intl.NumberFormat(locales),
    dateFormat: new Intl.DateTimeFormat(locales),
    dateTimeFormat: new Intl.DateTimeFormat(locales, {
      dateStyle: 'short',
      timeStyle: 'medium',
    }),
  };

  return {
    intlNumberFormat: (number: number) => internationalization.numberFormat.format(number),
    intlDateFormat: (date: Date) => internationalization.dateFormat.format(date),
    intlDateTimeFormat: (date: Date) => internationalization.dateFormat.format(date),
  };
};
