import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-headless/internals';
import { EventTimelinePremiumView } from '../models/view';
import { EventTimelinePremiumPreferences } from '../models/preferences';

export interface EventTimelinePremiumState extends SchedulerState {
  /**
   * The view displayed in the timeline.
   */
  view: EventTimelinePremiumView;
  /**
   * The views available in the timeline.
   */
  views: EventTimelinePremiumView[];
  /**
   * Preferences for the timeline.
   */
  preferences: Partial<EventTimelinePremiumPreferences>;
}

export interface EventTimelinePremiumParameters<
  TEvent extends object,
  TResource extends object,
> extends SchedulerParameters<TEvent, TResource> {
  /**
   * The view currently displayed in the timeline.
   */
  view?: EventTimelinePremiumView;
  /**
   * The view initially displayed in the timeline.
   * To render a controlled timeline, use the `view` prop.
   * @default "time"
   */
  defaultView?: EventTimelinePremiumView;
  /**
   * The views available in the timeline.
   * @default ["time", "days", "weeks", "months", "years"]
   */
  views?: EventTimelinePremiumView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (
    view: EventTimelinePremiumView,
    eventDetails: SchedulerChangeEventDetails,
  ) => void;
  /**
   * The default preferences for the timeline.
   * To use controlled preferences, use the `preferences` prop.
   * @default { ampm: true }
   */
  defaultPreferences?: Partial<EventTimelinePremiumPreferences>;
  /**
   * Preferences currently displayed in the timeline.
   */
  preferences?: Partial<EventTimelinePremiumPreferences>;
  /**
   * Event handler called when the preferences change.
   */
  onPreferencesChange?: (
    preferences: Partial<EventTimelinePremiumPreferences>,
    event: React.UIEvent | Event,
  ) => void;
}
