import { type SxProps } from '@mui/system';
import { type Theme } from '@mui/material/styles';

export interface ExportedBaseTabsProps {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
