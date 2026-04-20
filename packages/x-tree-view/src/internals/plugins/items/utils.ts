import { TreeViewValidItem, TreeViewItemId } from '../../../models';
import { TreeViewItemMeta } from '../../models';
import type { MinimalTreeViewParameters, MinimalTreeViewState } from '../../MinimalTreeViewStore';

export const TREE_VIEW_ROOT_PARENT_ID = '__TREE_VIEW_ROOT_PARENT_ID__';

export const buildSiblingIndexes = (siblings: string[]) => {
  const siblingsIndexLookup: { [itemId: string]: number } = {};
  siblings.forEach((childId, index) => {
    siblingsIndexLookup[childId] = index;
  });

  return siblingsIndexLookup;
};

/**
 * Check if an item is disabled.
 * This method should only be used in selectors that are checking if several items are disabled.
 * Otherwise, use the `itemsSelector.isItemDisabled` selector.
 * @returns
 */
export const isItemDisabled = (
  itemMetaLookup: { [itemId: string]: TreeViewItemMeta },
  itemId: TreeViewItemId,
) => {
  if (itemId == null) {
    return false;
  }

  let itemMeta = itemMetaLookup[itemId];

  // This can be called before the item has been added to the item map.
  if (!itemMeta) {
    return false;
  }

  if (itemMeta.disabled) {
    return true;
  }

  while (itemMeta.parentId != null) {
    itemMeta = itemMetaLookup[itemMeta.parentId];
    if (!itemMeta) {
      return false;
    }

    if (itemMeta.disabled) {
      return true;
    }
  }

  return false;
};

export function buildItemsLookups<R extends TreeViewValidItem<R>>(
  parameters: BuildItemsLookupsParameters<R>,
) {
  const { storeParameters, items, parentId, depth, isItemExpandable, otherItemsMetaLookup } =
    parameters;
  const metaLookup: MinimalTreeViewState<R, any>['itemMetaLookup'] = {};
  const modelLookup: MinimalTreeViewState<R, any>['itemModelLookup'] = {};
  const orderedChildrenIds: string[] = [];
  const itemsChildren: { id: string | null; children: R[] }[] = [];

  const processItem = (item: R) => {
    const id: string = storeParameters.getItemId
      ? storeParameters.getItemId(item)
      : (item as any).id;
    checkId({
      id,
      parentId,
      item,
      itemMetaLookup: otherItemsMetaLookup,
      siblingsMetaLookup: metaLookup,
    });
    const label = storeParameters.getItemLabel
      ? storeParameters.getItemLabel(item)
      : (item as any).label;
    if (label == null) {
      throw new Error(
        'MUI X Tree View: All items must have a `label` property. ' +
          'You can use the `getItemLabel` prop to specify a custom label for each item. ' +
          `An item was provided without a label: ${JSON.stringify(item)}`,
      );
    }

    const children =
      (storeParameters.getItemChildren
        ? storeParameters.getItemChildren(item)
        : (item as { children?: R[] }).children) || [];

    itemsChildren.push({ id, children });

    modelLookup[id] = item;

    metaLookup[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: isItemExpandable(item, children),
      disabled: storeParameters.isItemDisabled ? storeParameters.isItemDisabled(item) : false,
      selectable: storeParameters.isItemSelectionDisabled
        ? !storeParameters.isItemSelectionDisabled(item)
        : true,
      depth,
    };

    orderedChildrenIds.push(id);
  };

  for (const item of items) {
    processItem(item);
  }

  return {
    metaLookup,
    modelLookup,
    orderedChildrenIds,
    childrenIndexes: buildSiblingIndexes(orderedChildrenIds),
    itemsChildren,
  };
}

interface BuildItemsLookupsParameters<R extends TreeViewValidItem<R>> {
  items: readonly R[];
  storeParameters: Pick<
    MinimalTreeViewParameters<R, any>,
    'getItemId' | 'getItemLabel' | 'getItemChildren' | 'isItemDisabled' | 'isItemSelectionDisabled'
  >;
  parentId: string | null;
  depth: number;
  isItemExpandable: (item: R, children: R[] | undefined) => boolean;
  otherItemsMetaLookup: { [itemId: string]: TreeViewItemMeta };
}

function checkId<R extends TreeViewValidItem<R>>({
  id,
  parentId,
  item,
  itemMetaLookup,
  siblingsMetaLookup,
}: {
  id: TreeViewItemId | null;
  parentId: TreeViewItemId | null;
  item: R;
  itemMetaLookup: { [itemId: string]: TreeViewItemMeta };
  siblingsMetaLookup: { [itemId: string]: TreeViewItemMeta };
}) {
  if (id == null) {
    throw new Error(
      'MUI X Tree View: All items must have a unique `id` property. ' +
        'You can use the `getItemId` prop to specify a custom id for each item. ' +
        `An item was provided without an id: ${JSON.stringify(item)}`,
    );
  }

  if (
    siblingsMetaLookup[id] != null ||
    // Ignore items with the same parent id, because it's the same item from the previous generation.
    (itemMetaLookup[id] != null && itemMetaLookup[id]!.parentId !== parentId)
  ) {
    throw new Error(
      `MUI X Tree View: All items must have a unique \`id\` property. ` +
        `The id "${id}" is used by multiple items. ` +
        'Use the `getItemId` prop to specify a custom id for each item if needed.',
    );
  }
}
