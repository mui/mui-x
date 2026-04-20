import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '@mui/x-scheduler-headless/internals';
import { createChangeEventDetails } from '@mui/x-scheduler-headless/base-ui-copy';
import type {
  TemporalAdapter,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/base-ui-copy';
import { EventTimelinePremiumPreferences, EventTimelinePremiumPreset } from '../models';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';
import { EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS } from '../event-timeline-premium-selectors/eventTimelinePremiumPresetSelectors';

// TODO(#21359): In the future, this config should become a prop so users can customize step sizes per preset.
const PRESET_NAVIGATION_STEP: Record<
  EventTimelinePremiumPreset,
  (
    adapter: TemporalAdapter,
    date: TemporalSupportedObject,
    amount: number,
  ) => TemporalSupportedObject
> = {
  dayAndHour: (adapter, date, amount) => adapter.addDays(date, amount),
  day: (adapter, date, amount) => adapter.addDays(date, amount),
  dayAndWeek: (adapter, date, amount) => adapter.addWeeks(date, amount),
  monthAndYear: (adapter, date, amount) => adapter.addMonths(date, amount),
  year: (adapter, date, amount) => adapter.addYears(date, amount),
};

/**
 * Canonical zoom order for the built-in presets, from most-zoomed-in to most-zoomed-out.
 * The `presets` array in state is always sorted against this order so a future zoom API
 * (`zoomIn()` moves toward index 0, `zoomOut()` toward the end) behaves consistently
 * regardless of the order the user provides.
 *
 * TODO: when custom presets land (see `PresetConfig` in PR #21827), replace this hardcoded
 * list with a `zoomLevel` field on the preset config and sort by that instead.
 */
const PRESET_ZOOM_ORDER: EventTimelinePremiumPreset[] = [
  'dayAndHour',
  'day',
  'dayAndWeek',
  'monthAndYear',
  'year',
];

export const DEFAULT_PRESETS: EventTimelinePremiumPreset[] = PRESET_ZOOM_ORDER;
export const DEFAULT_PRESET: EventTimelinePremiumPreset = 'dayAndHour';

function sortPresetsByZoomOrder(
  presets: EventTimelinePremiumPreset[],
): EventTimelinePremiumPreset[] {
  return [...presets].sort((a, b) => PRESET_ZOOM_ORDER.indexOf(a) - PRESET_ZOOM_ORDER.indexOf(b));
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
      // Add listeners to assert the state validity (not applied in prod)
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
        `MUI: The component tried to switch to the "${preset}" preset but it is not compatible with the available presets: ${presets.join(', ')}.\nPlease ensure that the requested preset is included in the presets array.`,
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
    const { unitCount } = EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
    const navigate = PRESET_NAVIGATION_STEP[preset];
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
    const { unitCount } = EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
    const navigate = PRESET_NAVIGATION_STEP[preset];
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
