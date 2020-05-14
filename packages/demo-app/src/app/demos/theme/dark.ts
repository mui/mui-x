import { ThemeColors, getAppTheme } from './utils';

export const darkColors: ThemeColors = {
  app: '#1976d2',
  secondApp: '#e2e2e2',
  secondTitle: '#e1e1e1',
  contrastText: '#000000',
  background: 'rgb(52, 54, 57)',
  backgroundLight: 'rgba(52, 54, 57, 0.95)',
  breadcrumbsBg: '#cecece4f',
  breadcrumbsTitle: '#0000008a',
  breadcrumbsTitleCurrent: '#2b2d2f',
  breadcrumbsBorderBottom: '#1976d2',
  panelTitle: '#e1e1e1',
  panelTitleBg: 'rgb(52, 54, 57)',
  text: '#e1e1e1', //'#f1f1f1', //#e1e1e1  very similar white
  label: '#b3b3b3',
  panelBackground: 'rgb(52, 54, 57)', //'#2b2d2f',
  panelBorder: '#4b99ec91',
  grid: {
    headerTitle: '#e1e1e1',
    headerBackground: 'rgb(52, 54, 57)',
    oddRowBackground: 'rgb(52, 54, 57)', //'#9e9e9e0f',
    evenRowBackground: 'rgb(52, 54, 57)',
    rowColor: '#fff',
    headerBorderRight: '#787878',
    rowHoverBackground: '#4b99ec52',
    rowSelectedBackground: '#1976d2',
    rowHoverColor: '#000',
    rowSelectedColor: '#ffffff',
  },
};

export const darkThemeId = 'finui_dark';

export const darkTheme = getAppTheme(darkThemeId, darkColors, 'dark');
