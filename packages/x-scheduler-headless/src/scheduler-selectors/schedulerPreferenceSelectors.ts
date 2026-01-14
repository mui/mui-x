import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { DEFAULT_SCHEDULER_PREFERENCES } from '../utils/SchedulerStore';

const allSchedulerPreferencesSelector = createSelectorMemoized(
  (state: State) => state.preferences,
  (preferences) => ({
    ...DEFAULT_SCHEDULER_PREFERENCES,
    ...preferences,
  }),
);

export const schedulerPreferenceSelectors = {
  all: allSchedulerPreferencesSelector,
  ampm: createSelector(allSchedulerPreferencesSelector, (preferences) => preferences.ampm),
};
