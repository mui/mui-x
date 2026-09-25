import type { TreeViewItemId } from '../../../models';
import type { TreeViewItemMeta } from '../../models';
import type { SimpleTreeViewStore } from '../../SimpleTreeViewStore';
import { buildSiblingIndexes, itemsSelectors, TREE_VIEW_ROOT_PARENT_ID } from '../items';
import { idSelectors } from '../id';
import { escapeOperandAttributeSelector } from '../../utils/utils';
import { jsxItemsitemWrapper, useJSXItemsItemPlugin } from './itemPlugin';

export class TreeViewJSXItemsPlugin {
  private store: SimpleTreeViewStore<any>;

  /**
   * Tracks which component instance owns each item id,
   * so that duplicate ids from different components can be detected.
   */
  private itemOwners = new Map<string, symbol>();

  public constructor(store: SimpleTreeViewStore<any>) {
    this.store = store;
    store.itemPluginManager.register(useJSXItemsItemPlugin, jsxItemsitemWrapper);
  }

  private orderingRoot: React.RefObject<HTMLElement | null> | null = null;

  private refreshOrder: (() => void) | null = null;

  private pendingParents = new Set<TreeViewItemId | null>();

  // An index of the existing metadata, not a second item registration lifecycle.
  private itemIdByDOMId = new Map<string, TreeViewItemId>();

  private indexedTreeId: string | undefined;

  public setOrderingRoot = (rootRef: React.RefObject<HTMLElement | null>, refresh: () => void) => {
    this.orderingRoot = rootRef;
    this.refreshOrder = refresh;
    if (this.pendingParents.size > 0) {
      refresh();
    }
    return () => {
      this.orderingRoot = null;
      this.refreshOrder = null;
      this.pendingParents.clear();
    };
  };

  public requestOrderUpdate = (parentId: TreeViewItemId | null) => {
    if (this.pendingParents.has(parentId)) {
      return;
    }
    const wasEmpty = this.pendingParents.size === 0;
    this.pendingParents.add(parentId);
    if (wasEmpty) {
      this.refreshOrder?.();
    }
  };

  private ensureDOMIdIndex = () => {
    const treeId = idSelectors.treeId(this.store.state);
    if (this.indexedTreeId === treeId) {
      return;
    }
    this.indexedTreeId = treeId;
    this.itemIdByDOMId.clear();
    for (const meta of Object.values(this.store.state.itemMetaLookup)) {
      this.itemIdByDOMId.set(
        idSelectors.treeItemIdAttribute(this.store.state, meta.id, meta.idAttribute),
        meta.id,
      );
    }
  };

  private removeDOMIdIndexEntry = (item: TreeViewItemMeta) => {
    const domId = idSelectors.treeItemIdAttribute(this.store.state, item.id, item.idAttribute);
    // Another item may already have claimed this DOM id during the same commit.
    if (this.itemIdByDOMId.get(domId) === item.id) {
      this.itemIdByDOMId.delete(domId);
    }
  };

  private getItemElement = (itemId: TreeViewItemId) => {
    const root = this.orderingRoot?.current;
    const meta = itemsSelectors.itemMeta(this.store.state, itemId);
    if (!root || !meta) {
      return null;
    }
    const id = idSelectors.treeItemIdAttribute(this.store.state, itemId, meta.idAttribute);
    const element = root.ownerDocument.getElementById(id);
    if (element && root.contains(element)) {
      return element;
    }
    // Detached containers and shadow roots are not indexed by their owner document.
    return root.querySelector<HTMLElement>(
      `[id="${escapeOperandAttributeSelector(id)}"][role="treeitem"]`,
    );
  };

  /**
   * A keyed item can move without any of its metadata changing. Check its
   * neighbors after a render, and only rescan its parent if the DOM order changed.
   */
  public checkItemOrder = (itemId: TreeViewItemId) => {
    const { state } = this.store;
    const meta = itemsSelectors.itemMeta(state, itemId);
    if (!meta || this.pendingParents.has(null) || this.pendingParents.has(meta.parentId)) {
      return;
    }
    const siblings = itemsSelectors.itemOrderedChildrenIds(state, meta.parentId);
    const index =
      state.itemChildrenIndexesLookup[meta.parentId ?? TREE_VIEW_ROOT_PARENT_ID]?.[itemId];
    if (index == null) {
      this.requestOrderUpdate(meta.parentId);
      return;
    }
    const element = this.getItemElement(itemId);
    if (!element) {
      return;
    }
    const previous = index > 0 ? this.getItemElement(siblings[index - 1]) : null;
    const next = index + 1 < siblings.length ? this.getItemElement(siblings[index + 1]) : null;
    if ((previous && isBefore(element, previous)) || (next && isBefore(next, element))) {
      this.requestOrderUpdate(meta.parentId);
    }
  };

  /** Reconcile all affected branches after the item layout effects have committed. */
  public syncItemOrder = () => {
    const root = this.orderingRoot?.current;
    if (!root || this.pendingParents.size === 0) {
      return;
    }
    this.ensureDOMIdIndex();
    const pendingParents = this.pendingParents;
    this.pendingParents = new Set();
    const { state } = this.store;
    const nextChildren = new Map<TreeViewItemId | null, TreeViewItemId[]>();

    const collect = (element: HTMLElement, parentId: TreeViewItemId | null) => {
      // Collapsed and unmounted branches retain their previous children so that
      // indeterminate selection does not depend on whether those children are mounted.
      if (parentId !== null && element.getAttribute('aria-expanded') === 'false') {
        return;
      }
      nextChildren.set(parentId, []);
      const nodes = Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"]'));
      for (const node of nodes) {
        const itemId = this.itemIdByDOMId.get(node.id);
        if (itemId !== undefined && node.getAttribute('aria-expanded') !== 'false') {
          nextChildren.set(itemId, []);
        }
      }
      for (const node of nodes) {
        const itemId = this.itemIdByDOMId.get(node.id);
        const meta = itemId === undefined ? null : itemsSelectors.itemMeta(state, itemId);
        if (!meta) {
          // React leaves suspended elements in the DOM after their metadata was removed.
          continue;
        }
        const parentNode = node.parentElement?.closest('[role="treeitem"]');
        if (meta.parentId === null) {
          if (parentNode && root.contains(parentNode)) {
            continue;
          }
        } else {
          const parentMeta = itemsSelectors.itemMeta(state, meta.parentId);
          if (
            !parentMeta ||
            parentNode?.id !==
              idSelectors.treeItemIdAttribute(state, parentMeta.id, parentMeta.idAttribute)
          ) {
            continue;
          }
        }
        nextChildren.get(meta.parentId)?.push(meta.id);
      }
    };

    for (const parentId of pendingParents) {
      if (parentId === null) {
        collect(root, null);
        break;
      }
      if (pendingParents.has(null)) {
        continue;
      }
      const meta = itemsSelectors.itemMeta(state, parentId);
      if (!meta) {
        continue;
      }
      let ancestorId = meta.parentId;
      while (ancestorId !== null && !pendingParents.has(ancestorId)) {
        ancestorId = itemsSelectors.itemParentId(state, ancestorId);
      }
      if (ancestorId !== null) {
        continue;
      }
      const element = this.getItemElement(parentId);
      if (element && root.contains(element)) {
        collect(element, parentId);
      }
    }

    const changed = Array.from(nextChildren).filter(([parentId, ids]) => {
      const previous = itemsSelectors.itemOrderedChildrenIds(state, parentId);
      return ids.length !== previous.length || ids.some((id, index) => id !== previous[index]);
    });
    if (changed.length === 0) {
      return;
    }
    const orderLookup = { ...state.itemOrderedChildrenIdsLookup };
    const indexLookup = { ...state.itemChildrenIndexesLookup };
    for (const [parentId, ids] of changed) {
      const key = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
      orderLookup[key] = ids;
      indexLookup[key] = buildSiblingIndexes(ids);
    }
    this.store.update({
      itemOrderedChildrenIdsLookup: orderLookup,
      itemChildrenIndexesLookup: indexLookup,
    });
    this.store.selection.propagateSelectionToUpdatedParents(changed.map(([parentId]) => parentId));
  };

  /**
   * Insert or update an item in the state from a Tree Item component.
   * If the item already exists and belongs to the same owner (e.g. after a deps-change re-run of the layout effect),
   * its meta is updated in place instead of removing and re-inserting.
   */
  public upsertJSXItem = (item: TreeViewItemMeta, ownerToken: symbol) => {
    const currentOwner = this.itemOwners.get(item.id);

    if (currentOwner != null && currentOwner !== ownerToken) {
      throw new Error(
        `MUI X: The Tree View component requires all items to have a unique \`id\` property.
Alternatively, you can use the \`getItemId\` prop to specify a custom id for each item.
Two items were provided with the same id in the \`items\` prop: "${item.id}"`,
      );
    }

    this.itemOwners.set(item.id, ownerToken);
    const existingMeta = itemsSelectors.itemMeta(this.store.state, item.id);
    if (
      !existingMeta ||
      existingMeta.parentId !== item.parentId ||
      existingMeta.idAttribute !== item.idAttribute
    ) {
      this.ensureDOMIdIndex();
      if (existingMeta) {
        this.removeDOMIdIndexEntry(existingMeta);
        this.requestOrderUpdate(existingMeta.parentId);
      }
      this.itemIdByDOMId.set(
        idSelectors.treeItemIdAttribute(this.store.state, item.id, item.idAttribute),
        item.id,
      );
      this.requestOrderUpdate(item.parentId);
    }

    if (existingMeta != null) {
      if (existingMeta.expandable !== item.expandable) {
        this.requestOrderUpdate(item.id);
      }
      // Update the existing item in place.
      let hasChanges = false;
      for (const key of Object.keys(item) as (keyof TreeViewItemMeta)[]) {
        if (existingMeta[key] !== item[key]) {
          hasChanges = true;
          break;
        }
      }

      if (hasChanges) {
        this.store.update({
          itemMetaLookup: {
            ...this.store.state.itemMetaLookup,
            [item.id]: { ...existingMeta, ...item },
          },
        });
      }
    } else {
      this.store.update({
        itemMetaLookup: { ...this.store.state.itemMetaLookup, [item.id]: item },
        // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
        itemModelLookup: {
          ...this.store.state.itemModelLookup,
          [item.id]: { id: item.id, label: item.label ?? '' },
        },
      });
    }

    return () => {
      this.ensureDOMIdIndex();
      this.itemOwners.delete(item.id);
      this.removeDOMIdIndexEntry(item);
      this.requestOrderUpdate(item.parentId);

      const newItemMetaLookup = { ...this.store.state.itemMetaLookup };
      const newItemModelLookup = { ...this.store.state.itemModelLookup };
      delete newItemMetaLookup[item.id];
      delete newItemModelLookup[item.id];

      this.store.update({
        itemMetaLookup: newItemMetaLookup,
        itemModelLookup: newItemModelLookup,
      });
    };
  };

  /**
   * Updates the `labelMap` to register the first character of the given item's label.
   * This map is used to navigate the tree using type-ahead search.
   * @param {TreeViewItemId} itemId The id of the item to map the label of.
   * @param {string} label The item's label.
   * @returns {() => void} A function to remove the item from the `labelMap`.
   */
  public mapLabelFromJSX = (itemId: TreeViewItemId, label: string) => {
    this.store.keyboardNavigation.updateLabelMap((labelMap) => {
      labelMap[itemId] = label;
      return labelMap;
    });

    return () => {
      this.store.keyboardNavigation.updateLabelMap((labelMap) => {
        const newMap = { ...labelMap };
        delete newMap[itemId];
        return newMap;
      });
    };
  };
}

function isBefore(a: HTMLElement, b: HTMLElement) {
  // compareDocumentPosition returns a bitmask, including containment/disconnection flags.
  // eslint-disable-next-line no-bitwise
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}
