import { CalendarEventColor } from '../../../primitives/models';

// TODO: Add support for event.color
export function getColorClassName(color: CalendarEventColor): string {
  return `palette-${color}`;
}
