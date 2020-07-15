import * as React from 'react';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
// eslint-disable-next-line no-restricted-imports
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { lightTheme, lightThemeId } from './light';
import { darkTheme, darkThemeId } from './dark';
import { AppTheme } from './appTheme';

export const STORAGE_THEME_KEY = 'theme';

export const DEFAULT_THEME = lightThemeId;

export const ThemeValuePair: { [key: string]: AppTheme } = {};
ThemeValuePair[darkThemeId] = darkTheme;
ThemeValuePair[lightThemeId] = lightTheme;

export interface ThemeProviderProps {
  children?: React.ReactNode;
  theme: AppTheme;
  toggleTheme: () => void;
}

type AppThemeContext = { theme: string; toggleTheme: () => void };

const item = window.localStorage.getItem(STORAGE_THEME_KEY);
const themeToLoad = item != null ? JSON.parse(item) : DEFAULT_THEME;
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext<AppThemeContext>({
  theme: themeToLoad,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = props => {
  const muiTheme = createMuiTheme({
    palette: props.theme as PaletteOptions,
  });

  return (
    <ThemeContext.Provider value={{ theme: props.theme.id, toggleTheme: props.toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <SCThemeProvider theme={props.theme}>{props.children}</SCThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
