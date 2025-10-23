import { TreeViewItemId } from '../../models';
import type { MinimalTreeViewStore } from './MinimalTreeViewStore';
import { expansionSelectors } from '../plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import { itemsSelectors } from '../plugins/useTreeViewItems/useTreeViewItems.selectors';

export class TreeViewExpansionManager<Store extends MinimalTreeViewStore<any, any, any, any>> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  private setExpandedItems = (event: React.SyntheticEvent | null, value: TreeViewItemId[]) => {
    if (this.store.parameters.expandedItems === undefined) {
      this.store.set('expandedItems', value);
    }
    this.store.parameters.onExpandedItemsChange?.(event, value);
  };

  public isItemExpanded = (itemId: TreeViewItemId) =>
    expansionSelectors.isItemExpanded(this.store.state, itemId);

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

    const eventParameters = {
      isExpansionPrevented: false,
      shouldBeExpanded: cleanShouldBeExpanded,
      event,
      itemId,
    };
    publishTreeViewEvent(instance, 'beforeItemToggleExpansion', eventParameters);
    if (eventParameters.isExpansionPrevented) {
      return;
    }

    this.applyItemExpansion({ itemId, event, shouldBeExpanded: cleanShouldBeExpanded });
  };

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
}
