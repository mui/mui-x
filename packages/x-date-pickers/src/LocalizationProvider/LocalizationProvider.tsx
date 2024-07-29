import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '../models';
import { PickersInputLocaleText } from '../locales';

export interface MuiPickersAdapterContextValue<TDate extends PickerValidDate> {
  defaultDates: {
    minDate: TDate;
    maxDate: TDate;
  };

  utils: MuiPickersAdapter<TDate>;
  localeText: PickersInputLocaleText<TDate> | undefined;
}

export type MuiPickersAdapterContextNullableValue<TDate extends PickerValidDate> = {
  [K in keyof MuiPickersAdapterContextValue<TDate>]: MuiPickersAdapterContextValue<TDate>[K] | null;
};

export const MuiPickersAdapterContext =
  React.createContext<MuiPickersAdapterContextNullableValue<any> | null>(null);

if (process.env.NODE_ENV !== 'production') {
  MuiPickersAdapterContext.displayName = 'MuiPickersAdapterContext';
}

export interface LocalizationProviderProps<TDate extends PickerValidDate, TLocale> {
  children?: React.ReactNode;
  /**
   * Date library adapter class function.
   * @see See the localization provider {@link https://mui.com/x/react-date-pickers/getting-started/#setup-your-date-library-adapter date adapter setup section} for more details.
   */
  dateAdapter?: new (...args: any) => MuiPickersAdapter<TDate, TLocale>;
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
  localeText?: PickersInputLocaleText<TDate>;
}

type LocalizationProviderComponent = (<TDate extends PickerValidDate, TLocale>(
  props: LocalizationProviderProps<TDate, TLocale>,
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
export const LocalizationProvider = function LocalizationProvider<
  TDate extends PickerValidDate,
  TLocale,
>(inProps: LocalizationProviderProps<TDate, TLocale>) {
  const { localeText: inLocaleText, ...otherInProps } = inProps;

  const { utils: parentUtils, localeText: parentLocaleText } = React.useContext(
    MuiPickersAdapterContext,
  ) ?? { utils: undefined, localeText: undefined };

  const props: LocalizationProviderProps<TDate, TLocale> = useThemeProps({
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

  const utils = React.useMemo(() => {
    if (!DateAdapter) {
      if (parentUtils) {
        return parentUtils;
      }

      return null;
    }

    const adapter = new DateAdapter({
      locale: adapterLocale,
      formats: dateFormats,
      instance: dateLibInstance,
    });

    if (!adapter.isMUIAdapter) {
      throw new Error(
        [
          'MUI X: The date adapter should be imported from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro`, not from `@date-io`',
          "For example, `import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'` instead of `import AdapterDayjs from '@date-io/dayjs'`",
          'More information on the installation documentation: https://mui.com/x/react-date-pickers/getting-started/#installation',
        ].join(`\n`),
      );
    }

    return adapter;
  }, [DateAdapter, adapterLocale, dateFormats, dateLibInstance, parentUtils]);

  const defaultDates: MuiPickersAdapterContextNullableValue<TDate>['defaultDates'] =
    React.useMemo(() => {
      if (!utils) {
        return null;
      }

      return {
        minDate: utils.date('1900-01-01T00:00:00.000'),
        maxDate: utils.date('2099-12-31T00:00:00.000'),
      };
    }, [utils]);

  const contextValue: MuiPickersAdapterContextNullableValue<TDate> = React.useMemo(() => {
    return {
      utils,
      defaultDates,
      localeText,
    };
  }, [defaultDates, utils, localeText]);

  return (
    <MuiPickersAdapterContext.Provider value={contextValue}>
      {children}
    </MuiPickersAdapterContext.Provider>
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
   * @see See the localization provider {@link https://mui.com/x/react-date-pickers/getting-started/#setup-your-date-library-adapter date adapter setup section} for more details.
   */
  dateAdapter: PropTypes.func,
  /**
   * Formats that are used for any child pickers
   */
  dateFormats: PropTypes.shape({
    dayOfMonth: PropTypes.string,
    dayOfMonthFull: PropTypes.string,
    fullDate: PropTypes.string,
    fullTime: PropTypes.string,
    fullTime12h: PropTypes.string,
    fullTime24h: PropTypes.string,
    hours12h: PropTypes.string,
    hours24h: PropTypes.string,
    keyboardDate: PropTypes.string,
    keyboardDateTime: PropTypes.string,
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
