import { SchedulerEventColor } from '@mui/x-scheduler-headless/models';

// TODO: Add support for event.color
export function getColorClassName(color: SchedulerEventColor): string {
  return `palette-${color}`;
}
