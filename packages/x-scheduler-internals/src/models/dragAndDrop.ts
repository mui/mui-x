import type { SchedulerEvent, SchedulerProcessedEventDraft } from './event';

export type RenderDragPreviewParameters =
  | {
      type: 'internal-event';
      data: SchedulerProcessedEventDraft;
    }
  | { type: 'standalone-event'; data: SchedulerOccurrencePlaceholderExternalDragData };

// TODO: Add support for eventModelStructure.
export interface SchedulerOccurrencePlaceholderExternalDragData extends Omit<
  SchedulerEvent,
  'start' | 'end'
> {
  /**
   * The default duration of the event in minutes.
   * Will be ignored if the event is dropped on a UI that only handles multi-day events.
   * @default 30
   */
  duration?: number;
}
