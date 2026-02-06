import { createSelector } from '@base-ui/utils/store';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

export const schedulerAiHelperSelectors = {
  aiHelper: createSelector((state: State) => state.aiHelper),
  aiHelperStatus: createSelector((state: State) => state.aiHelper.status),
  aiHelperParsedResponse: createSelector((state: State) => state.aiHelper.parsedResponse),
};
