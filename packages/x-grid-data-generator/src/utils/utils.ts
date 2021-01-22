import * as styles from '@material-ui/core/styles';

export function isMuiV5(): boolean {
  return 'alpha' in styles;
}

export function muiStyleAlpha(color: string, value: number): string {
  if (isMuiV5()) {
    return (styles as any)?.alpha(color, value);
  }
  return (styles as any)?.fade(color, value);
}

export function getThemePaletteMode(palette: any): string {
  return palette.type || palette.mode;
}
