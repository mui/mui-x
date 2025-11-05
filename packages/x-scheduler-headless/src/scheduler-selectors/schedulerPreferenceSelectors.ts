import { createSelector } from '@base-ui-components/utils/store';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';

export const schedulerPreferenceSelectors = {
  ampm: createSelector((state: State) => state.preferences.ampm),
};
