import { createTheme, ThemeOptions } from '@mui/material/styles';
import { getMD3Theme } from './md3';
import { getCustomTheme } from './customTheme';

type PaletteMode = 'light' | 'dark';
export type Themes = 'default' | 'md3' | 'custom';

function getDefaultTheme(mode: PaletteMode): ThemeOptions {
  return {
    palette: {
      mode,
    },
  };
}

export const getTheme = (mode: PaletteMode, selectedTheme: Themes): ThemeOptions => {
  if (selectedTheme === 'md3') {
    return createTheme(getMD3Theme(mode));
  }

  if (selectedTheme === 'custom') {
    return createTheme(getCustomTheme(mode));
  }

  return createTheme(getDefaultTheme(mode));
};
