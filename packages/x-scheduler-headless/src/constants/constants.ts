import { SchedulerEventColor, SchedulerEventCreationConfig } from '../models';

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
 * Maximum number of days the Agenda view is allowed to scan forward
 * when looking for event occurrences.
 * This acts as a hard limit to prevent excessive iteration
 */
export const AGENDA_MAX_HORIZON_DAYS = 180;

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

export const DEFAULT_EVENT_CREATION_CONFIG: SchedulerEventCreationConfig = {
  interaction: 'double-click',
  duration: 30,
};
