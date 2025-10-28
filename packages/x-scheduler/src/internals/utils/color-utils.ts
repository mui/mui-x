import { CalendarEventColor } from '@mui/x-scheduler-headless/models';

// TODO: Add support for event.color
export function getColorClassName(color: CalendarEventColor): string {
  return `palette-${color}`;
}
