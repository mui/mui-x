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
  SchedulerDependencyCreation,
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
   * Whether the dependencies feature is enabled, i.e. the internal `dependencies`
   * parameter is provided.
   */
  areDependenciesEnabled: boolean;
  /**
   * The pending create-dependency drag gesture, or `null` when none is in progress.
   */
  dependencyCreation: SchedulerDependencyCreation | null;
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
   * For the `dayAndHour` preset, `startTime` and `endTime` limit the hours displayed on
   * each day: `startTime` is inclusive and `endTime` exclusive, so `{ startTime: 8,
   * endTime: 20 }` renders the cells 8 AM through 7 PM and an event ending at 20:00 is
   * still fully visible. Both must be whole hours between 0 and 24 with
   * `startTime` lower than `endTime`; they default to 0 and 24, the full day, and an
   * invalid range falls back to the full day with a warning in development.
   * Presets that do not tick in hours ignore the configuration.
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
