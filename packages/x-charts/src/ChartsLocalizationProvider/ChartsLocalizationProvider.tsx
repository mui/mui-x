'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import type { ChartsLocaleText } from '../locales/utils/chartsLocaleTextApi';
import { DEFAULT_LOCALE } from '../locales/enUS';

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
   * Localized text for chart components.
   */
  localeText?: Partial<ChartsLocaleText>;
}

/**
 * Demos:
 *
 * - [localization](https://mui.com/x/react-charts/localization/)
 *
 * API:
 *
 * - [ChartsLocalizationProvider API](https://mui.com/x/api/charts/charts-localization-provider/)
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
      ...DEFAULT_LOCALE,
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
   * Localized text for chart components.
   */
  localeText: PropTypes.object,
} as any;

export { ChartsLocalizationProvider };
