import * as React from 'react';
import {
  MuiPickersAdapterContext,
  MuiPickersAdapterContextValue,
} from '@mui/lab/LocalizationProvider';

// Required for babel https://github.com/vercel/next.js/issues/7882. Replace with `export type` in future
export type MuiPickersAdapter<TDate = unknown> =
    import('@mui/lab/LocalizationProvider').MuiPickersAdapter<TDate>;


const useLocalizationContext = <T>() => {
  const localization = React.useContext(MuiPickersAdapterContext);
  if (localization === null) {
    throw new Error(
      'MUI: Can not find utils in context. It looks like you forgot to wrap your component in LocalizationProvider, or pass dateAdapter prop directly.',
    );
  }

  return localization as MuiPickersAdapterContextValue<T>;
};

export const useDateUtils = <T = unknown>() => useLocalizationContext<T>().utils;

export const useDefaultDates = <T>() => useLocalizationContext<T>().defaultDates

export const useNow = <TDate = unknown>(): TDate => {
  const utils = useDateUtils<TDate>();
  const now = React.useRef(utils.date());

  return now.current!;
}
