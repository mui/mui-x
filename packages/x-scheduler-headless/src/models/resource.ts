import type { SchedulerEventColor } from './event';

export type SchedulerResourceId = string;

export interface SchedulerResource {
  /**
   * The unique identifier of the resource.
   * This is the value that must be set in the `resource` property of the events.
   */
  id: SchedulerResourceId;
  /**
   * The title of the resource.
   */
  title: string;
  /**
   * The color palette used for events assigned to this resource.
   * Can be overridden per event using the `color` property on the event model. (TODO: not implemented yet)
   * @default "jade"
   */
  eventColor?: SchedulerEventColor;
  /**
   * The child resources of this resource.
   */
  children?: SchedulerResource[];
}

export type SchedulerResourceModelStructure<TResource extends object> = {
  [key in keyof SchedulerResource]?: {
    getter: (event: TResource) => SchedulerResource[key];
  };
};
