import { TreeViewItemId, TreeViewValidItem } from '../../../models';
import { idSelectors } from '../id';
import { itemsSelectors } from './selectors';
import { buildItemsLookups, TREE_VIEW_ROOT_PARENT_ID } from './utils';
import type { MinimalTreeViewStore } from '../../MinimalTreeViewStore/MinimalTreeViewStore';
import {
  MinimalTreeViewParameters,
  MinimalTreeViewState,
} from '../../MinimalTreeViewStore/MinimalTreeViewStore.types';

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
    const itemMetaLookup: MinimalTreeViewState<R2, any>['itemMetaLookup'] = {};
    const itemModelLookup: MinimalTreeViewState<R2, any>['itemModelLookup'] = {};
    const itemOrderedChildrenIdsLookup: MinimalTreeViewState<
      R2,
      any
    >['itemOrderedChildrenIdsLookup'] = {};
    const itemChildrenIndexesLookup: MinimalTreeViewState<R2, any>['itemChildrenIndexesLookup'] =
      {};

    function processSiblings(items: readonly R2[], parentId: string | null, depth: number) {
      const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
      const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes, itemsChildren } =
        buildItemsLookups({
          storeParameters: parameters,
          items,
          parentId,
          depth,
          isItemExpandable: (item, children) => !!children && children.length > 0,
          otherItemsMetaLookup: itemMetaLookup,
        });

      Object.assign(itemMetaLookup, metaLookup);
      Object.assign(itemModelLookup, modelLookup);
      itemOrderedChildrenIdsLookup[parentIdWithDefault] = orderedChildrenIds;
      itemChildrenIndexesLookup[parentIdWithDefault] = childrenIndexes;

      for (const item of itemsChildren) {
        processSiblings(item.children || [], item.id, depth + 1);
      }
    }

    processSiblings(parameters.items, null, 0);

    return {
      itemMetaLookup,
      itemModelLookup,
      itemOrderedChildrenIdsLookup,
      itemChildrenIndexesLookup,
    };
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
