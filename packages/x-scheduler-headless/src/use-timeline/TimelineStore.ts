import { TimelinePreferences, TimelineView } from '../models';
import { Adapter } from '../use-adapter';
import { SchedulerParametersToStateMapper, SchedulerStore } from '../utils/SchedulerStore';
import { TimelineState, TimelineParameters } from './TimelineStore.types';

export const DEFAULT_VIEWS: TimelineView[] = ['time', 'days', 'weeks', 'months', 'years'];
export const DEFAULT_VIEW: TimelineView = 'time';

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: TimelineParameters<TEvent, TResource>,
) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});
export const DEFAULT_PREFERENCES: TimelinePreferences = {
  ampm: true,
};

const mapper: SchedulerParametersToStateMapper<TimelineState, TimelineParameters<any, any>> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
    preferences: { ...DEFAULT_PREFERENCES, ...parameters.preferences },
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<TimelineState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    updateModel(newState, 'view', 'defaultView');
    return newState;
  },
};

export class TimelineStore<TEvent extends object, TResource extends object> extends SchedulerStore<
  TEvent,
  TResource,
  TimelineState,
  TimelineParameters<TEvent, TResource>
> {
  public constructor(parameters: TimelineParameters<TEvent, TResource>, adapter: Adapter) {
    super(parameters, adapter, 'Timeline', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }
  }

  private assertViewValidity(view: TimelineView) {
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
  public setView = (view: TimelineView, event: React.UIEvent | Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    if (view !== this.state.view) {
      this.assertViewValidity(view);
      if (viewProp === undefined) {
        this.set('view', view);
      }
      onViewChange?.(view, event);
    }
  };
}
