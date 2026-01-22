import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '@mui/x-scheduler-headless/internals';
import { createChangeEventDetails } from '@mui/x-scheduler-headless/base-ui-copy';
import { TimelinePremiumPreferences, TimelinePremiumView } from '../models';
import { TimelinePremiumState, TimelinePremiumParameters } from './TimelinePremiumStore.types';
import { TimelineLazyLoadingPlugin } from './plugins/TimelineLazyLoadingPlugin';

export const DEFAULT_VIEWS: TimelinePremiumView[] = ['time', 'days', 'weeks', 'months', 'years'];
export const DEFAULT_VIEW: TimelinePremiumView = 'time';

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: TimelinePremiumParameters<TEvent, TResource>,
) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

export const DEFAULT_PREFERENCES: TimelinePremiumPreferences = DEFAULT_SCHEDULER_PREFERENCES;

const mapper: SchedulerParametersToStateMapper<
  TimelinePremiumState,
  TimelinePremiumParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
    preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<TimelinePremiumState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    updateModel(newState, 'view', 'defaultView');
    updateModel(newState, 'preferences', 'defaultPreferences');

    return newState;
  },
};

export class TimelinePremiumStore<
  TEvent extends object,
  TResource extends object,
> extends SchedulerStore<
  TEvent,
  TResource,
  TimelinePremiumState,
  TimelinePremiumParameters<TEvent, TResource>
> {
  public constructor(parameters: TimelinePremiumParameters<TEvent, TResource>, adapter: Adapter) {
    super(parameters, adapter, 'Timeline', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }

    this.lazyLoading = new TimelineLazyLoadingPlugin(this);
  }

  private assertViewValidity(view: TimelinePremiumView) {
    const views = this.state.views;
    if (!views.includes(view)) {
      throw new Error(
        [
          `Timeline: The component tried to switch to the "${view}" view but it is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
        ].join('\n'),
      );
    }
  }

  /**
   * Sets the view of the timeline.
   */
  public setView = (view: TimelinePremiumView, event: Event) => {
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
