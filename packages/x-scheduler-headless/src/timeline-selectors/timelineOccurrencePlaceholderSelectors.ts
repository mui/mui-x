import { createSelector } from '@base-ui/utils/store';
import { TimelineState as State } from '../use-timeline';
import { SchedulerResourceId } from '../models';
import { timelineViewSelectors } from './timelineViewSelectors';

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

    const viewConfig = timelineViewSelectors.config(state);
    if (
      state.adapter.isBefore(state.occurrencePlaceholder.end, viewConfig.start) ||
      state.adapter.isAfter(state.occurrencePlaceholder.start, viewConfig.end)
    ) {
      return null;
    }

    return state.occurrencePlaceholder;
  }),
};
