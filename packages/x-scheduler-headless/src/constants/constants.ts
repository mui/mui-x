import { CalendarEventColor, RecurringUpdateEventScope } from '../models';

export const EVENT_CREATION_PRECISION_MINUTE = 30;

export const EVENT_CREATION_DEFAULT_LENGTH_MINUTE = 30;

// TODO: Add a color prop to the SchedulerStore and move DEFAULT_EVENT_COLOR there.
export const DEFAULT_EVENT_COLOR: CalendarEventColor = 'jade';

export const SCHEDULER_RECURRING_EDITING_SCOPE: RecurringUpdateEventScope =
  (typeof window !== 'undefined' && (window as any).SCHEDULER_RECURRING_EDITING_SCOPE) || 'all';
