'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { TreeViewItemMeta, TreeViewPlugin } from '../../models';
import { UseTreeViewJSXItemsSignature } from './useTreeViewJSXItems.types';
import { TreeViewChildrenItemProvider } from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import {
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from '../useTreeViewItems/useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { useTreeViewJSXItemsItemPlugin } from './itemPlugin';

export const useTreeViewJSXItems: TreeViewPlugin<UseTreeViewJSXItemsSignature> = ({
  instance,
  store,
}) => {
  instance.preventItemUpdates();

  const insertJSXItem = useEventCallback((item: TreeViewItemMeta) => {
    if (store.state.items.itemMetaLookup[item.id] != null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          `Two items were provided with the same id in the \`items\` prop: "${item.id}"`,
        ].join('\n'),
      );
    }

    store.set('items', {
      ...store.state.items,
      itemMetaLookup: { ...store.state.items.itemMetaLookup, [item.id]: item },
      // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
      itemModelLookup: {
        ...store.state.items.itemModelLookup,
        [item.id]: { id: item.id, label: item.label ?? '' },
      },
    });

    return () => {
      const newItemMetaLookup = { ...store.state.items.itemMetaLookup };
      const newItemModelLookup = { ...store.state.items.itemModelLookup };
      delete newItemMetaLookup[item.id];
      delete newItemModelLookup[item.id];

      store.set('items', {
        ...store.state.items,
        itemMetaLookup: newItemMetaLookup,
        itemModelLookup: newItemModelLookup,
      });
    };
  });

  const setJSXItemsOrderedChildrenIds = (parentId: string | null, orderedChildrenIds: string[]) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;

    store.set('items', {
      ...store.state.items,
      itemOrderedChildrenIdsLookup: {
        ...store.state.items.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...store.state.items.itemChildrenIndexesLookup,
        [parentIdWithDefault]: buildSiblingIndexes(orderedChildrenIds),
      },
    });
  };

  const mapLabelFromJSX = useEventCallback((itemId: string, label: string) => {
    instance.updateLabelMap((labelMap) => {
      labelMap[itemId] = label;
      return labelMap;
    });

    return () => {
      instance.updateLabelMap((labelMap) => {
        const newMap = { ...labelMap };
        delete newMap[itemId];
        return newMap;
      });
    };
  });

  return {
    instance: {
      insertJSXItem,
      setJSXItemsOrderedChildrenIds,
      mapLabelFromJSX,
    },
  };
};

useTreeViewJSXItems.itemPlugin = useTreeViewJSXItemsItemPlugin;

useTreeViewJSXItems.wrapItem = ({ children, itemId, idAttribute }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const depthContext = React.useContext(TreeViewItemDepthContext);

  return (
    <TreeViewChildrenItemProvider itemId={itemId} idAttribute={idAttribute}>
      <TreeViewItemDepthContext.Provider value={(depthContext as number) + 1}>
        {children}
      </TreeViewItemDepthContext.Provider>
    </TreeViewChildrenItemProvider>
  );
};

useTreeViewJSXItems.wrapRoot = ({ children }) => (
  <TreeViewChildrenItemProvider itemId={null} idAttribute={null}>
    <TreeViewItemDepthContext.Provider value={0}>{children}</TreeViewItemDepthContext.Provider>
  </TreeViewChildrenItemProvider>
);

useTreeViewJSXItems.params = {};
