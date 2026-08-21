import type * as React from 'react';
import { warn } from '@base-ui/utils/warn';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerParametersToStateMapper } from '@mui/x-scheduler-internals/internals';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  getDisplayedHourRange,
  SchedulerStore,
} from '@mui/x-scheduler-internals/internals';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import type {
  EventTimelinePremiumPreferences,
  EventTimelinePremiumPreset,
  EventTimelinePremiumPresetConfig,
  SchedulerAddDependencyResult,
  SchedulerDependenciesParameters,
  SchedulerDependencyCreation,
  SchedulerDependencyCreationProperties,
  SchedulerDependencyId,
} from '../models';
import type {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
  EventTimelinePremiumStoreParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';
import { schedulerRecurringEventsPlugin } from '../internals/plugins/schedulerRecurringEventsPlugin';
import { SchedulerSchedulingPlugin } from '../internals/plugins/SchedulerSchedulingPlugin';
import {
  EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS,
  getPresetPxPerDay,
} from '../internals/utils/preset-utils';
import {
  buildDependenciesState,
  classifyDependencyEvent,
} from '../internals/utils/dependency-utils';

// Sorted by descending px/day (most zoomed-in first). Each preset's `(timeResolution,
// tickWidth)` must produce a unique px/day — otherwise the order is decided by
// `Object.keys` insertion order, which is not a stable contract.
const PRESET_ZOOM_ORDER: EventTimelinePremiumPreset[] = (
  Object.keys(EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS) as EventTimelinePremiumPreset[]
).sort((a, b) => getPresetPxPerDay(b) - getPresetPxPerDay(a));

export const DEFAULT_PRESETS: EventTimelinePremiumPreset[] = PRESET_ZOOM_ORDER;
export const DEFAULT_PRESET: EventTimelinePremiumPreset = PRESET_ZOOM_ORDER[0];
export const DEFAULT_SHOULD_EVENT_REQUIRE_RESOURCE = true;

function sortPresetsByZoomOrder(
  presets: EventTimelinePremiumPreset[],
): EventTimelinePremiumPreset[] {
  if (process.env.NODE_ENV !== 'production') {
    if (presets.length === 0) {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: EventTimelinePremium received an empty \`presets\` prop. ` +
          `This leaves the timeline without any preset to render. ` +
          `Pass at least one preset, or omit the prop to use the default set (${PRESET_ZOOM_ORDER.join(', ')}). ` +
          `See https://mui.com/x/react-scheduler/event-timeline/presets/ for more details.`,
      );
    }
    const unknown = presets.filter((preset) => !PRESET_ZOOM_ORDER.includes(preset));
    if (unknown.length > 0) {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: EventTimelinePremium received unknown preset(s) in the \`presets\` prop: ${unknown.join(', ')}. ` +
          `These entries have no associated configuration, so the timeline cannot render them. ` +
          `Remove the unknown preset(s), or use one of the built-in values (${PRESET_ZOOM_ORDER.join(', ')}). ` +
          `See https://mui.com/x/react-scheduler/event-timeline/presets/ for more details.`,
      );
    }
  }
  // Iterating over `PRESET_ZOOM_ORDER` (instead of the input) yields a canonical,
  // duplicate-free output even when runtime inputs (storage, URL params, dynamic
  // registries) bypass the compile-time `EventTimelinePremiumPreset` union.
  return PRESET_ZOOM_ORDER.filter((preset) => presets.includes(preset));
}

/**
 * Validates every entry of `presetConfig`, not just the active preset's: the selector
 * only resolves the rendered preset, so a typo in another preset's range would stay
 * silent until an end user switches to it. Configuring a known preset that `presets`
 * currently leaves out is not reported: a wrapper can configure it once while a screen
 * or a responsive mode narrows `presets`, the same way the Event Calendar accepts
 * `viewConfig` entries for views it does not render.
 */
function validatePresetConfig(presetConfig: EventTimelinePremiumPresetConfig) {
  if (process.env.NODE_ENV !== 'production') {
    for (const preset of Object.keys(presetConfig) as (keyof EventTimelinePremiumPresetConfig)[]) {
      const hourConfig = presetConfig[preset];
      if (hourConfig) {
        if (!PRESET_ZOOM_ORDER.includes(preset)) {
          warnOnce([
            `MUI X Scheduler: \`presetConfig.${preset}\` is not a known preset, so the configuration is ignored.`,
            `Use one of the built-in presets (${PRESET_ZOOM_ORDER.join(', ')}), or remove the entry from \`presetConfig\`.`,
            'See https://mui.com/x/react-scheduler/event-timeline/presets/ for more details.',
          ]);
        }
        getDisplayedHourRange(hourConfig.startTime, hourConfig.endTime, `presetConfig.${preset}`);
      }
    }
  }
}

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
) => {
  const presets = sortPresetsByZoomOrder(parameters.presets ?? DEFAULT_PRESETS);
  if (parameters.presetConfig) {
    validatePresetConfig(parameters.presetConfig);
  }
  return {
    presets,
    presetConfig: parameters.presetConfig ?? EMPTY_OBJECT,
  };
};

// `dependencies` is fully controlled (there is no `defaultDependencies`), so a lone
// `onDependenciesChange` could only enable a UI whose creations never display: the
// feature requires the value, and the lone handler gets the symmetric dev warning to
// the one `updateDependencies` emits for a value without a handler.
const deriveAreDependenciesEnabled = (parameters: SchedulerDependenciesParameters) => {
  const enabled = parameters.dependencies !== undefined;
  if (!enabled && parameters.onDependenciesChange !== undefined) {
    warnOnce([
      'MUI X Scheduler: An `onDependenciesChange` handler was provided without a `dependencies` value.',
      'The `dependencies` prop is fully controlled, so without it the handler could never display anything and the dependencies feature stays disabled.',
      'Pass a `dependencies` array next to the handler — an empty one enables the feature.',
    ]);
  }
  return enabled;
};

export const DEFAULT_PREFERENCES: EventTimelinePremiumPreferences = DEFAULT_SCHEDULER_PREFERENCES;

function warnIfShouldEventRequireResourceMisconfigured(
  shouldEventRequireResource: boolean,
  resources: readonly unknown[] | undefined,
) {
  if (shouldEventRequireResource && (resources == null || resources.length === 0)) {
    warnOnce([
      'MUI X Scheduler: `shouldEventRequireResource` is `true` but no resources are configured.',
      'Users will not be able to select a resource, and events cannot be saved from the event dialog.',
      'Either provide at least one resource, or set `shouldEventRequireResource={false}`.',
    ]);
  }
}

const mapper: SchedulerParametersToStateMapper<
  EventTimelinePremiumState,
  EventTimelinePremiumStoreParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => {
    const shouldEventRequireResource =
      parameters.shouldEventRequireResource ?? DEFAULT_SHOULD_EVENT_REQUIRE_RESOURCE;
    warnIfShouldEventRequireResourceMisconfigured(shouldEventRequireResource, parameters.resources);
    return {
      ...schedulerInitialState,
      ...deriveStateFromParameters(parameters),
      ...buildDependenciesState(parameters.dependencies),
      areDependenciesEnabled: deriveAreDependenciesEnabled(parameters),
      dependencyCreation: null,
      preset: parameters.preset ?? parameters.defaultPreset ?? DEFAULT_PRESET,
      preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
      shouldEventRequireResource,
      hasInitialized: false,
    };
  },
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const shouldEventRequireResource =
      parameters.shouldEventRequireResource ?? DEFAULT_SHOULD_EVENT_REQUIRE_RESOURCE;
    warnIfShouldEventRequireResourceMisconfigured(shouldEventRequireResource, parameters.resources);
    const areDependenciesEnabled = deriveAreDependenciesEnabled(parameters);
    const newState: Partial<EventTimelinePremiumState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
      ...buildDependenciesState(parameters.dependencies),
      areDependenciesEnabled,
      // Disabling the feature discards its in-flight gesture: kept in the raw state
      // it would come back on screen if the feature is re-enabled. The selection is
      // cleared by the store effect, which can check the selected type.
      ...(areDependenciesEnabled ? null : { dependencyCreation: null }),
      shouldEventRequireResource,
      hasInitialized: true,
    };

    updateModel(newState, 'preset', 'defaultPreset');
    updateModel(newState, 'preferences', 'defaultPreferences');

    return newState;
  },
};

export class EventTimelinePremiumStore<
  TEvent extends object,
  TResource extends object,
> extends SchedulerStore<
  TEvent,
  TResource,
  EventTimelinePremiumState,
  EventTimelinePremiumStoreParameters<TEvent, TResource>
> {
  public lazyLoading: EventTimelinePremiumLazyLoadingPlugin<TEvent>;

  public scheduling: SchedulerSchedulingPlugin<
    TEvent,
    EventTimelinePremiumState,
    EventTimelinePremiumStoreParameters<TEvent, TResource>
  >;

  public constructor(
    parameters: EventTimelinePremiumStoreParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(parameters, adapter, 'EventTimelinePremiumStore', mapper, schedulerRecurringEventsPlugin);

    if (process.env.NODE_ENV !== 'production') {
      // Assert the initial state validity; `subscribe` only fires on subsequent state changes.
      this.assertPresetValidity(this.state.preset);
      this.disposables.defer(
        this.subscribe((state) => {
          this.assertPresetValidity(state.preset);
          return null;
        }),
      );
    }

    this.scheduling = this.disposables.use(new SchedulerSchedulingPlugin(this));
    this.schedulingPlugin = this.scheduling;
    this.lazyLoading = this.disposables.use(new EventTimelinePremiumLazyLoadingPlugin(this));

    // Clear (not just mask) the selection of a removed or deactivated dependency:
    // with masking alone, a dependency coming back (a re-added id, an endpoint event
    // re-fetched or no longer recurring) would resurrect the arrow already selected.
    const clearInactiveDependencySelection = () => {
      const { selection, dependencyModelLookup, processedEventLookup } = this.state;
      if (selection?.type !== 'dependency') {
        return;
      }
      const dependency = dependencyModelLookup.get(selection.id);
      if (
        dependency === undefined ||
        classifyDependencyEvent(processedEventLookup, dependency.source) !== 'ok' ||
        classifyDependencyEvent(processedEventLookup, dependency.target) !== 'ok'
      ) {
        this.setSelection(null);
      }
    };
    this.disposables.defer(
      this.registerStoreEffect(
        (state) => state.dependencyModelLookup,
        clearInactiveDependencySelection,
      ),
    );
    this.disposables.defer(
      this.registerStoreEffect(
        (state) => state.processedEventLookup,
        clearInactiveDependencySelection,
      ),
    );

    // Disabling the feature also discards its selection — only its own: the slice is
    // shared with the other selectable types.
    this.disposables.defer(
      this.registerStoreEffect(
        (state) => state.areDependenciesEnabled,
        (previous, next) => {
          if (previous && !next && this.state.selection?.type === 'dependency') {
            this.setSelection(null);
          }
        },
      ),
    );
  }

  private assertPresetValidity(preset: EventTimelinePremiumPreset) {
    const presets = this.state.presets;
    if (!presets.includes(preset)) {
      throw new Error(
        `MUI X Scheduler: EventTimelinePremium received the preset "${preset}", which is not part of the \`presets\` prop (received: ${presets.join(', ')}). ` +
          `This leaves the timeline in an inconsistent state where the current preset is not one of the allowed options. ` +
          `Add "${preset}" to the \`presets\` prop, or pass a preset that is already included. ` +
          `See https://mui.com/x/react-scheduler/event-timeline/presets/ for more details.`,
      );
    }
  }

  public buildPublicAPI() {
    return {
      ...super.buildPublicAPI(),
      goToNextVisibleDate: this.goToNextVisibleDate,
      goToPreviousVisibleDate: this.goToPreviousVisibleDate,
    };
  }

  /**
   * Goes to the next visible date span based on the current preset.
   */
  public goToNextVisibleDate = (event: React.UIEvent) => {
    const { adapter, visibleDate, preset } = this.state;
    const { unitCount, navigate } = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset];
    this.setVisibleDate({
      visibleDate: navigate(adapter, visibleDate, unitCount),
      event,
    });
  };

  /**
   * Goes to the previous visible date span based on the current preset.
   */
  public goToPreviousVisibleDate = (event: React.UIEvent) => {
    const { adapter, visibleDate, preset } = this.state;
    const { unitCount, navigate } = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset];
    this.setVisibleDate({
      visibleDate: navigate(adapter, visibleDate, -unitCount),
      event,
    });
  };

  /**
   * Sets the preset of the timeline.
   */
  public setPreset = (preset: EventTimelinePremiumPreset, event: Event) => {
    const { preset: presetProp, onPresetChange } = this.parameters;
    if (process.env.NODE_ENV !== 'production' && presetProp !== undefined && !onPresetChange) {
      warn(
        'MUI X Scheduler: EventTimelinePremium is controlled (received a `preset` prop) but `onPresetChange` is not provided. Preset changes will be silently ignored.',
      );
    }
    if (preset !== this.state.preset) {
      this.assertPresetValidity(preset);
      const eventDetails = createChangeEventDetails('none', event);
      onPresetChange?.(preset, eventDetails);

      if (!eventDetails.isCanceled && presetProp === undefined) {
        this.set('preset', preset);
      }
    }
  };

  /**
   * Adds a dependency between two events.
   * Rejects dependencies referencing an unknown, recurring or read-only event,
   * duplicates and cycles — see the returned `SchedulerAddDependencyResult`.
   */
  public addDependency = (
    properties: SchedulerDependencyCreationProperties,
  ): SchedulerAddDependencyResult => this.scheduling.addDependency(properties);

  /**
   * Deletes a dependency. Returns `false` when the deletion was refused: the id is
   * unknown, or an endpoint event is read-only.
   */
  public deleteDependency = (dependencyId: SchedulerDependencyId): boolean =>
    this.scheduling.deleteDependency(dependencyId);

  /**
   * Sets the pending create-dependency drag gesture. The gesture only holds ids —
   * the cursor never enters the state, the provisional arrow follows it through the
   * DOM — so it changes a handful of times per gesture, not per frame.
   */
  public setDependencyCreation = (creation: SchedulerDependencyCreation | null) => {
    // Value comparison: drag frames rebuild an identical gesture object, and only
    // real transitions (start, snap, un-snap, end) may write.
    if (isDeepEqual(this.state.dependencyCreation, creation)) {
      return;
    }
    this.set('dependencyCreation', creation);
  };

  /**
   * Selects a dependency, or clears the selection when called with `null`.
   */
  public setSelectedDependencyId = (dependencyId: SchedulerDependencyId | null) => {
    this.setSelection(dependencyId === null ? null : { type: 'dependency', id: dependencyId });
  };

  /**
   * Deletes the selected dependency and clears the selection, so the pairing cannot
   * drift apart across the affordances triggering it (delete button, keyboard).
   */
  public deleteSelectedDependency = () => {
    const { selection } = this.state;
    if (selection?.type !== 'dependency') {
      return;
    }
    // A refused deletion (read-only endpoint) keeps the selection: silently
    // deselecting would read as a broken delete.
    if (!this.deleteDependency(selection.id)) {
      return;
    }
    this.setSelection(null);
  };
}
