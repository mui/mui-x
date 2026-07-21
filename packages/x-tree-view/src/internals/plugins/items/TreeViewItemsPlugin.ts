import type { TreeViewItemId, TreeViewValidItem } from '../../../models';
import { idSelectors } from '../id';
import { itemsSelectors } from './selectors';
import {
  buildItemsLookups,
  buildItemsLookupsRecursively,
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from './utils';
import type { MinimalTreeViewStore } from '../../MinimalTreeViewStore/MinimalTreeViewStore';
import type { MinimalTreeViewParameters } from '../../MinimalTreeViewStore/MinimalTreeViewStore.types';

export class TreeViewItemsPlugin<R extends TreeViewValidItem<R>> {
  private store: MinimalTreeViewStore<R, any>;

  // We can't type `store`, otherwise we get the following TS error:
  // 'items' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
  constructor(store: any) {
    this.store = store;
  }

  /**
   * Determines if the items state should be rebuilt based on the new and previous parameters.
   */
  public static shouldRebuildItemsState = <R2 extends TreeViewValidItem<R2>>(
    newParameters: MinimalTreeViewParameters<R2, any>,
    previousParameters: MinimalTreeViewParameters<R2, any>,
  ): boolean => {
    return [
      'items',
      'isItemDisabled',
      'isItemSelectionDisabled',
      'getItemId',
      'getItemLabel',
      'getItemChildren',
    ].some((key) => {
      const typedKey = key as keyof MinimalTreeViewParameters<R2, any>;
      return newParameters[typedKey] !== previousParameters[typedKey];
    });
  };

  /**
   * Builds the state properties derived from the `items` prop.
   */
  public static buildItemsStateIfNeeded = <R2 extends TreeViewValidItem<R2>>(
    parameters: Pick<
      MinimalTreeViewParameters<R2, any>,
      // When adding new parameters here, please also update the `shouldRebuildItemsState` method accordingly.
      | 'items'
      | 'isItemDisabled'
      | 'isItemSelectionDisabled'
      | 'getItemId'
      | 'getItemLabel'
      | 'getItemChildren'
    >,
  ) => {
    return buildItemsLookupsRecursively({
      storeParameters: parameters,
      items: parameters.items,
      parentId: null,
      depth: 0,
      isItemExpandable: (item, children) => !!children && children.length > 0,
    });
  };

  /**
   * Get the item with the given id.
   * When used in the Simple Tree View, it returns an object with the `id` and `label` properties.
   * @param {TreeViewItemId} itemId The id of the item to retrieve.
   * @returns {R} The item with the given id.
   */
  private getItem = (itemId: TreeViewItemId): R =>
    itemsSelectors.itemModel(this.store.state, itemId);

  /**
   * Get all the items in the same format as provided by `props.items`.
   * @returns {R[]} The items in the tree.
   */
  private getItemTree = (): R[] => {
    const getItemFromItemId = (itemId: TreeViewItemId): R => {
      const item = itemsSelectors.itemModel(this.store.state, itemId);
      const itemToMutate = { ...item };
      const newChildren = itemsSelectors.itemOrderedChildrenIds(this.store.state, itemId);
      if (newChildren.length > 0) {
        itemToMutate.children = newChildren.map(getItemFromItemId);
      } else {
        delete itemToMutate.children;
      }

      return itemToMutate;
    };

    return itemsSelectors.itemOrderedChildrenIds(this.store.state, null).map(getItemFromItemId);
  };

  /**
   * Get the ids of a given item's children.
   * Those ids are returned in the order they should be rendered.
   * To get the root items, pass `null` as the `itemId`.
   * @param {TreeViewItemId | null} itemId The id of the item to get the children of.
   * @returns {TreeViewItemId[]} The ids of the item's children.
   */
  private getItemOrderedChildrenIds = (itemId: TreeViewItemId | null): TreeViewItemId[] =>
    itemsSelectors.itemOrderedChildrenIds(this.store.state, itemId);

  /** * Get the id of the parent item.
   * @param {TreeViewItemId} itemId The id of the item to whose parentId we want to retrieve.
   * @returns {TreeViewItemId | null} The id of the parent item.
   */
  private getParentId = (itemId: TreeViewItemId): TreeViewItemId | null => {
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    return itemMeta?.parentId || null;
  };

  /**
   * Toggle the disabled state of the item with the given id.
   * @param {object} parameters The params of the method.
   * @param {TreeViewItemId } parameters.itemId The id of the item to get the children of.
   * @param {boolean } parameters.shouldBeDisabled true if the item should be disabled.
   */
  private setIsItemDisabled = ({
    itemId,
    shouldBeDisabled,
  }: {
    itemId: TreeViewItemId;
    shouldBeDisabled?: boolean;
  }) => {
    if (!this.store.state.itemMetaLookup[itemId]) {
      return;
    }

    const itemMetaLookup = { ...this.store.state.itemMetaLookup };
    itemMetaLookup[itemId] = {
      ...itemMetaLookup[itemId],
      disabled: shouldBeDisabled ?? !itemMetaLookup[itemId].disabled,
    };

    this.store.set('itemMetaLookup', itemMetaLookup);
  };

  /**
   * Add items to the tree.
   * The items are added as children of the item with the given `parentId`, or at the root level if `parentId` is `null` or not defined.
   * @param {AddItemsParameters<R>} parameters The items to add and their position in the tree.
   */
  public addItems = ({ items, parentId = null, index }: AddItemsParameters<R>) => {
    if (items.length === 0) {
      return;
    }

    if (parentId != null && itemsSelectors.itemMeta(this.store.state, parentId) == null) {
      throw new Error(
        `MUI X Tree View: Unable to add items to the parent with id "${parentId}" because it is not present in the tree. ` +
          'Pass the id of an existing item, or `null` to add the items at the root level.',
      );
    }

    const parentDepth =
      parentId == null ? -1 : itemsSelectors.itemDepth(this.store.state, parentId);

    // When the items are lazy loaded, an item can be expandable even if its children are not loaded yet.
    const dataSource = (
      this.store.parameters as { dataSource?: { getChildrenCount: (item: R) => number } }
    ).dataSource;
    const isItemExpandable = (item: R, children: R[] | undefined) => {
      if (children != null && children.length > 0) {
        return true;
      }

      return dataSource == null ? false : dataSource.getChildrenCount(item) !== 0;
    };

    const {
      itemMetaLookup: metaLookup,
      itemModelLookup: modelLookup,
      itemOrderedChildrenIdsLookup: orderedChildrenIdsLookup,
      itemChildrenIndexesLookup: childrenIndexesLookup,
    } = buildItemsLookupsRecursively({
      storeParameters: this.store.parameters,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable,
      existingItemMetaLookup: this.store.state.itemMetaLookup,
    });

    // `buildItemsLookups` allows an id to be re-used by an item with the same parent,
    // which is only valid when rebuilding the state from the `items` prop.
    for (const id of Object.keys(metaLookup)) {
      if (this.store.state.itemMetaLookup[id] != null) {
        throw new Error(
          `MUI X Tree View: All items must have a unique \`id\` property. ` +
            `The id "${id}" is used by multiple items. ` +
            'Use the `getItemId` prop to specify a custom id for each item if needed.',
        );
      }
    }

    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const existingChildrenIds = itemsSelectors.itemOrderedChildrenIds(this.store.state, parentId);
    const insertionIndex = index ?? existingChildrenIds.length;
    if (insertionIndex < 0 || insertionIndex > existingChildrenIds.length) {
      throw new Error(
        `MUI X Tree View: Unable to add items at index "${insertionIndex}" because it is out of range. ` +
          `The index must be between 0 and the amount of children of the parent item (${existingChildrenIds.length}).`,
      );
    }

    const mergedChildrenIds = [...existingChildrenIds];
    mergedChildrenIds.splice(insertionIndex, 0, ...orderedChildrenIdsLookup[parentIdWithDefault]);
    orderedChildrenIdsLookup[parentIdWithDefault] = mergedChildrenIds;
    childrenIndexesLookup[parentIdWithDefault] = buildSiblingIndexes(mergedChildrenIds);

    const newMetaLookup = { ...this.store.state.itemMetaLookup, ...metaLookup };
    if (parentId != null && !newMetaLookup[parentId].expandable) {
      newMetaLookup[parentId] = { ...newMetaLookup[parentId], expandable: true };
    }

    this.store.update({
      itemMetaLookup: newMetaLookup,
      itemModelLookup: { ...this.store.state.itemModelLookup, ...modelLookup },
      itemOrderedChildrenIdsLookup: {
        ...this.store.state.itemOrderedChildrenIdsLookup,
        ...orderedChildrenIdsLookup,
      },
      itemChildrenIndexesLookup: {
        ...this.store.state.itemChildrenIndexesLookup,
        ...childrenIndexesLookup,
      },
    });
  };

  public buildPublicAPI = () => {
    return {
      getItem: this.getItem,
      getItemDOMElement: this.getItemDOMElement,
      getItemOrderedChildrenIds: this.getItemOrderedChildrenIds,
      getItemTree: this.getItemTree,
      getParentId: this.getParentId,
      setIsItemDisabled: this.setIsItemDisabled,
    };
  };

  /**
   * Get the DOM element of the item with the given id.
   * @param {TreeViewItemId} itemId The id of the item to get the DOM element of.
   * @returns {HTMLElement | null} The DOM element of the item with the given id.
   */
  public getItemDOMElement = (itemId: TreeViewItemId): HTMLElement | null => {
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = idSelectors.treeItemIdAttribute(
      this.store.state,
      itemId,
      itemMeta.idAttribute,
    );
    return document.getElementById(idAttribute);
  };

  /**
   * Add an array of items to the tree.
   * @param {SetItemChildrenParameters<R>} args The items to add to the tree and information about their ancestors.
   */
  public setItemChildren = ({
    items,
    parentId,
    getChildrenCount,
  }: {
    items: readonly R[];
    parentId: TreeViewItemId | null;
    getChildrenCount: (item: R) => number;
  }) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const parentDepth =
      parentId == null ? -1 : itemsSelectors.itemDepth(this.store.state, parentId);

    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes } = buildItemsLookups({
      storeParameters: this.store.parameters,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable: getChildrenCount ? (item) => getChildrenCount(item) !== 0 : () => false,
      otherItemsMetaLookup: itemsSelectors.itemMetaLookup(this.store.state),
    });

    this.store.update({
      itemModelLookup: { ...this.store.state.itemModelLookup, ...modelLookup },
      itemMetaLookup: { ...this.store.state.itemMetaLookup, ...metaLookup },
      itemOrderedChildrenIdsLookup: {
        ...this.store.state.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...this.store.state.itemChildrenIndexesLookup,
        [parentIdWithDefault]: childrenIndexes,
      },
    });
  };

  /**
   * Remove the children of an item.
   * @param {TreeViewItemId | null} parentId The id of the item to remove the children of.
   */
  public removeChildren = (parentId: TreeViewItemId | null) => {
    const itemMetaLookup = this.store.state.itemMetaLookup;
    const newMetaMap = Object.keys(itemMetaLookup).reduce((acc, key) => {
      const item = itemMetaLookup[key];
      if (item.parentId === parentId) {
        return acc;
      }
      return { ...acc, [item.id]: item };
    }, {});

    const newItemOrderedChildrenIdsLookup = { ...this.store.state.itemOrderedChildrenIdsLookup };
    const newItemChildrenIndexesLookup = { ...this.store.state.itemChildrenIndexesLookup };
    const cleanId = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    delete newItemChildrenIndexesLookup[cleanId];
    delete newItemOrderedChildrenIdsLookup[cleanId];

    this.store.update({
      itemMetaLookup: newMetaMap,
      itemOrderedChildrenIdsLookup: newItemOrderedChildrenIdsLookup,
      itemChildrenIndexesLookup: newItemChildrenIndexesLookup,
    });
  };

  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item being clicked.
   */
  public handleItemClick = (event: React.MouseEvent, itemId: TreeViewItemId) => {
    this.store.parameters.onItemClick?.(event, itemId);
  };
}

export interface AddItemsParameters<R extends TreeViewValidItem<R>> {
  /**
   * The items to add to the tree.
   */
  items: readonly R[];
  /**
   * The id of the item to add the items to.
   * If `null` or not defined, the items are added at the root level.
   * @default null
   */
  parentId?: TreeViewItemId | null;
  /**
   * The position in the parent's children at which the items are inserted.
   * If not defined, the items are appended after the existing children.
   */
  index?: number;
}
