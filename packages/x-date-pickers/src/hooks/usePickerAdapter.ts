'use client';
import * as React from 'react';
import { DEFAULT_LOCALE } from '../locales/enUS';
import {
  PickerAdapterContext,
  PickersAdapterContextValue,
} from '../LocalizationProvider/LocalizationProvider';
import { PickersLocaleText } from '../locales/utils/pickersLocaleTextApi';

export const useLocalizationContext = () => {
  const localization = React.useContext(PickerAdapterContext);
  if (localization === null) {
    throw new Error(
      [
        'MUI X: Can not find the date and time pickers localization context.',
        'It looks like you forgot to wrap your component in LocalizationProvider.',
        'This can also happen if you are bundling multiple versions of the `@mui/x-date-pickers` package',
      ].join('\n'),
    );
  }

  if (localization.adapter === null) {
    throw new Error(
      [
        'MUI X: Can not find the date and time pickers adapter from its localization context.',
        'It looks like you forgot to pass a `dateAdapter` to your LocalizationProvider.',
      ].join('\n'),
    );
  }

  const localeText = React.useMemo(
    () => ({ ...DEFAULT_LOCALE, ...localization.localeText }),
    [localization.localeText],
  );

  return React.useMemo(
    () =>
      ({
        ...localization,
        localeText,
      }) as UseLocalizationContextReturnValue,
    [localization, localeText],
  );
};

export interface UseLocalizationContextReturnValue
  extends Omit<PickersAdapterContextValue, 'localeText'> {
  localeText: PickersLocaleText;
}

export const usePickerAdapter = () => useLocalizationContext().adapter;
