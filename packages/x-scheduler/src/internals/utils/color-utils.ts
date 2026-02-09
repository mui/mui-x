import { SchedulerEventColor } from '@mui/x-scheduler-headless/models';
import { PaletteName } from './tokens';

/**
 * Returns props object for applying palette color via the palette prop.
 * Use with components that have getPaletteVariants(theme) applied.
 */
export function getPaletteProps(color: SchedulerEventColor): { palette: PaletteName } {
  return { palette: color as PaletteName };
}

/**
 * @deprecated Use `getPaletteProps` instead. This function uses the old data-palette approach.
 */
export function getDataPaletteProps(color: SchedulerEventColor): { 'data-palette': string } {
  return { 'data-palette': color };
}
