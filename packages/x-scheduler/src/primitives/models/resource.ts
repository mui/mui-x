import type { CalendarEventColor } from './event';

export type CalendarResourceId = string;

export interface CalendarResource {
  /**
   * The unique identifier of the resource.
   * This is the value that must be set in the `resource` property of the events.
   */
  id: CalendarResourceId;
  /**
   * The name of the resource.
   */
  name: string;
  /**
   * The color palette used for events assigned to this resource.
   * Can be overridden per event using the `color` property on the event model. (TODO: not implemented yet)
   * @default "jade"
   */
  eventColor?: CalendarEventColor;
}
