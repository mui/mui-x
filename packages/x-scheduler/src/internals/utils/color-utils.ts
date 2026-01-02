import { SchedulerEventColor } from '@mui/x-scheduler-headless/models';

/**
 * @deprecated Use data-palette attribute directly instead of className
 * TODO: Remove once all components are migrated to styled()
 */
export function getColorClassName(color: SchedulerEventColor): string {
  return `palette-${color}`;
}

/**
 * Returns props object for applying palette color via data attribute.
 * Use with components that have schedulerPaletteStyles applied.
 */
export function getDataPaletteProps(color: SchedulerEventColor): { 'data-palette': string } {
  return { 'data-palette': color };
}
