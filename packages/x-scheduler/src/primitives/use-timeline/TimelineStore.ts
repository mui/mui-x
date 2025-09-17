import { Adapter } from '../utils/adapter/types';
import { SchedulerStore } from '../utils/SchedulerStore';
import { TimelineState, TimelineParameters } from './TimelineStore.types';

export class TimelineStore extends SchedulerStore<
  TimelineState,
  TimelineParameters,
  'visibleDate'
> {
  public constructor(initialState: TimelineState, parameters: TimelineParameters) {
    super(initialState, parameters);
  }

  /**
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  protected static getPartialStateFromParameters(parameters: TimelineParameters, adapter: Adapter) {
    return {
      ...SchedulerStore.getPartialStateFromParameters(parameters, adapter),
    };
  }

  public static create(parameters: TimelineParameters, adapter: Adapter): TimelineStore {
    const initialState: TimelineState = {
      ...SchedulerStore.getInitialState(parameters, adapter),
      ...TimelineStore.getPartialStateFromParameters(parameters, adapter),
    };

    return new TimelineStore(initialState, parameters);
  }

  /**
   * Updates the state of the calendar based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: TimelineParameters, adapter: Adapter) => {
    const mutableNewState: Partial<TimelineState> = TimelineStore.getPartialStateFromParameters(
      parameters,
      adapter,
    );

    this.updateModelFromParameters(
      parameters,
      mutableNewState,
      'visibleDate',
      'defaultVisibleDate',
    );
    this.apply(mutableNewState);
  };
}
