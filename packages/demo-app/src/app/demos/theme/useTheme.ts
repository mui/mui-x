import { useLocalStorage } from '../utils/useLocalStorage';
import { AppTheme, STORAGE_THEME_KEY, ThemeContext, ThemeValuePair } from './themeProvider';
import { useContext, useEffect, useState } from 'react';
import { darkTheme } from './dark';
import { lightTheme } from './light';

type ReturnType = [AppTheme, string, () => void, boolean];

export function useTheme(): ReturnType {
  const currentThemeCtx = useContext(ThemeContext);
  const [selectedThemeId, setSelectedTheme] = useLocalStorage(STORAGE_THEME_KEY, currentThemeCtx.theme);

  const [theme, setTheme] = useState(ThemeValuePair[selectedThemeId]);
  const [isDark, setIsDark] = useState(theme === darkTheme);

  useEffect(() => {
    const newTheme = ThemeValuePair[currentThemeCtx.theme];
    setTheme(newTheme);
    setSelectedTheme(currentThemeCtx.theme);
    setIsDark(newTheme === darkTheme);
  }, [currentThemeCtx]);

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
  return [theme, selectedThemeId, toggleTheme, isDark];
}
