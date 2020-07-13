import { getAppTheme } from './utils';
import { ThemeColors } from './themeColors';

export const lightColors: ThemeColors = {
  app: '#1976d2',
  xColor: 'rgb(52, 54, 57)',
  xShadowColor: '#a5a5a5',
  secondApp: 'rgb(52, 54, 57)',
  secondTitle: '#2b2d2f',
  contrastText: '#000',
  background: '#ffffff',
  backgroundLight: '#f8f8f8',
  breadcrumbsBg: '#cecece4f',
  breadcrumbsTitle: '#0000008a',
  breadcrumbsTitleCurrent: '#2b2d2f',
  breadcrumbsBorderBottom: '#1976d2',
  panelTitle: '#1976d2',
  panelTitleBg: '#ffffff',
  text: '#f1f1f1', // '#f1f1f1', //#e1e1e1  very similar white
  label: '#0000008a',
  panelBorder: '#1976d2',
  panelBackground: '#ffffff',
  grid: {
    headerTitle: '#2b2d2f',
    headerBackground: '#cecece4f',
    oddRowBackground: '#fcfcfc', // '#9e9e9e0f',
    evenRowBackground: '#fff',
    rowColor: '#000',
    headerBorderRight: '#2b2d2f3d',
    rowHoverBackground: '#4b99ec52',
    rowSelectedBackground: '#1976d2',
    rowHoverColor: '#000',
    rowSelectedColor: '#ffffff',
  },
};

export const lightThemeId = 'finui_light';
export const lightTheme = getAppTheme(lightThemeId, lightColors, 'light');
