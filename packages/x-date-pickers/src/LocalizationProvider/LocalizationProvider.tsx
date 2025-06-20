'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '../models';
import { PickersInputLocaleText } from '../locales';

export interface PickersAdapterContextValue {
  defaultDates: {
    minDate: PickerValidDate;
    maxDate: PickerValidDate;
  };

  // TODO v9: Remove in favor of keeping only `adapter` field
  utils: MuiPickersAdapter;
  adapter: MuiPickersAdapter;
  localeText: PickersInputLocaleText | undefined;
}

export type PickerAdapterContextNullableValue = {
  [K in keyof PickersAdapterContextValue]: PickersAdapterContextValue[K] | null;
};

export const PickerAdapterContext = React.createContext<PickerAdapterContextNullableValue | null>(
  null,
);

// TODO v9: Remove this public export
/**
 * The context that provides the date adapter and default dates to the pickers.
 * @deprecated Use `usePickersAdapter` hook if you need access to the adapter instead.
 */
export const MuiPickersAdapterContext = PickerAdapterContext;

export interface LocalizationProviderProps<TLocale> {
  children?: React.ReactNode;
  /**
   * Date library adapter class function.
   * @see See the localization provider {@link https://mui.com/x/react-date-pickers/quickstart/#integrate-provider-and-adapter date adapter setup section} for more details.
   */
  dateAdapter?: new (...args: any) => MuiPickersAdapter<TLocale>;
  /** Formats that are used for any child pickers */
  dateFormats?: Partial<AdapterFormats>;
  /**
   * Date library instance you are using, if it has some global overrides
   * ```jsx
   * dateLibInstance={momentTimeZone}
   * ```
   */
  dateLibInstance?: any;
  /**
   * Locale for the date library you are using
   */
  adapterLocale?: TLocale;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputLocaleText;
}

type LocalizationProviderComponent = (<TLocale>(
  props: LocalizationProviderProps<TLocale>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [Date format and localization](https://mui.com/x/react-date-pickers/adapters-locale/)
 * - [Calendar systems](https://mui.com/x/react-date-pickers/calendar-systems/)
 * - [Translated components](https://mui.com/x/react-date-pickers/localization/)
 * - [UTC and timezones](https://mui.com/x/react-date-pickers/timezone/)
 *
 * API:
 *
 * - [LocalizationProvider API](https://mui.com/x/api/date-pickers/localization-provider/)
 */
export const LocalizationProvider = function LocalizationProvider<TLocale>(
  inProps: LocalizationProviderProps<TLocale>,
) {
  const { localeText: inLocaleText, ...otherInProps } = inProps;

  const { adapter: parentAdapter, localeText: parentLocaleText } = React.useContext(
    PickerAdapterContext,
  ) ?? { utils: undefined, adapter: undefined, localeText: undefined };

  const props: LocalizationProviderProps<TLocale> = useThemeProps({
    // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
    // We will then merge this theme value with our value manually
    props: otherInProps,
    name: 'MuiLocalizationProvider',
  });

  const {
    children,
    dateAdapter: DateAdapter,
    dateFormats,
    dateLibInstance,
    adapterLocale,
    localeText: themeLocaleText,
  } = props;

  const localeText = React.useMemo(
    () => ({ ...themeLocaleText, ...parentLocaleText, ...inLocaleText }),
    [themeLocaleText, parentLocaleText, inLocaleText],
  );

  const adapter = React.useMemo(() => {
    if (!DateAdapter) {
      if (parentAdapter) {
        return parentAdapter;
      }

      return null;
    }

    const dateAdapter = new DateAdapter({
      locale: adapterLocale,
      formats: dateFormats,
      instance: dateLibInstance,
    });

    if (!dateAdapter.isMUIAdapter) {
      throw new Error(
        [
          'MUI X: The date adapter should be imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`, not from `@date-io`',
          "For example, `import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'` instead of `import AdapterDayjs from '@date-io/dayjs'`",
          'More information on the installation documentation: https://mui.com/x/react-date-pickers/quickstart/#installation',
        ].join(`\n`),
      );
    }

    return dateAdapter;
  }, [DateAdapter, adapterLocale, dateFormats, dateLibInstance, parentAdapter]);

  const defaultDates: PickerAdapterContextNullableValue['defaultDates'] = React.useMemo(() => {
    if (!adapter) {
      return null;
    }

    return {
      minDate: adapter.date('1900-01-01T00:00:00.000'),
      maxDate: adapter.date('2099-12-31T00:00:00.000'),
    };
  }, [adapter]);

  const contextValue: PickerAdapterContextNullableValue = React.useMemo(() => {
    return {
      utils: adapter,
      adapter,
      defaultDates,
      localeText,
    };
  }, [defaultDates, adapter, localeText]);

  return (
    <PickerAdapterContext.Provider value={contextValue}>{children}</PickerAdapterContext.Provider>
  );
} as LocalizationProviderComponent;

LocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Locale for the date library you are using
   */
  adapterLocale: PropTypes.any,
  children: PropTypes.node,
  /**
   * Date library adapter class function.
   * @see See the localization provider {@link https://mui.com/x/react-date-pickers/quickstart/#integrate-provider-and-adapter date adapter setup section} for more details.
   */
  dateAdapter: PropTypes.func,
  /**
   * Formats that are used for any child pickers
   */
  dateFormats: PropTypes.shape({
    dayOfMonth: PropTypes.string,
    dayOfMonthFull: PropTypes.string,
    fullDate: PropTypes.string,
    fullTime12h: PropTypes.string,
    fullTime24h: PropTypes.string,
    hours12h: PropTypes.string,
    hours24h: PropTypes.string,
    keyboardDate: PropTypes.string,
    keyboardDateTime12h: PropTypes.string,
    keyboardDateTime24h: PropTypes.string,
    meridiem: PropTypes.string,
    minutes: PropTypes.string,
    month: PropTypes.string,
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
   * Locale for components texts
   */
  localeText: PropTypes.object,
} as any;
