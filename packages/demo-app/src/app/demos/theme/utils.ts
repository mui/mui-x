import { AppTheme } from './appTheme';
import { ThemeColors } from './themeColors';

export function getAppTheme(id: string, colors: ThemeColors, type: 'dark' | 'light'): AppTheme {
  return {
    id,
    colors,
    type,
    primary: {
      light: colors.backgroundLight,
      main: colors.app,
      dark: colors.background,
      contrastText: colors.text,
    },
    secondary: {
      light: colors.breadcrumbsBg,
      contrastText: colors.contrastText,
      dark: colors.breadcrumbsTitleCurrent,
      main: colors.secondApp,
    },
  };
}
