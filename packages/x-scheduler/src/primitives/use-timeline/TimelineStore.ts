import { TimelineView } from '../models';
import { Adapter } from '../utils/adapter/types';
import { SchedulerParametersToStateMapper, SchedulerStore } from '../utils/SchedulerStore';
import { TimelineState, TimelineParameters } from './TimelineStore.types';

export const DEFAULT_VIEWS: TimelineView[] = ['time', 'days', 'weeks', 'months', 'years'];
export const DEFAULT_VIEW: TimelineView = 'time';

const deriveStateFromParameters = (parameters: TimelineParameters) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

const mapper: SchedulerParametersToStateMapper<TimelineState, TimelineParameters> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
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

export class TimelineStore extends SchedulerStore<TimelineState, TimelineParameters> {
  public constructor(parameters: TimelineParameters, adapter: Adapter) {
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
