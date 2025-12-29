import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { MinimalTreeViewStore } from '../MinimalTreeViewStore';
import {
  InnerSimpleTreeViewParameters,
  SimpleTreeViewItem,
  SimpleTreeViewStoreParameters,
  SimpleTreeViewState,
} from './SimpleTreeViewStore.types';
import { TreeViewJSXItemsPlugin } from '../plugins/jsxItems';
import { parametersToStateMapper } from './SimpleTreeViewStore.utils';

export class SimpleTreeViewStore<Multiple extends boolean | undefined> extends MinimalTreeViewStore<
  SimpleTreeViewItem,
  Multiple,
  SimpleTreeViewState<Multiple>,
  InnerSimpleTreeViewParameters<Multiple>
> {
  public jsxItems = new TreeViewJSXItemsPlugin(this);

  public constructor(parameters: SimpleTreeViewStoreParameters<Multiple>) {
    super({ ...parameters, items: EMPTY_ARRAY }, 'SimpleTreeView', parametersToStateMapper);
  }

  public updateStateFromParameters(parameters: SimpleTreeViewStoreParameters<Multiple>) {
    super.updateStateFromParameters({ ...parameters, items: EMPTY_ARRAY });
  }
}
