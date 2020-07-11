import { AppTheme } from './themeProvider';

export interface ThemeColors {
  app: string;
  xColor: string;
  xShadowColor: string;
  secondApp: string;
  secondTitle: string;
  contrastText: string;
  background: string;
  backgroundLight: string;
  breadcrumbsBg: string;
  breadcrumbsTitle: string;
  breadcrumbsTitleCurrent: string;
  breadcrumbsBorderBottom: string;
  panelTitle: string;
  panelTitleBg: string;
  text: string;
  label: string;
  panelBackground: string;
  panelBorder: string;
  grid: {
    headerTitle: string;
    headerBackground: string;
    oddRowBackground: string;
    evenRowBackground: string;
    rowColor: string;
    headerBorderRight: string;
    rowHoverBackground: string;
    rowHoverColor: string;
    rowSelectedBackground: string;
    rowSelectedColor: string;
  };
}

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
