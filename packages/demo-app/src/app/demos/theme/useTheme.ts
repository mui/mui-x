import {useContext, useEffect, useRef, useState} from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';
import {DEFAULT_THEME, STORAGE_THEME_KEY, ThemeContext, ThemeValuePair} from './themeProvider';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import { AppTheme } from './appTheme';

type ReturnType = [AppTheme, string, () => void, boolean];

export function useTheme(): ReturnType {
  const [selectedThemeId, setSelectedTheme] = useLocalStorage(
    STORAGE_THEME_KEY,
    DEFAULT_THEME,
  );

  const [theme, setTheme] = useState(ThemeValuePair[selectedThemeId]);
  const [isDark, setIsDark] = useState(theme.id === darkTheme.id);

  useEffect(() => {
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
  return [theme, selectedThemeId, toggleTheme, isDark];
}
