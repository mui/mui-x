import { SchedulerValidDate } from './date';

/**
 * Object forwarded to the `onEventChange` handler of the Day Grid Root and Time Grid Root parts.
 */
export interface EventData {
  id: string | number;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
}
