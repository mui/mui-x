import { Adapter } from '../utils/adapter/types';
import { SCHEDULER_MODELS, SchedulerStore } from '../utils/SchedulerStore';
import { TimelineState, TimelineParameters } from './TimelineStore.types';

const getAdditionalStateFromParameters = (
  _parameters: TimelineParameters,
): Partial<TimelineState> => ({});

export class TimelineStore extends SchedulerStore<TimelineState, TimelineParameters> {
  public constructor(initialState: TimelineState, parameters: TimelineParameters) {
    super(initialState, parameters, 'Timeline', SCHEDULER_MODELS, getAdditionalStateFromParameters);
  }

  public static create(parameters: TimelineParameters, adapter: Adapter): TimelineStore {
    const initialState: TimelineState = SchedulerStore.getInitialState(
      parameters,
      adapter,
      getAdditionalStateFromParameters,
    );

    return new TimelineStore(initialState, parameters);
  }
}
