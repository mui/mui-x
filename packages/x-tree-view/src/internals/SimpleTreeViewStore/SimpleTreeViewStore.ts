import { EMPTY_ARRAY } from '@base-ui-components/utils/empty';
import { TreeViewParametersToStateMapper, MinimalTreeViewStore } from '../MinimalTreeViewStore';
import {
  InnerSimpleTreeViewParameters,
  SimpleTreeViewItem,
  SimpleTreeViewStoreParameters,
  SimpleTreeViewState,
} from './SimpleTreeViewStore.types';
import { TreeViewJSXItemsPlugin } from '../plugins/jsxItems';

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  SimpleTreeViewState<any>,
  InnerSimpleTreeViewParameters<any>
> = {
  getInitialState: (schedulerInitialState) => ({
    ...schedulerInitialState,
  }),
  updateStateFromParameters: (newSharedState) => {
    const newState: Partial<SimpleTreeViewState<any>> = {
      ...newSharedState,
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: () => true,
};

export class SimpleTreeViewStore<Multiple extends boolean | undefined> extends MinimalTreeViewStore<
  SimpleTreeViewItem,
  Multiple,
  SimpleTreeViewState<Multiple>,
  InnerSimpleTreeViewParameters<Multiple>
> {
  public jsxItems = new TreeViewJSXItemsPlugin(this);

  public constructor(parameters: SimpleTreeViewStoreParameters<Multiple>) {
    super({ ...parameters, items: EMPTY_ARRAY }, 'SimpleTreeView', mapper);
  }

  public updateStateFromParameters(parameters: SimpleTreeViewStoreParameters<Multiple>) {
    super.updateStateFromParameters({ ...parameters, items: EMPTY_ARRAY });
  }
}
