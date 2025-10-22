import { TreeViewItemId, TreeViewValidItem } from '../../models';
import { idSelectors } from '../corePlugins/useTreeViewId';
import { generateTreeItemIdAttribute } from '../corePlugins/useTreeViewId/useTreeViewId.utils';
import { itemsSelectors, TREE_VIEW_ROOT_PARENT_ID } from '../plugins/useTreeViewItems';
import {
  BuildItemsLookupConfig,
  buildItemsLookups,
} from '../plugins/useTreeViewItems/useTreeViewItems.utils';
import type { TreeViewStore } from './TreeViewStore';

export class TreeViewItemsManager<
  R extends TreeViewValidItem<R>,
  Store extends TreeViewStore<R, any, any, any>,
> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public getItemDOMElement = (itemId: string) => {
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = generateTreeItemIdAttribute({
      treeId: idSelectors.treeId(this.store.state),
      itemId,
      id: itemMeta.idAttribute,
    });
    return document.getElementById(idAttribute);
  };

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

    const itemsConfig: BuildItemsLookupConfig = {
      isItemDisabled: this.store.parameters.isItemDisabled,
      getItemLabel: this.store.parameters.getItemLabel,
      getItemChildren: this.store.parameters.getItemChildren,
      getItemId: this.store.parameters.getItemId,
    };

    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes } = buildItemsLookups({
      config: itemsConfig,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable: getChildrenCount ? (item) => getChildrenCount(item) > 0 : () => false,
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

  public removeChildren = (parentId: string | null) => {
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

  public handleItemClick = (event: React.MouseEvent, itemId: TreeViewItemId) => {
    this.store.parameters.onItemClick?.(event, itemId);
  };
}
