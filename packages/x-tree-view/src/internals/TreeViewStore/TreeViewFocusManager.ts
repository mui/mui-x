import { TreeViewCancellableEvent } from '../../models';
import type { TreeViewStore } from './TreeViewStore';
import { expansionSelectors } from '../plugins/useTreeViewExpansion';
import { focusSelectors } from '../plugins/useTreeViewFocus';
import { itemsSelectors } from '../plugins/useTreeViewItems';

export class TreeViewFocusManager<Store extends TreeViewStore<any, any, any, any>> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;

    // Whenever the items change, we need to ensure the focused item is still present.
    this.store.registerStoreEffect(itemsSelectors.itemMetaLookup, () => {
      const focusedItemId = focusSelectors.focusedItemId(store.state);
      if (focusedItemId == null) {
        return;
      }

      const hasItemBeenRemoved = !itemsSelectors.itemMeta(store.state, focusedItemId);
      if (!hasItemBeenRemoved) {
        return;
      }

      const defaultFocusableItemId = focusSelectors.defaultFocusableItemId(store.state);
      if (defaultFocusableItemId == null) {
        this.setFocusedItemId(null);
        return;
      }

      this.innerFocusItem(null, defaultFocusableItemId);
    });
  }

  private setFocusedItemId = (itemId: string | null) => {
    const focusedItemId = focusSelectors.focusedItemId(this.store.state);
    if (focusedItemId === itemId) {
      return;
    }

    this.store.set('focusedItemId', itemId);
  };

  // TODO: Rename
  private innerFocusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    const itemElement = this.store.getItemDOMElement(itemId);
    if (itemElement) {
      itemElement.focus();
    }

    this.setFocusedItemId(itemId);
    this.store.parameters.onItemFocus?.(event, itemId);
  };

  public focusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    // If we receive an itemId, and it is visible, the focus will be set to it
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    const isItemVisible =
      itemMeta &&
      (itemMeta.parentId == null ||
        expansionSelectors.isItemExpanded(this.store.state, itemMeta.parentId));

    if (isItemVisible) {
      this.innerFocusItem(event, itemId);
    }
  };

  public removeFocusedItem = () => {
    const focusedItemId = focusSelectors.focusedItemId(this.store.state);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = itemsSelectors.itemMeta(this.store.state, focusedItemId);
    if (itemMeta) {
      const itemElement = this.store.getItemDOMElement(focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }

    this.setFocusedItemId(null);
  };

  public handleRootFocus = (
    event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    // if the event bubbled (which is React specific) we don't want to steal focus
    const defaultFocusableItemId = focusSelectors.defaultFocusableItemId(this.store.state);
    if (event.target === event.currentTarget && defaultFocusableItemId != null) {
      this.innerFocusItem(event, defaultFocusableItemId);
    }
  };

  public handleRootBlur = (
    event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    this.setFocusedItemId(null);
  };
}
