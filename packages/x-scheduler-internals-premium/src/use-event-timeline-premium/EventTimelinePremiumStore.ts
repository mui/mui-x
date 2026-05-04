import * as React from 'react';
import { warn } from '@base-ui/utils/warn';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '@mui/x-scheduler-internals/internals';
import { createChangeEventDetails } from '@mui/x-scheduler-internals/base-ui-copy';
import { EventTimelinePremiumPreferences, EventTimelinePremiumPreset } from '../models';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';
import {
  EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS,
  getPresetPxPerDay,
} from '../internals/utils/preset-utils';

// Sorted by descending px/day (most zoomed-in first). Each preset's `(timeResolution,
// tickWidth)` must produce a unique px/day — otherwise the order is decided by
// `Object.keys` insertion order, which is not a stable contract.
const PRESET_ZOOM_ORDER: EventTimelinePremiumPreset[] = (
  Object.keys(EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS) as EventTimelinePremiumPreset[]
).sort((a, b) => getPresetPxPerDay(b) - getPresetPxPerDay(a));

export const DEFAULT_PRESETS: EventTimelinePremiumPreset[] = PRESET_ZOOM_ORDER;
export const DEFAULT_PRESET: EventTimelinePremiumPreset = PRESET_ZOOM_ORDER[0];

function sortPresetsByZoomOrder(
  presets: EventTimelinePremiumPreset[],
): EventTimelinePremiumPreset[] {
  if (process.env.NODE_ENV !== 'production') {
    if (presets.length === 0) {
      throw new Error(
        `MUI X Scheduler: EventTimelinePremium received an empty \`presets\` prop. ` +
          `This leaves the timeline without any preset to render. ` +
          `Pass at least one preset, or omit the prop to use the default set (${PRESET_ZOOM_ORDER.join(', ')}). ` +
          `See https://mui.com/x/react-scheduler/event-timeline/presets/ for more details.`,
      );
    }
    const unknown = presets.filter((preset) => !PRESET_ZOOM_ORDER.includes(preset));
    if (unknown.length > 0) {
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

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
) => ({
  presets: sortPresetsByZoomOrder(parameters.presets ?? DEFAULT_PRESETS),
});

export const DEFAULT_PREFERENCES: EventTimelinePremiumPreferences = DEFAULT_SCHEDULER_PREFERENCES;

const mapper: SchedulerParametersToStateMapper<
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    preset: parameters.preset ?? parameters.defaultPreset ?? DEFAULT_PRESET,
    preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<EventTimelinePremiumState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
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
  EventTimelinePremiumParameters<TEvent, TResource>
> {
  public lazyLoading: EventTimelinePremiumLazyLoadingPlugin<TEvent>;

  public constructor(
    parameters: EventTimelinePremiumParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(parameters, adapter, 'EventTimelinePremiumStore', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Assert the initial state validity; `subscribe` only fires on subsequent state changes.
      this.assertPresetValidity(this.state.preset);
      this.subscribe((state) => {
        this.assertPresetValidity(state.preset);
        return null;
      });
    }

    this.lazyLoading = new EventTimelinePremiumLazyLoadingPlugin(this);
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
    const { unitCount, navigate } = EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
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
    const { unitCount, navigate } = EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
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
}
