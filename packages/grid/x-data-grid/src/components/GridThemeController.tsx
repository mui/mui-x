import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { gridThemeModeSelector } from '../hooks/features/theme/gridThemeSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

const GridThemeController = ({ children }) => {
  const apiRef = useGridApiContext();
  const themeMode = gridThemeModeSelector(apiRef);

  return (
    <ThemeProvider
      theme={(outerTheme) => {
        if (themeMode == null) {
          return outerTheme;
        }
        return createTheme({ ...outerTheme, palette: { mode: themeMode } });
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export { GridThemeController };
