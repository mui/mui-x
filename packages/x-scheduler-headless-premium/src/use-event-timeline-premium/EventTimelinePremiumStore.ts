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
import { EventTimelinePremiumPreferences, EventTimelinePremiumView } from '../models';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';

// TODO: In the future, this config should become a prop so users can customize step sizes per view.
// For now it's a constant, but it's extracted into a standalone object to make this transition easy.
const VIEW_NAVIGATION_STEP: Record<
  EventTimelinePremiumView,
  {
    navigate: (
      adapter: TemporalAdapter,
      date: TemporalSupportedObject,
      amount: number,
    ) => TemporalSupportedObject;
    unitCount: number;
  }
> = {
  time: { navigate: (a, d, n) => a.addDays(d, n), unitCount: 3 },
  days: { navigate: (a, d, n) => a.addDays(d, n), unitCount: 21 },
  weeks: { navigate: (a, d, n) => a.addWeeks(d, n), unitCount: 12 },
  months: { navigate: (a, d, n) => a.addMonths(d, n), unitCount: 24 },
  years: { navigate: (a, d, n) => a.addYears(d, n), unitCount: 15 },
};

export const DEFAULT_VIEWS: EventTimelinePremiumView[] = [
  'time',
  'days',
  'weeks',
  'months',
  'years',
];
export const DEFAULT_VIEW: EventTimelinePremiumView = 'time';

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

export const DEFAULT_PREFERENCES: EventTimelinePremiumPreferences = DEFAULT_SCHEDULER_PREFERENCES;

const mapper: SchedulerParametersToStateMapper<
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
    preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<EventTimelinePremiumState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    updateModel(newState, 'view', 'defaultView');
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
        this.assertViewValidity(state.view);
        return null;
      });
    }

    this.lazyLoading = new EventTimelinePremiumLazyLoadingPlugin(this);
  }

  private assertViewValidity(view: EventTimelinePremiumView) {
    const views = this.state.views;
    if (!views.includes(view)) {
      throw new Error(
        [
          `MUI: The component tried to switch to the "${view}" view but it is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
        ].join('\n'),
      );
    }
  }

  public buildPublicAPI() {
    return {
      ...super.buildPublicAPI(),
      goNext: this.goNext,
      goPrev: this.goPrev,
    };
  }

  /**
   * Navigates to the next date range based on the current view's step.
   */
  public goNext = (event: React.UIEvent) => {
    const { adapter, visibleDate, view } = this.state;
    const step = VIEW_NAVIGATION_STEP[view];
    this.setVisibleDate({
      visibleDate: step.navigate(adapter, visibleDate, step.unitCount),
      event,
    });
  };

  /**
   * Navigates to the previous date range based on the current view's step.
   */
  public goPrev = (event: React.UIEvent) => {
    const { adapter, visibleDate, view } = this.state;
    const step = VIEW_NAVIGATION_STEP[view];
    this.setVisibleDate({
      visibleDate: step.navigate(adapter, visibleDate, -step.unitCount),
      event,
    });
  };

  /**
   * Sets the view of the timeline.
   */
  public setView = (view: EventTimelinePremiumView, event: Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    if (view !== this.state.view) {
      this.assertViewValidity(view);
      const eventDetails = createChangeEventDetails('none', event);
      onViewChange?.(view, eventDetails);

      if (!eventDetails.isCanceled && viewProp === undefined) {
        this.set('view', view);
      }
    }
  };
}
