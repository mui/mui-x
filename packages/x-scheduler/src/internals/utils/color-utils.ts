import { SchedulerEventColor } from '@mui/x-scheduler-headless/models';

/**
 * Returns props object for applying palette color via data attribute.
 * Use with components that have schedulerPaletteStyles applied.
 */
export function getDataPaletteProps(color: SchedulerEventColor): { 'data-palette': string } {
  return { 'data-palette': color };
}
