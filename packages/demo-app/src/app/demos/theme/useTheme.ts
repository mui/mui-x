import * as React from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';
import { STORAGE_THEME_KEY, ThemeContext, ThemeValuePair } from './themeProvider';
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
  const currentThemeCtx = React.useContext(ThemeContext);
  const [themeId, setSelectedTheme] = useLocalStorage(STORAGE_THEME_KEY, currentThemeCtx.theme);

  const [theme, setTheme] = React.useState(ThemeValuePair[themeId]);
  const [isDark, setIsDark] = React.useState(theme === darkTheme);

  React.useEffect(() => {
    const newTheme = ThemeValuePair[currentThemeCtx.theme];
    setTheme(newTheme);
    setSelectedTheme(currentThemeCtx.theme);
    setIsDark(newTheme === darkTheme);
  }, [currentThemeCtx, setSelectedTheme]);

  const toggleTheme = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme);
      setSelectedTheme(darkTheme.id);
      currentThemeCtx.toggleTheme();
    } else {
      setTheme(lightTheme);
      setSelectedTheme(lightTheme.id);
      currentThemeCtx.toggleTheme();
    }
  };
  return { theme, themeId, toggleTheme, isDark };
}
