import { ExtendableRichTreeViewStore } from '../../RichTreeViewStore/RichTreeViewStore';
import { TreeViewItemId } from '../../../models';
import { labelSelectors } from '.';
import { useLabelEditingItemPlugin } from './itemPlugin';

export class TreeViewLabelEditingPlugin {
  private store: ExtendableRichTreeViewStore<any, any>;

  constructor(store: ExtendableRichTreeViewStore<any, any>) {
    this.store = store;
    store.itemPluginManager.register(useLabelEditingItemPlugin, null);
  }

  public setEditedItem = (editedItemId: TreeViewItemId | null) => {
    if (editedItemId !== null && !labelSelectors.isItemEditable(this.store.state, editedItemId)) {
      return;
    }

    this.store.set('editedItemId', editedItemId);
  };

  public updateItemLabel = (itemId: TreeViewItemId, label: string) => {
    if (!label) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'The label of an item cannot be empty.',
          itemId,
        ].join('\n'),
      );
    }

    const item = this.store.state.itemMetaLookup[itemId];
    if (item.label === label) {
      return;
    }

    this.store.set('itemMetaLookup', {
      ...this.store.state.itemMetaLookup,
      [itemId]: { ...item, label },
    });

    if (this.store.parameters.onItemLabelChange) {
      this.store.parameters.onItemLabelChange(itemId, label);
    }
  };
}
