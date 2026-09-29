import type { SchedulerEventColor, SchedulerEventCreationConfig } from '../models';

export const EVENT_CREATION_PRECISION_MINUTE = 30;

export const EVENT_COLORS: SchedulerEventColor[] = [
  'red',
  'pink',
  'purple',
  'indigo',
  'blue',
  'teal',
  'green',
  'lime',
  'amber',
  'orange',
  'grey',
];

export const EVENT_DRAG_PRECISION_MINUTE = 15;

export const EVENT_DRAG_PRECISION_MS = EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;

/**
 * How far, in pixels, a finger or pen must travel from where a time grid resize started before the
 * drop changes the event. A press on the handle starts the drag at once, so a tap is one too.
 */
export const EVENT_DRAG_TAP_SLOP_PX = 5;

/**
 * Maximum number of days the Agenda view is allowed to scan forward
 * when looking for event occurrences.
 * This acts as a hard limit to prevent excessive iteration
 */
export const AGENDA_MAX_HORIZON_DAYS = 180;

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

export const DEFAULT_EVENT_CREATION_CONFIG: SchedulerEventCreationConfig = {
  interaction: 'click',
  duration: 30,
};
