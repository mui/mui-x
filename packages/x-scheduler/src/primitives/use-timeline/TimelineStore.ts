import { Adapter } from '../utils/adapter/types';
import { SchedulerParametersToStateMapper, SchedulerStore } from '../utils/SchedulerStore';
import { TimelineState, TimelineParameters } from './TimelineStore.types';

const deriveStateFromParameters = (_parameters: TimelineParameters) => ({});

const mapper: SchedulerParametersToStateMapper<TimelineState, TimelineParameters> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
  }),
  updateStateFromParameters: (newSchedulerState, parameters) => {
    const newState: Partial<TimelineState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
};

export class TimelineStore extends SchedulerStore<TimelineState, TimelineParameters> {
  public constructor(parameters: TimelineParameters, adapter: Adapter) {
    super(parameters, adapter, 'Timeline', mapper);
  }
}
