import {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-headless/internals';
import type { TemporalSupportedObject } from '@mui/x-scheduler-headless/base-ui-copy';
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
  presets: EventTimelinePremiumPreset[];
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
   * @default ["dayAndHour", "day", "dayAndWeek", "monthAndYear", "year"]
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
  /**
   * The date currently used to determine the visible date range in each preset.
   */
  visibleDate?: TemporalSupportedObject;
  /**
   * The date initially used to determine the visible date range in each preset.
   * To render a controlled timeline, use the `visibleDate` prop.
   * @default today
   */
  defaultVisibleDate?: TemporalSupportedObject;
}
