import { TreeViewItemId } from '../../../models';
import { expansionSelectors } from './selectors';
import { itemsSelectors } from '../items/selectors';
import { MinimalTreeViewStore } from '../../MinimalTreeViewStore';
import { TreeViewEventParameters } from '../../models';

export class TreeViewExpansionPlugin {
  private store: MinimalTreeViewStore<any, any>;

  // We can't type `store`, otherwise we get the following TS error:
  // 'expansion' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
  constructor(store: any) {
    this.store = store;
  }

  private setExpandedItems = (event: React.SyntheticEvent | null, value: TreeViewItemId[]) => {
    if (this.store.parameters.expandedItems === undefined) {
      this.store.set('expandedItems', value);
    }
    this.store.parameters.onExpandedItemsChange?.(event, value);
  };

  /**
   * Check if an item is expanded.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is expanded, `false` otherwise.
   */
  private isItemExpanded = (itemId: TreeViewItemId) =>
    expansionSelectors.isItemExpanded(this.store.state, itemId);

  public buildPublicAPI = () => {
    return {
      isItemExpanded: this.isItemExpanded,
      setItemExpansion: this.setItemExpansion,
    };
  };

  /**
   * Change the expansion status of a given item.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed. If not defined, the item's expansion status will be the toggled.
   */
  public setItemExpansion = ({
    itemId,
    event = null,
    shouldBeExpanded,
  }: {
    itemId: TreeViewItemId;
    event?: React.SyntheticEvent | null;
    shouldBeExpanded?: boolean;
  }) => {
    const isExpandedBefore = expansionSelectors.isItemExpanded(this.store.state, itemId);
    const cleanShouldBeExpanded = shouldBeExpanded ?? !isExpandedBefore;
    if (isExpandedBefore === cleanShouldBeExpanded) {
      return;
    }

    const eventParameters: TreeViewEventParameters<'beforeItemToggleExpansion'> = {
      isExpansionPrevented: false,
      shouldBeExpanded: cleanShouldBeExpanded,
      itemId,
    };
    this.store.publishEvent('beforeItemToggleExpansion', eventParameters, event);
    if (eventParameters.isExpansionPrevented) {
      return;
    }

    this.applyItemExpansion({ itemId, event, shouldBeExpanded: cleanShouldBeExpanded });
  };

  /**
   * Apply the new expansion status of a given item.
   * Is used by the `setItemExpansion` method and by the `useTreeViewLazyLoading` plugin.
   * Unlike `setItemExpansion`, this method does not trigger the lazy loading.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent | null} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed.
   */
  public applyItemExpansion = ({
    itemId,
    event,
    shouldBeExpanded,
  }: {
    itemId: TreeViewItemId;
    event: React.SyntheticEvent | null;
    shouldBeExpanded: boolean;
  }) => {
    const oldExpanded = expansionSelectors.expandedItemsRaw(this.store.state);
    let newExpanded: TreeViewItemId[];
    if (shouldBeExpanded) {
      newExpanded = [itemId].concat(oldExpanded);
    } else {
      newExpanded = oldExpanded.filter((id) => id !== itemId);
    }

    this.store.parameters.onItemExpansionToggle?.(event, itemId, shouldBeExpanded);
    this.setExpandedItems(event, newExpanded);
  };

  /**
   * Expand all the siblings (i.e.: the items that have the same parent) of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item whose siblings will be expanded.
   */
  public expandAllSiblings = (event: React.KeyboardEvent, itemId: TreeViewItemId) => {
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    if (itemMeta == null) {
      return;
    }

    const siblings = itemsSelectors.itemOrderedChildrenIds(this.store.state, itemMeta.parentId);

    const diff = siblings.filter(
      (child) =>
        expansionSelectors.isItemExpandable(this.store.state, child) &&
        !expansionSelectors.isItemExpanded(this.store.state, child),
    );

    const newExpanded = expansionSelectors.expandedItemsRaw(this.store.state).concat(diff);

    if (diff.length > 0) {
      if (this.store.parameters.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          this.store.parameters.onItemExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      this.setExpandedItems(event, newExpanded);
    }
  };

  /**
   * Mark a list of items as expandable.
   * @param {TreeViewItemId[]} items The ids of the items to mark as expandable.
   */
  public addExpandableItems = (items: TreeViewItemId[]) => {
    const newItemMetaLookup = { ...this.store.state.itemMetaLookup };
    for (const itemId of items) {
      newItemMetaLookup[itemId] = { ...newItemMetaLookup[itemId], expandable: true };
    }
    this.store.set('itemMetaLookup', newItemMetaLookup);
  };
}
