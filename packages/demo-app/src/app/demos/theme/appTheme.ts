// eslint-disable-next-line no-restricted-imports
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { ThemeColors } from './themeColors';

export interface AppTheme extends PaletteOptions {
  id: string;
  colors: ThemeColors;
  type: 'dark' | 'light';
}
