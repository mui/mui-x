import * as React from 'react';
import {
  MuiPickersAdapterContext,
  MuiPickersAdapterContextValue,
} from '../../LocalizationProvider/LocalizationProvider';
import { DEFAULT_LOCALE } from '../../locales/enUS';
import { PickersLocaleText } from '../../locales/utils/pickersLocaleTextApi';
import { PickersTimezone, PickerValidDate } from '../../models';

export const useLocalizationContext = <TDate extends PickerValidDate>() => {
  const localization = React.useContext(MuiPickersAdapterContext);
  if (localization === null) {
    throw new Error(
      [
        'MUI X: Can not find the date and time pickers localization context.',
        'It looks like you forgot to wrap your component in LocalizationProvider.',
        'This can also happen if you are bundling multiple versions of the `@mui/x-date-pickers` package',
      ].join('\n'),
    );
  }

  if (localization.utils === null) {
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
      }) as Omit<MuiPickersAdapterContextValue<TDate>, 'localeText'> & {
        localeText: PickersLocaleText<TDate>;
      },
    [localization, localeText],
  );
};

export const useUtils = <TDate extends PickerValidDate>() => useLocalizationContext<TDate>().utils;

export const useDefaultDates = <TDate extends PickerValidDate>() =>
  useLocalizationContext<TDate>().defaultDates;

export const useNow = <TDate extends PickerValidDate>(timezone: PickersTimezone): TDate => {
  const utils = useUtils<TDate>();

  const now = React.useRef() as React.MutableRefObject<TDate>;
  if (now.current === undefined) {
    now.current = utils.date(undefined, timezone);
  }

  return now.current!;
};
