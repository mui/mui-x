import * as React from 'react';
import {
  MuiPickersAdapterContext,
  MuiPickersAdapterContextValue,
} from '../../LocalizationProvider/LocalizationProvider';
import { DEFAULT_LOCALE } from '../../locales/enUS';
import { PickersLocaleText } from '../../locales/utils/pickersLocaleTextApi';

export const useLocalizationContext = <TDate>() => {
  const localization = React.useContext(MuiPickersAdapterContext);
  if (localization === null) {
    throw new Error(
      [
        'MUI: Can not find the date and time pickers localization context.',
        'It looks like you forgot to wrap your component in LocalizationProvider.',
        'This can also happen if you are bundling multiple versions of the `@mui/x-date-pickers` package',
      ].join('\n'),
    );
  }

  if (localization.utils === null) {
    throw new Error(
      [
        'MUI: Can not find the date and time pickers adapter from its localization context.',
        'It looks like you forgot to pass a `dateAdapter` to your LocalizationProvider.',
      ].join('\n'),
    );
  }

  const localeText = React.useMemo(
    () => ({ ...DEFAULT_LOCALE, ...localization.localeText }),
    [localization.localeText],
  );

  return {
    ...localization,
    localeText,
  } as Omit<MuiPickersAdapterContextValue<TDate>, 'localeText'> & {
    localeText: PickersLocaleText<TDate>;
  };
};

export const useUtils = <TDate>() => useLocalizationContext<TDate>().utils;

export const useDefaultDates = <TDate>() => useLocalizationContext<TDate>().defaultDates;

export const useLocaleText = <TDate>() => useLocalizationContext<TDate>().localeText;

export const useNow = <TDate>(): TDate => {
  const utils = useUtils<TDate>();
  const now = React.useRef(utils.date());

  return now.current!;
};
