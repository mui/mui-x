import * as React from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';
import { DEFAULT_THEME, STORAGE_THEME_KEY, ThemeValuePair } from './themeProvider';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import { AppTheme } from './appTheme';

type ReturnType = {
  theme: AppTheme;
  themeId: string;
  toggleTheme: () => void;
  isDark: boolean;
};

export function useTheme(): ReturnType {
  const [selectedThemeId, setSelectedTheme] = useLocalStorage(STORAGE_THEME_KEY, DEFAULT_THEME);

  const [theme, setTheme] = React.useState(ThemeValuePair[selectedThemeId]);
  const [isDark, setIsDark] = React.useState(theme.id === darkTheme.id);

  React.useEffect(() => {
    setIsDark(theme === darkTheme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme);
      setSelectedTheme(darkTheme.id);
    } else {
      setTheme(lightTheme);
      setSelectedTheme(lightTheme.id);
    }
  };
  return { theme, themeId: theme.id, toggleTheme, isDark };
}
