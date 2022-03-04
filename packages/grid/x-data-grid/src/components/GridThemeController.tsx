import * as React from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { gridThemePaletteSelector } from '../hooks/features/theme/gridThemeSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

const GridThemeController = ({ children }) => {
  const apiRef = useGridApiContext();
  const themePalette = gridThemePaletteSelector(apiRef);
  const parentTheme = useTheme()

  const themeWithCustomPalette = React.useMemo(
    () => {
      if (themePalette) {
        return deepmerge(parentTheme, createTheme({ palette: themePalette }))
      }
      return parentTheme
    },
    [parentTheme, themePalette],
  );
  return (
    <ThemeProvider
      // theme={outerTheme => ({ darkMode: true, ...outerTheme })}
      theme={(themeWithCustomPalette)}
    >
      {children}
    </ThemeProvider>
  );
};

export { GridThemeController };
