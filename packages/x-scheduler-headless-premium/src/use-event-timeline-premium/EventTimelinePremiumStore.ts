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
import { EVENT_TIMELINE_PREMIUM_VIEW_CONFIGS } from '../event-timeline-premium-selectors/eventTimelinePremiumViewSelectors';

// TODO: In the future, this config should become a prop so users can customize step sizes per view.
const VIEW_NAVIGATION_STEP: Record<
  EventTimelinePremiumView,
  (
    adapter: TemporalAdapter,
    date: TemporalSupportedObject,
    amount: number,
  ) => TemporalSupportedObject
> = {
  time: (a, d, n) => a.addDays(d, n),
  days: (a, d, n) => a.addDays(d, n),
  weeks: (a, d, n) => a.addWeeks(d, n),
  months: (a, d, n) => a.addMonths(d, n),
  years: (a, d, n) => a.addYears(d, n),
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
      goToNextVisibleDate: this.goToNextVisibleDate,
      goToPreviousVisibleDate: this.goToPreviousVisibleDate,
    };
  }

  /**
   * Goes to the next visible date span based on the current view.
   */
  public goToNextVisibleDate = (event: React.UIEvent) => {
    const { adapter, visibleDate, view } = this.state;
    const { unitCount } = EVENT_TIMELINE_PREMIUM_VIEW_CONFIGS[view];
    const navigate = VIEW_NAVIGATION_STEP[view];
    this.setVisibleDate({
      visibleDate: navigate(adapter, visibleDate, unitCount),
      event,
    });
  };

  /**
   * Goes to the previous visible date span based on the current view.
   */
  public goToPreviousVisibleDate = (event: React.UIEvent) => {
    const { adapter, visibleDate, view } = this.state;
    const { unitCount } = EVENT_TIMELINE_PREMIUM_VIEW_CONFIGS[view];
    const navigate = VIEW_NAVIGATION_STEP[view];
    this.setVisibleDate({
      visibleDate: navigate(adapter, visibleDate, -unitCount),
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
