import type { CalendarEventColor } from './event';

export type CalendarResourceId = string;

// TODO: Rename SchedulerProcessedResource and replace the raw SchedulerValidDate with processed dates.
// TODO: Create a new SchedulerDefaultResourceModel to replace CalendarResource on props.resources.
export interface CalendarResource {
  /**
   * The unique identifier of the resource.
   * This is the value that must be set in the `resource` property of the events.
   */
  id: CalendarResourceId;
  /**
   * The title of the resource.
   */
  title: string;
  /**
   * The color palette used for events assigned to this resource.
   * Can be overridden per event using the `color` property on the event model. (TODO: not implemented yet)
   * @default "jade"
   */
  eventColor?: CalendarEventColor;
}

export type SchedulerResourceModelStructure<TResource extends {}> = {
  [key in keyof CalendarResource]?: {
    getter: (event: TResource) => CalendarResource[key];
  };
};
