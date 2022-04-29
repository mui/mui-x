import * as React from 'react';
import PropTypes from 'prop-types';
import { DateIOFormats } from '@date-io/core/IUtils';
import { useThemeProps } from '@mui/material/styles';
import { MuiPickersAdapter } from '../internals/models';
import { DEFAULT_LOCALE, PickersLocaleText } from '../locales';

export interface MuiPickersAdapterContextValue<TDate> {
  defaultDates: {
    minDate: TDate;
    maxDate: TDate;
  };

  utils: MuiPickersAdapter<TDate>;
  localeText: PickersLocaleText;
}

export const MuiPickersAdapterContext =
  React.createContext<MuiPickersAdapterContextValue<unknown> | null>(null);
if (process.env.NODE_ENV !== 'production') {
  MuiPickersAdapterContext.displayName = 'MuiPickersAdapterContext';
}

export interface LocalizationProviderProps {
  children?: React.ReactNode;
  /** DateIO adapter class function */
  dateAdapter: new (...args: any) => MuiPickersAdapter<unknown>;
  /** Formats that are used for any child pickers */
  dateFormats?: Partial<DateIOFormats>;
  /**
   * Date library instance you are using, if it has some global overrides
   * ```jsx
   * dateLibInstance={momentTimeZone}
   * ```
   */
  dateLibInstance?: any;
  /** Locale for the date library you are using
   * @deprecated Use `adapterLocale` instead
   */
  locale?: string | object;
  /** Locale for the date library you are using
   */
  adapterLocale?: string | object;
  /**
   * Locale for components texts
   */
  localeText?: Partial<PickersLocaleText>;
}

let warnedOnce = false;

/**
 * @ignore - do not document.
 */
export function LocalizationProvider(inProps: LocalizationProviderProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiLocalizationProvider' });

  const {
    children,
    dateAdapter: Utils,
    dateFormats,
    dateLibInstance,
    locale,
    adapterLocale,
    localeText,
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnce && locale !== undefined) {
      warnedOnce = true;
      console.warn(
        "LocalizationProvider's prop `locale` is deprecated and replaced by `adapterLocale`",
      );
    }
  }

  const utils = React.useMemo(
    () =>
      new Utils({
        locale: adapterLocale ?? locale,
        formats: dateFormats,
        instance: dateLibInstance,
      }),
    [Utils, locale, adapterLocale, dateFormats, dateLibInstance],
  );

  const defaultDates: MuiPickersAdapterContextValue<unknown>['defaultDates'] = React.useMemo(() => {
    return {
      minDate: utils.date('1900-01-01T00:00:00.000'),
      maxDate: utils.date('2099-12-31T00:00:00.000'),
    };
  }, [utils]);

  const contextValue: MuiPickersAdapterContextValue<unknown> = React.useMemo(() => {
    return {
      utils,
      defaultDates,
      localeText: {
        ...DEFAULT_LOCALE,
        ...(localeText ?? {}),
      },
    };
  }, [defaultDates, utils, localeText]);

  return (
    <MuiPickersAdapterContext.Provider value={contextValue}>
      {children}
    </MuiPickersAdapterContext.Provider>
  );
}

LocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Locale for the date library you are using
   */
  adapterLocale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node,
  /**
   * DateIO adapter class function
   */
  dateAdapter: PropTypes.func.isRequired,
  /**
   * Formats that are used for any child pickers
   */
  dateFormats: PropTypes.shape({
    dayOfMonth: PropTypes.string,
    fullDate: PropTypes.string,
    fullDateTime: PropTypes.string,
    fullDateTime12h: PropTypes.string,
    fullDateTime24h: PropTypes.string,
    fullDateWithWeekday: PropTypes.string,
    fullTime: PropTypes.string,
    fullTime12h: PropTypes.string,
    fullTime24h: PropTypes.string,
    hours12h: PropTypes.string,
    hours24h: PropTypes.string,
    keyboardDate: PropTypes.string,
    keyboardDateTime: PropTypes.string,
    keyboardDateTime12h: PropTypes.string,
    keyboardDateTime24h: PropTypes.string,
    minutes: PropTypes.string,
    month: PropTypes.string,
    monthAndDate: PropTypes.string,
    monthAndYear: PropTypes.string,
    monthShort: PropTypes.string,
    normalDate: PropTypes.string,
    normalDateWithWeekday: PropTypes.string,
    seconds: PropTypes.string,
    shortDate: PropTypes.string,
    weekday: PropTypes.string,
    weekdayShort: PropTypes.string,
    year: PropTypes.string,
  }),
  /**
   * Date library instance you are using, if it has some global overrides
   * ```jsx
   * dateLibInstance={momentTimeZone}
   * ```
   */
  dateLibInstance: PropTypes.any,
  /**
   * Locale for the date library you are using
   * @deprecated Use `adapterLocale` instead
   */
  locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * Locale for components texts
   */
  localeText: PropTypes.object,
} as any;
