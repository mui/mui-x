import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import { TreeViewItemMeta } from '../../models';
import {
  UseTreeViewItemsParametersWithDefaults,
  UseTreeViewItemsState,
} from './useTreeViewItems.types';

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

type State = UseTreeViewItemsState<any>['items'];
export function buildItemsState(parameters: BuildItemsStateParameters): State {
  const { config, items: itemsParam, disabledItemsFocusable } = parameters;

  const itemMetaLookup: State['itemMetaLookup'] = {};
  const itemModelLookup: State['itemModelLookup'] = {};
  const itemOrderedChildrenIdsLookup: State['itemOrderedChildrenIdsLookup'] = {};
  const itemChildrenIndexesLookup: State['itemChildrenIndexesLookup'] = {};

  function processSiblings(
    items: readonly TreeViewBaseItem[],
    parentId: string | null,
    depth: number,
  ) {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes, itemsChildren } =
      buildItemsLookups({
        config,
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

  processSiblings(itemsParam, null, 0);

  return {
    disabledItemsFocusable,
    itemMetaLookup,
    itemModelLookup,
    itemOrderedChildrenIdsLookup,
    itemChildrenIndexesLookup,
  };
}

interface BuildItemsStateParameters extends Pick<BuildItemsLookupsParameters, 'items' | 'config'> {
  disabledItemsFocusable: boolean;
}

export function buildItemsLookups(parameters: BuildItemsLookupsParameters) {
  const { config, items, parentId, depth, isItemExpandable, otherItemsMetaLookup } = parameters;
  const metaLookup: State['itemMetaLookup'] = {};
  const modelLookup: State['itemModelLookup'] = {};
  const orderedChildrenIds: string[] = [];
  const itemsChildren: { id: string | null; children: TreeViewBaseItem[] }[] = [];

  const processItem = (item: TreeViewBaseItem) => {
    const id: string = config.getItemId ? config.getItemId(item) : (item as any).id;
    checkId(id, item, otherItemsMetaLookup, metaLookup);
    const label = config.getItemLabel
      ? config.getItemLabel(item)
      : (item as { label: string }).label;
    if (label == null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.',
          'An item was provided without label in the `items` prop:',
          JSON.stringify(item),
        ].join('\n'),
      );
    }

    const children =
      (config.getItemChildren
        ? config.getItemChildren(item)
        : (item as { children?: TreeViewBaseItem[] }).children) || [];

    itemsChildren.push({ id, children });

    modelLookup[id] = item;

    metaLookup[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: isItemExpandable(item, children),
      disabled: config.isItemDisabled ? config.isItemDisabled(item) : false,
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

interface BuildItemsLookupsParameters {
  items: readonly TreeViewBaseItem[];
  config: BuildItemsLookupConfig;
  parentId: string | null;
  depth: number;
  isItemExpandable: (item: TreeViewBaseItem, children: TreeViewBaseItem[] | undefined) => boolean;
  otherItemsMetaLookup: { [itemId: string]: TreeViewItemMeta };
}

function checkId(
  id: string | null,
  item: TreeViewBaseItem,
  itemMetaLookup: { [itemId: string]: TreeViewItemMeta },
  siblingsMetaLookup: { [itemId: string]: TreeViewItemMeta },
) {
  if (id == null) {
    throw new Error(
      [
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
        'An item was provided without id in the `items` prop:',
        JSON.stringify(item),
      ].join('\n'),
    );
  }

  if (itemMetaLookup[id] != null || siblingsMetaLookup[id] != null) {
    throw new Error(
      [
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
        `Two items were provided with the same id in the \`items\` prop: "${id}"`,
      ].join('\n'),
    );
  }
}

export interface BuildItemsLookupConfig
  extends Pick<
    UseTreeViewItemsParametersWithDefaults<TreeViewBaseItem>,
    'isItemDisabled' | 'getItemLabel' | 'getItemChildren' | 'getItemId'
  > {}
