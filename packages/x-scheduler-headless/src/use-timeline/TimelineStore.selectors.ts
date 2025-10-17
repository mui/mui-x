import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../scheduler-store';
import { TimelineState as State } from './TimelineStore.types';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  ampm: createSelector((state: State) => state.preferences.ampm),
};
