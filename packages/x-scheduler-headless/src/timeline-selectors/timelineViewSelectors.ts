import { createSelector } from '@base-ui-components/utils/store';
import { TimelineState as State } from '../use-timeline';

export const timelineViewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
};
