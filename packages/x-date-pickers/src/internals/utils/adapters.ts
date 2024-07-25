import { warnOnce } from './warning';

export const assertDateFnsAdapter = (
  addDays: any,
  lib = 'date-fns',
  packageName = 'AdapterDateFnsV3',
) => {
  if (typeof addDays !== 'function') {
    throw new Error(
      [
        `MUI: The \`${lib}\` package v3.x is not compatible with this adapter.`,
        `Please, install v2.x of the package or use the \`${packageName}\` instead.`,
      ].join('\n'),
    );
  }
};

export const assertDateFnsAdapterV3 = (
  addDays: any,
  longFormatters: any,
  lib = 'date-fns',
  packageName = 'AdapterDateFns',
) => {
  if (typeof addDays !== 'function') {
    throw new Error(
      [
        `MUI: The \`${lib}\` package v2.x is not compatible with this adapter.`,
        `Please, install v3.x of the package or use the \`${packageName}\` instead.`,
      ].join('\n'),
    );
  }
  if (!longFormatters) {
    throw new Error(
      `MUI: The minimum supported \`${lib}\` package version compatible with this adapter is \`3.2.x\`.`,
    );
  }
};

export const warnUndefinedDayjsLocale = () => {
  if (process.env.NODE_ENV !== 'production') {
    warnOnce([
      'MUI X: Your locale has not been found.',
      'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale.',
      "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
      'fallback on English locale.',
    ]);
  }
};
