import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-headless/internals';
import { TimelinePremiumView } from '../models/view';
import { TimelinePremiumPreferences } from '../models/preferences';

export interface TimelinePremiumState extends SchedulerState {
  /**
   * The view displayed in the timeline.
   */
  view: TimelinePremiumView;
  /**
   * The views available in the timeline.
   */
  views: TimelinePremiumView[];
  /**
   * Preferences for the timeline.
   */
  preferences: Partial<TimelinePremiumPreferences>;
}

export interface TimelinePremiumParameters<
  TEvent extends object,
  TResource extends object,
> extends SchedulerParameters<TEvent, TResource> {
  /**
   * The view currently displayed in the timeline.
   */
  view?: TimelinePremiumView;
  /**
   * The view initially displayed in the timeline.
   * To render a controlled timeline, use the `view` prop.
   * @default "time"
   */
  defaultView?: TimelinePremiumView;
  /**
   * The views available in the timeline.
   * @default ["time", "days", "weeks", "months", "years"]
   */
  views?: TimelinePremiumView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: TimelinePremiumView, eventDetails: SchedulerChangeEventDetails) => void;
  /**
   * The default preferences for the timeline.
   * To use controlled preferences, use the `preferences` prop.
   * @default { ampm: true }
   */
  defaultPreferences?: Partial<TimelinePremiumPreferences>;
  /**
   * Preferences currently displayed in the timeline.
   */
  preferences?: Partial<TimelinePremiumPreferences>;
  /**
   * Event handler called when the preferences change.
   */
  onPreferencesChange?: (
    preferences: Partial<TimelinePremiumPreferences>,
    event: React.UIEvent | Event,
  ) => void;
}
