import * as React from 'react';
import {
  MuiPickersAdapterContext,
  MuiPickersAdapterContextValue,
} from '../../LocalizationProvider/LocalizationProvider';

const useLocalizationContext = <T>() => {
  const localization = React.useContext(MuiPickersAdapterContext);
  if (localization === null) {
    throw new Error(
      'MUI: Can not find utils in context. It looks like you forgot to wrap your component in LocalizationProvider, or pass dateAdapter prop directly.',
    );
  }

  return localization as MuiPickersAdapterContextValue<T>;
};

export const useUtils = <T>() => useLocalizationContext<T>().utils;

export const useDefaultDates = <T>() => useLocalizationContext<T>().defaultDates;

export const useNow = <TDate>(): TDate => {
  const utils = useUtils<TDate>();
  const now = React.useRef(utils.date());

  return now.current!;
};
