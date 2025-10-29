import { createSelector } from '@base-ui-components/utils/store';
import { TimelineState as State } from '../use-timeline';

export const timelinePreferenceSelectors = {
  ampm: createSelector((state: State) => state.preferences.ampm),
};
