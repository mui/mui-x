import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '@mui/x-scheduler-headless/internals';
import { createChangeEventDetails } from '@mui/x-scheduler-headless/base-ui-copy';
import { EventTimelinePremiumPreferences, EventTimelinePremiumView } from '../models';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';

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
    super(parameters, adapter, 'EventTimelinePremium', mapper);

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
