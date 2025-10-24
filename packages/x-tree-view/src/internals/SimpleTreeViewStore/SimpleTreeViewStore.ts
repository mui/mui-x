import { EMPTY_ARRAY } from '@base-ui-components/utils/empty';
import { TreeViewParametersToStateMapper, MinimalTreeViewStore } from '../MinimalTreeViewStore';
import {
  InnerSimpleTreeViewParameters,
  SimpleTreeViewItem,
  SimpleTreeViewParameters,
  SimpleTreeViewPublicAPI,
  SimpleTreeViewState,
} from './SimpleTreeViewStore.types';
import { TreeViewItemId } from '../../models';
import { TreeViewItemMeta } from '../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from '../plugins/useTreeViewItems';
import { useItemPlugin, itemWrapper } from '../plugins/useTreeViewJSXItems';

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  SimpleTreeViewState<any>,
  InnerSimpleTreeViewParameters<any>
> = {
  getInitialState: (schedulerInitialState) => ({
    ...schedulerInitialState,
  }),
  updateStateFromParameters: (newSharedState) => {
    const newState: Partial<SimpleTreeViewState<any>> = {
      ...newSharedState,
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: () => true,
};

export class SimpleTreeViewStore<Multiple extends boolean | undefined> extends MinimalTreeViewStore<
  SimpleTreeViewItem,
  Multiple,
  SimpleTreeViewState<Multiple>,
  InnerSimpleTreeViewParameters<Multiple>
> {
  public constructor(parameters: SimpleTreeViewParameters<Multiple>, isRtl: boolean) {
    super({ ...parameters, items: EMPTY_ARRAY }, 'SimpleTreeView', isRtl, mapper);
    this.itemPluginManager.register(useItemPlugin, itemWrapper);
  }

  public updateStateFromParameters(parameters: SimpleTreeViewParameters<Multiple>, isRtl: boolean) {
    super.updateStateFromParameters({ ...parameters, items: EMPTY_ARRAY }, isRtl);
  }

  public buildPublicAPI(): SimpleTreeViewPublicAPI<Multiple> {
    return {
      ...super.buildPublicAPI(),
    };
  }

  /**
   * Insert a new item in the state from a Tree Item component.
   * @param {TreeViewItemMeta} item The meta-information of the item to insert.
   * @returns {() => void} A function to remove the item from the state.
   */
  public insertJSXItem = (item: TreeViewItemMeta) => {
    if (this.state.itemMetaLookup[item.id] != null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          `Two items were provided with the same id in the \`items\` prop: "${item.id}"`,
        ].join('\n'),
      );
    }

    this.update({
      itemMetaLookup: { ...this.state.itemMetaLookup, [item.id]: item },
      // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
      itemModelLookup: {
        ...this.state.itemModelLookup,
        [item.id]: { id: item.id, label: item.label ?? '' },
      },
    });

    return () => {
      const newItemMetaLookup = { ...this.state.itemMetaLookup };
      const newItemModelLookup = { ...this.state.itemModelLookup };
      delete newItemMetaLookup[item.id];
      delete newItemModelLookup[item.id];

      this.update({
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
    this.updateLabelMap((labelMap) => {
      labelMap[itemId] = label;
      return labelMap;
    });

    return () => {
      this.updateLabelMap((labelMap) => {
        const newMap = { ...labelMap };
        delete newMap[itemId];
        return newMap;
      });
    };
  };

  /**
   * Store the ids of a given item's children in the state.
   * Those ids must be passed in the order they should be rendered.
   * @param {TreeViewItemId | null} parentId The id of the item to store the children of.
   * @param {TreeViewItemId[]} orderedChildrenIds The ids of the item's children.
   */
  public setJSXItemsOrderedChildrenIds = (
    parentId: TreeViewItemId | null,
    orderedChildrenIds: TreeViewItemId[],
  ) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;

    this.update({
      itemOrderedChildrenIdsLookup: {
        ...this.state.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...this.state.itemChildrenIndexesLookup,
        [parentIdWithDefault]: buildSiblingIndexes(orderedChildrenIds),
      },
    });
  };
}
