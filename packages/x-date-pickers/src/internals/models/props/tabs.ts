import { SxProps } from '@mui/system';
import { Theme, CreateThemeComponent } from '@mui/material/stylesOptimized';

export interface ExportedBaseTabsProps {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
export type ExportedBaseTabsTheme = CreateThemeComponent<string, ExportedBaseTabsProps>;
