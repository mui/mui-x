import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-internals/internals';
import { EventTimelinePremiumPreset } from '../models/preset';
import { EventTimelinePremiumPreferences } from '../models/preferences';

export interface EventTimelinePremiumState extends SchedulerState {
  /**
   * The preset displayed in the timeline.
   */
  preset: EventTimelinePremiumPreset;
  /**
   * The presets available in the timeline.
   */
  presets: readonly EventTimelinePremiumPreset[];
  /**
   * Preferences for the timeline.
   */
  preferences: Partial<EventTimelinePremiumPreferences>;
  /**
   * Set to `true` on the first `updateStateFromParameters` call.
   * @internal
   */
  hasMounted: boolean;
}

export interface EventTimelinePremiumParameters<
  TEvent extends object,
  TResource extends object,
> extends SchedulerParameters<TEvent, TResource> {
  /**
   * The preset currently displayed in the timeline.
   */
  preset?: EventTimelinePremiumPreset;
  /**
   * The preset initially displayed in the timeline.
   * To render a controlled timeline, use the `preset` prop.
   * @default "dayAndHour"
   */
  defaultPreset?: EventTimelinePremiumPreset;
  /**
   * The presets available in the timeline.
   * The order is canonical (from most-zoomed-in to most-zoomed-out) and enforced internally,
   * so a future zoom API (`zoomIn()` / `zoomOut()`) behaves consistently regardless of the order
   * in which the presets are provided.
   * @default ["dayAndHour", "dayAndMonth", "dayAndWeek", "monthAndYear", "year"]
   */
  presets?: EventTimelinePremiumPreset[];
  /**
   * Event handler called when the preset changes.
   */
  onPresetChange?: (
    preset: EventTimelinePremiumPreset,
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
