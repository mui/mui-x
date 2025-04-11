'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { ChartsLocaleText } from '../locales';
import { CHARTS_DEFAULT_LOCALE_TEXT } from '../constants/defaultLocale';

export interface ChartsLocalizationContextValue {
  localeText: ChartsLocaleText;
}

export const ChartsLocalizationContext = React.createContext<ChartsLocalizationContextValue | null>(
  null,
);

if (process.env.NODE_ENV !== 'production') {
  ChartsLocalizationContext.displayName = 'ChartsLocalizationContext';
}

export interface ChartsLocalizationProviderProps {
  children?: React.ReactNode;
  /**
   * Locale for charts components texts
   */
  localeText?: Partial<ChartsLocaleText>;
}

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
function ChartsLocalizationProvider(inProps: ChartsLocalizationProviderProps) {
  const { localeText: inLocaleText, ...other } = inProps;

  const { localeText: parentLocaleText } = React.useContext(ChartsLocalizationContext) ?? {
    localeText: undefined,
  };

  const props: ChartsLocalizationProviderProps = useThemeProps({
    // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
    // We will then merge this theme value with our value manually
    props: other,
    name: 'MuiChartsLocalizationProvider',
  });

  const { children, localeText: themeLocaleText } = props;

  const localeText = React.useMemo(
    () => ({
      ...CHARTS_DEFAULT_LOCALE_TEXT,
      ...themeLocaleText,
      ...parentLocaleText,
      ...inLocaleText,
    }),
    [themeLocaleText, parentLocaleText, inLocaleText],
  );

  const contextValue: ChartsLocalizationContextValue = React.useMemo(() => {
    return {
      localeText,
    };
  }, [localeText]);

  return (
    <ChartsLocalizationContext.Provider value={contextValue}>
      {children}
    </ChartsLocalizationContext.Provider>
  );
}

ChartsLocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Locale for charts components texts
   */
  localeText: PropTypes.object,
} as any;

export { ChartsLocalizationProvider };
