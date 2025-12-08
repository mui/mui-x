import type { SchedulerEventColor, SchedulerEventSide } from './event';

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
   * Can be overridden per event using the `color` property on the event model.
   * @default "jade"
   */
  eventColor?: SchedulerEventColor;
  /**
   * The child resources of this resource.
   */
  children?: SchedulerResource[];
  /**
   * Whether events assigned to this resource are draggable.
   * If not defined, falls back to the component-level `areEventsDraggable` property.
   * Can be overridden per event using the `draggable` property on the event model.
   */
  areEventsDraggable?: boolean;
  /**
   * Whether events assigned to this resource are resizable.
   * If `true`, both start and end can be resized.
   * If `false`, the events are not resizable.
   * If `"start"`, only the start can be resized.
   * If `"end"`, only the end can be resized.
   * If not defined, falls back to the component-level `areEventsResizable` property.
   * Can be overridden per event using the `resizable` property on the event model.
   */
  areEventsResizable?: boolean | SchedulerEventSide;
}

export type SchedulerResourceModelStructure<TResource extends object> = {
  [key in keyof SchedulerResource]?: {
    getter: (event: TResource) => SchedulerResource[key];
  };
};
