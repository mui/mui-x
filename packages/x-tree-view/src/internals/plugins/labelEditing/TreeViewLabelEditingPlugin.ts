import { ExtendableRichTreeViewStore } from '../../RichTreeViewStore/RichTreeViewStore';
import { TreeViewItemId } from '../../../models';
import { labelSelectors } from './selectors';
import { useLabelEditingItemPlugin } from './itemPlugin';

export class TreeViewLabelEditingPlugin {
  private store: ExtendableRichTreeViewStore<any, any>;

  constructor(store: ExtendableRichTreeViewStore<any, any>) {
    this.store = store;
    store.itemPluginManager.register(useLabelEditingItemPlugin, null);
  }

  public buildPublicAPI = () => {
    return {
      setEditedItem: this.setEditedItem,
      updateItemLabel: this.updateItemLabel,
    };
  };

  /**
   * Set which item is currently being edited.
   * You can pass `null` to exit editing mode.
   * @param {TreeViewItemId | null} itemId The id of the item to edit, or `null` to exit editing mode.
   */
  public setEditedItem = (itemId: TreeViewItemId | null) => {
    if (itemId !== null && !labelSelectors.isItemEditable(this.store.state, itemId)) {
      return;
    }

    this.store.set('editedItemId', itemId);
  };

  /**
   * Used to update the label of an item.
   * @param {TreeViewItemId} itemId The id of the item to update the label of.
   * @param {string} label The new label of the item.
   */
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
