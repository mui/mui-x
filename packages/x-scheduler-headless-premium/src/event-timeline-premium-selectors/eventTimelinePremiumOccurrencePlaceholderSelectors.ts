import { createSelector } from '@base-ui/utils/store';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumViewSelectors } from './eventTimelinePremiumViewSelectors';

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

    const viewConfig = eventTimelinePremiumViewSelectors.config(state);
    if (
      state.adapter.isBefore(state.occurrencePlaceholder.end, viewConfig.start) ||
      state.adapter.isAfter(state.occurrencePlaceholder.start, viewConfig.end)
    ) {
      return null;
    }

    return state.occurrencePlaceholder;
  }),
};
