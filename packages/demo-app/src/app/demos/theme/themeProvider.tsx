//old blue: #3f51b5
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import React from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemeColors } from './utils';
import { lightTheme, lightThemeId } from './light';
import { darkTheme, darkThemeId } from './dark';

export const STORAGE_THEME_KEY = 'theme';

export const DEFAULT_THEME = lightThemeId;

export const ThemeValuePair: { [key: string]: AppTheme } = {};
ThemeValuePair[darkThemeId] = darkTheme;
ThemeValuePair[lightThemeId] = lightTheme;

export interface AppTheme extends PaletteOptions {
  id: string;
  colors: ThemeColors;
  type: 'dark' | 'light';
}

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
