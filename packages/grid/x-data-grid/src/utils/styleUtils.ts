import { darken, lighten, alpha, Theme } from '@mui/material/styles';

export function getBorderColor(theme: Theme) {
  return theme.palette.mode === 'light'
    ? lighten(alpha(theme.palette.divider, 1), 0.88)
    : darken(alpha(theme.palette.divider, 1), 0.68);
}
