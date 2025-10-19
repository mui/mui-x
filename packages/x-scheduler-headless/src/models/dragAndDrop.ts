import type { CalendarEvent } from './event';

export type RenderDragPreviewParameters =
  | {
      type: 'internal-event';
      data: CalendarEvent;
    }
  | { type: 'standalone-event'; data: CalendarOccurrencePlaceholderExternalDragData };

export interface CalendarOccurrencePlaceholderExternalDragData
  extends Omit<CalendarEvent, 'start' | 'end'> {
  /**
   * The default duration of the event in minutes.
   * Will be ignored if the event is dropped on a UI that only handles multi-day events.
   * @default 30
   */
  duration?: number;
}
