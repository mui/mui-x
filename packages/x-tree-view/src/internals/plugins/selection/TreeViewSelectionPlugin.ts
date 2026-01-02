import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { TreeViewItemId, TreeViewSelectionPropagation } from '../../../models';
import { TreeViewAnyStore } from '../../models';
import { itemsSelectors } from '../items';
import { selectionSelectors } from './selectors';
import { useSelectionItemPlugin } from './itemPlugin';
import {
  findOrderInTremauxTree,
  getAllNavigableItems,
  getFirstNavigableItem,
  getLastNavigableItem,
  getNonDisabledItemsInRange,
} from '../../utils/tree';
import type { MinimalTreeViewStore } from '../../MinimalTreeViewStore/MinimalTreeViewStore';
import { TreeViewSelectionValue } from '../../MinimalTreeViewStore/MinimalTreeViewStore.types';

export class TreeViewSelectionPlugin<Multiple extends boolean | undefined> {
  private store: MinimalTreeViewStore<any, Multiple>;

  private lastSelectedItem: TreeViewItemId | null = null;

  private lastSelectedRange: Record<string, boolean> = {};

  // We can't type `store`, otherwise we get the following TS error:
  // 'selection' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
  constructor(store: any) {
    this.store = store;
    store.itemPluginManager.register(useSelectionItemPlugin, null);
  }

  private setSelectedItems = (
    event: React.SyntheticEvent | null,
    newModel: string[] | string | null,
    additionalItemsToPropagate?: TreeViewItemId[],
  ) => {
    const {
      selectionPropagation = EMPTY_OBJECT as TreeViewSelectionPropagation,
      selectedItems,
      onItemSelectionToggle,
      onSelectedItemsChange,
    } = this.store.parameters;

    const oldModel = selectionSelectors.selectedItemsRaw(this.store.state);
    let cleanModel: TreeViewSelectionValue<Multiple>;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);

    if (
      isMultiSelectEnabled &&
      (selectionPropagation.descendants || selectionPropagation.parents)
    ) {
      cleanModel = propagateSelection({
        store: this.store,
        selectionPropagation,
        newModel: newModel as string[],
        oldModel: oldModel as string[],
        additionalItemsToPropagate,
      }) as TreeViewSelectionValue<Multiple>;
    } else {
      cleanModel = newModel as TreeViewSelectionValue<Multiple>;
    }

    if (onItemSelectionToggle) {
      if (isMultiSelectEnabled) {
        const changes = getAddedAndRemovedItems({
          store: this.store,
          newModel: cleanModel as string[],
          oldModel: oldModel as string[],
        });

        if (onItemSelectionToggle) {
          changes.added.forEach((itemId) => {
            onItemSelectionToggle!(event, itemId, true);
          });

          changes.removed.forEach((itemId) => {
            onItemSelectionToggle!(event, itemId, false);
          });
        }
      } else if (cleanModel !== oldModel) {
        if (oldModel != null) {
          onItemSelectionToggle(event, oldModel as string, false);
        }
        if (cleanModel != null) {
          onItemSelectionToggle(event, cleanModel as string, true);
        }
      }
    }

    if (selectedItems === undefined) {
      this.store.set('selectedItems', cleanModel);
    }

    onSelectedItemsChange?.(event, cleanModel);
  };

  private selectRange = (event: React.SyntheticEvent, [start, end]: [string, string]) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectionSelectors.selectedItems(this.store.state).slice();

    // If the last selection was a range selection,
    // remove the items that were part of the last range from the model
    if (Object.keys(this.lastSelectedRange).length > 0) {
      newSelectedItems = newSelectedItems.filter((id) => !this.lastSelectedRange[id]);
    }

    // Add to the model the items that are part of the new range and not already part of the model.
    const selectedItemsLookup = getLookupFromArray(newSelectedItems);
    const range = getNonDisabledItemsInRange(this.store.state, start, end).filter((id) =>
      selectionSelectors.isItemSelectable(this.store.state, id),
    );
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);

    this.setSelectedItems(event, newSelectedItems);
    this.lastSelectedRange = getLookupFromArray(range);
  };

  public buildPublicAPI = () => {
    return {
      setItemSelection: this.setItemSelection,
    };
  };

  /**
   * Select or deselect an item.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to select or deselect.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.keepExistingSelection If `true`, the other already selected items will remain selected, otherwise, they will be deselected. This parameter is only relevant when `multiSelect` is `true`
   * @param {boolean | undefined} parameters.shouldBeSelected If `true` the item will be selected. If `false` the item will be deselected. If not defined, the item's selection status will be toggled.
   */
  public setItemSelection = ({
    itemId,
    event = null,
    keepExistingSelection = false,
    shouldBeSelected,
  }: {
    itemId: string;
    event?: React.SyntheticEvent | null;
    shouldBeSelected?: boolean;
    keepExistingSelection?: boolean;
  }) => {
    if (!selectionSelectors.enabled(this.store.state)) {
      return;
    }

    let newSelected: TreeViewSelectionValue<boolean>;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (keepExistingSelection) {
      const oldSelected = selectionSelectors.selectedItems(this.store.state);
      const isSelectedBefore = selectionSelectors.isItemSelected(this.store.state, itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = oldSelected.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(oldSelected);
      } else {
        newSelected = oldSelected;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (
        shouldBeSelected === false ||
        (shouldBeSelected == null && selectionSelectors.isItemSelected(this.store.state, itemId))
      ) {
        newSelected = isMultiSelectEnabled ? [] : null;
      } else {
        newSelected = isMultiSelectEnabled ? [itemId] : itemId;
      }
    }

    this.setSelectedItems(
      event,
      newSelected,
      // If shouldBeSelected === selectionSelectors.isItemSelected(store, itemId), we still want to propagate the select.
      // This is useful when the element is in an indeterminate state.
      [itemId],
    );
    this.lastSelectedItem = itemId;
    this.lastSelectedRange = {};
  };

  /**
   * Select all the navigable items in the tree.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   */
  public selectAllNavigableItems = (event: React.SyntheticEvent) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    const navigableItems = getAllNavigableItems(this.store.state);
    this.setSelectedItems(event, navigableItems);

    this.lastSelectedRange = getLookupFromArray(navigableItems);
  };

  /**
   * Expand the current selection range up to the given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to expand the selection to.
   */
  public expandSelectionRange = (event: React.SyntheticEvent, itemId: string) => {
    if (this.lastSelectedItem != null) {
      const [start, end] = findOrderInTremauxTree(this.store.state, itemId, this.lastSelectedItem);
      this.selectRange(event, [start, end]);
    }
  };

  /**
   * Expand the current selection range from the first navigable item to the given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item up to which the selection range should be expanded.
   */
  public selectRangeFromStartToItem = (event: React.SyntheticEvent, itemId: string) => {
    this.selectRange(event, [getFirstNavigableItem(this.store.state), itemId]);
  };

  /**
   * Expand the current selection range from the given item to the last navigable item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item from which the selection range should be expanded.
   */
  public selectRangeFromItemToEnd = (event: React.SyntheticEvent, itemId: string) => {
    this.selectRange(event, [itemId, getLastNavigableItem(this.store.state)]);
  };

  /**
   * Update the selection when navigating with ArrowUp / ArrowDown keys.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} currentItemId The id of the active item before the keyboard navigation.
   * @param {TreeViewItemId} nextItemId The id of the active item after the keyboard navigation.
   */
  public selectItemFromArrowNavigation = (
    event: React.SyntheticEvent,
    currentItem: string,
    nextItem: string,
  ) => {
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);
    if (!isMultiSelectEnabled) {
      return;
    }

    let newSelectedItems = selectionSelectors.selectedItems(this.store.state).slice();

    if (Object.keys(this.lastSelectedRange).length === 0) {
      newSelectedItems.push(nextItem);
      this.lastSelectedRange = { [currentItem]: true, [nextItem]: true };
    } else {
      if (!this.lastSelectedRange[currentItem]) {
        this.lastSelectedRange = {};
      }

      if (this.lastSelectedRange[nextItem]) {
        newSelectedItems = newSelectedItems.filter((id) => id !== currentItem);
        delete this.lastSelectedRange[currentItem];
      } else {
        newSelectedItems.push(nextItem);
        this.lastSelectedRange[nextItem] = true;
      }
    }

    this.setSelectedItems(event, newSelectedItems);
  };
}

function propagateSelection({
  store,
  selectionPropagation,
  newModel,
  oldModel,
  additionalItemsToPropagate,
}: {
  store: TreeViewAnyStore;
  selectionPropagation: TreeViewSelectionPropagation;
  newModel: TreeViewItemId[];
  oldModel: TreeViewItemId[];
  additionalItemsToPropagate?: TreeViewItemId[];
}): TreeViewItemId[] {
  if (!selectionPropagation.descendants && !selectionPropagation.parents) {
    return newModel;
  }

  let shouldRegenerateModel = false;
  const newModelLookup = getLookupFromArray(newModel);

  const changes = getAddedAndRemovedItems({
    store,
    newModel,
    oldModel,
  });

  additionalItemsToPropagate?.forEach((itemId) => {
    if (newModelLookup[itemId]) {
      if (!changes.added.includes(itemId)) {
        changes.added.push(itemId);
      }
    } else if (!changes.removed.includes(itemId)) {
      changes.removed.push(itemId);
    }
  });

  changes.added.forEach((addedItemId) => {
    if (selectionPropagation.descendants) {
      const selectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== addedItemId) {
          shouldRegenerateModel = true;
          newModelLookup[itemId] = true;
        }

        itemsSelectors.itemOrderedChildrenIds(store.state, itemId).forEach(selectDescendants);
      };

      selectDescendants(addedItemId);
    }

    if (selectionPropagation.parents) {
      const checkAllDescendantsSelected = (itemId: TreeViewItemId): boolean => {
        if (!newModelLookup[itemId]) {
          return false;
        }

        const children = itemsSelectors.itemOrderedChildrenIds(store.state, itemId);
        return children.every(checkAllDescendantsSelected);
      };

      const selectParents = (itemId: TreeViewItemId) => {
        const parentId = itemsSelectors.itemParentId(store.state, itemId);
        if (parentId == null) {
          return;
        }

        const siblings = itemsSelectors.itemOrderedChildrenIds(store.state, parentId);
        if (siblings.every(checkAllDescendantsSelected)) {
          shouldRegenerateModel = true;
          newModelLookup[parentId] = true;
          selectParents(parentId);
        }
      };
      selectParents(addedItemId);
    }
  });

  changes.removed.forEach((removedItemId) => {
    if (selectionPropagation.parents) {
      let parentId = itemsSelectors.itemParentId(store.state, removedItemId);
      while (parentId != null) {
        if (newModelLookup[parentId]) {
          shouldRegenerateModel = true;
          delete newModelLookup[parentId];
        }

        parentId = itemsSelectors.itemParentId(store.state, parentId);
      }
    }

    if (selectionPropagation.descendants) {
      const deSelectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== removedItemId) {
          shouldRegenerateModel = true;
          delete newModelLookup[itemId];
        }

        itemsSelectors.itemOrderedChildrenIds(store.state, itemId).forEach(deSelectDescendants);
      };

      deSelectDescendants(removedItemId);
    }
  });

  return shouldRegenerateModel ? Object.keys(newModelLookup) : newModel;
}

function getAddedAndRemovedItems({
  store,
  oldModel,
  newModel,
}: {
  store: TreeViewAnyStore;
  oldModel: TreeViewItemId[];
  newModel: TreeViewItemId[];
}) {
  const newModelMap = new Map<TreeViewItemId, true>();
  newModel.forEach((id) => {
    newModelMap.set(id, true);
  });

  return {
    added: newModel.filter((itemId) => !selectionSelectors.isItemSelected(store.state, itemId)),
    removed: oldModel.filter((itemId) => !newModelMap.has(itemId)),
  };
}

export function getLookupFromArray(array: string[]) {
  const lookup: { [itemId: string]: true } = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
}
