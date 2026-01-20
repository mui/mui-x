import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-headless/utils/SchedulerStore';
import { TimelineView } from '../models/view';
import { TimelinePreferences } from '../models/preferences';

export interface TimelineState extends SchedulerState {
  /**
   * The view displayed in the timeline.
   */
  view: TimelineView;
  /**
   * The views available in the timeline.
   */
  views: TimelineView[];
  /**
   * Preferences for the timeline.
   */
  preferences: Partial<TimelinePreferences>;
}

export interface TimelineParameters<
  TEvent extends object,
  TResource extends object,
> extends SchedulerParameters<TEvent, TResource> {
  /**
   * The view currently displayed in the timeline.
   */
  view?: TimelineView;
  /**
   * The view initially displayed in the timeline.
   * To render a controlled timeline, use the `view` prop.
   * @default "time"
   */
  defaultView?: TimelineView;
  /**
   * The views available in the timeline.
   * @default ["time", "days", "weeks", "months", "years"]
   */
  views?: TimelineView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: TimelineView, eventDetails: SchedulerChangeEventDetails) => void;
  /**
   * The default preferences for the timeline.
   * To use controlled preferences, use the `preferences` prop.
   * @default { ampm: true }
   */
  defaultPreferences?: Partial<TimelinePreferences>;
  /**
   * Preferences currently displayed in the timeline.
   */
  preferences?: Partial<TimelinePreferences>;
  /**
   * Event handler called when the preferences change.
   */
  onPreferencesChange?: (
    preferences: Partial<TimelinePreferences>,
    event: React.UIEvent | Event,
  ) => void;
}
