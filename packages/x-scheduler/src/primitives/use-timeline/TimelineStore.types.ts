import { TimelinePreferences } from '../models/preferences';
import { SchedulerState, SchedulerParameters } from '../utils/SchedulerStore';

export interface TimelineState extends SchedulerState {
  /**
   * Preferences for the timeline.
   *
   */
  preferences: TimelinePreferences;
}

export interface TimelineParameters extends SchedulerParameters {
  /**
   * Preferences for the timeline.
   * @default { ampm: true }
   */
  preferences?: Partial<TimelinePreferences>;
}
