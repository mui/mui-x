import { createSelector, Store } from '@base-ui-components/utils/store';

export type State<Item = any> = {
  items: Item[];
};

export type TimelineRootStore<Item = any> = Store<State<Item>>;

export const selectors = {
  items: createSelector((state: State) => state.items),
};
