import * as React from 'react';
import {
  PickerAdapterContext,
  PickersAdapterContextValue,
} from '../../LocalizationProvider/LocalizationProvider';
import { DEFAULT_LOCALE } from '../../locales/enUS';
import { PickersLocaleText } from '../../locales/utils/pickersLocaleTextApi';
import { PickersTimezone, PickerValidDate } from '../../models';
import { usePickerAdapter } from '../../hooks/usePickerAdapter';

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

export const useDefaultDates = () => useLocalizationContext().defaultDates;

export const useNow = (timezone: PickersTimezone): PickerValidDate => {
  const adapter = usePickerAdapter();

  const now = React.useRef<PickerValidDate>(undefined);
  if (now.current === undefined) {
    now.current = adapter.date(undefined, timezone);
  }

  return now.current!;
};

export interface UseLocalizationContextReturnValue
  extends Omit<PickersAdapterContextValue, 'localeText'> {
  localeText: PickersLocaleText;
}
