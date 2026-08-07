import type {
  SchedulerState,
  SchedulerParameters,
  SchedulerChangeEventDetails,
} from '@mui/x-scheduler-internals/internals';
import type {
  EventTimelinePremiumPreset,
  EventTimelinePremiumPresetConfig,
} from '../models/preset';
import type { EventTimelinePremiumPreferences } from '../models/preferences';
import type {
  SchedulerDependenciesParameters,
  SchedulerDependenciesState,
} from '../models/dependency';

export interface EventTimelinePremiumState extends SchedulerState, SchedulerDependenciesState {
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
   * Configuration applied to each preset, keyed by the preset name.
   */
  presetConfig: EventTimelinePremiumPresetConfig;
  /**
   * `false` until the first parameters→state mapping has applied, then `true`.
   * Gates the lazy-loading plugin's first fetch so it doesn't run against the
   * constructor-only initial state.
   * @internal
   */
  hasInitialized: boolean;
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
   * Configuration applied to each preset, keyed by the preset name.
   * For the `dayAndHour` preset, `startTime` and `endTime` (whole hours between 0 and 24)
   * limit the hours displayed in the timeline.
   * @example { dayAndHour: { startTime: 8, endTime: 20 } }
   */
  presetConfig?: EventTimelinePremiumPresetConfig;
}

/**
 * Parameters accepted by the timeline store, including the dependencies parameters
 * that are not publicly exposed yet.
 * `dependencies` / `onDependenciesChange` move to `EventTimelinePremiumParameters`
 * when the dependencies feature becomes public.
 * @internal
 */
export interface EventTimelinePremiumStoreParameters<
  TEvent extends object,
  TResource extends object,
>
  extends EventTimelinePremiumParameters<TEvent, TResource>, SchedulerDependenciesParameters {}
