import { createSelector } from '@base-ui/utils/store';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import type { TimelinePremiumState as State } from '../use-timeline-premium';
import { timelinePremiumViewSelectors } from './timelinePremiumViewSelectors';

export const timelineOccurrencePlaceholderSelectors = {
  placeholderInResource: createSelector((state: State, resourceId: SchedulerResourceId | null) => {
    if (
      state.occurrencePlaceholder === null ||
      state.occurrencePlaceholder.surfaceType !== 'timeline' ||
      state.occurrencePlaceholder.isHidden ||
      state.occurrencePlaceholder.resourceId !== resourceId
    ) {
      return null;
    }

    const viewConfig = timelinePremiumViewSelectors.config(state);
    if (
      state.adapter.isBefore(state.occurrencePlaceholder.end, viewConfig.start) ||
      state.adapter.isAfter(state.occurrencePlaceholder.start, viewConfig.end)
    ) {
      return null;
    }

    return state.occurrencePlaceholder;
  }),
};
