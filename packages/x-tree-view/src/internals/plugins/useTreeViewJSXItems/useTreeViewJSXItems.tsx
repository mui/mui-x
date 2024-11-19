import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewItemPlugin, TreeViewItemMeta, TreeViewPlugin } from '../../models';
import { UseTreeViewJSXItemsSignature } from './useTreeViewJSXItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import {
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from '../useTreeViewItems/useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';
import { isItemExpandable } from '../../../hooks/useTreeItemUtils/useTreeItemUtils';

export const useTreeViewJSXItems: TreeViewPlugin<UseTreeViewJSXItemsSignature> = ({
  instance,
  store,
}) => {
  instance.preventItemUpdates();

  const insertJSXItem = useEventCallback((item: TreeViewItemMeta) => {
    store.update((prevState) => {
      if (prevState.items.itemMetaLookup[item.id] != null) {
        throw new Error(
          [
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            `Two items were provided with the same id in the \`items\` prop: "${item.id}"`,
          ].join('\n'),
        );
      }

      return {
        ...prevState,
        items: {
          ...prevState.items,
          itemMetaLookup: { ...prevState.items.itemMetaLookup, [item.id]: item },
          // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
          itemModelLookup: {
            ...prevState.items.itemModelLookup,
            [item.id]: { id: item.id, label: item.label ?? '' },
          },
        },
      };
    });

    return () => {
      store.update((prevState) => {
        const newItemMetaLookup = { ...prevState.items.itemMetaLookup };
        const newItemModelLookup = { ...prevState.items.itemModelLookup };
        delete newItemMetaLookup[item.id];
        delete newItemModelLookup[item.id];
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaLookup: newItemMetaLookup,
            itemModelLookup: newItemModelLookup,
          },
        };
      });
      publishTreeViewEvent(instance, 'removeItem', { id: item.id });
    };
  });

  const setJSXItemsOrderedChildrenIds = (parentId: string | null, orderedChildrenIds: string[]) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;

    store.update((prevState) => ({
      ...prevState,
      items: {
        ...prevState.items,
        itemOrderedChildrenIdsLookup: {
          ...prevState.items.itemOrderedChildrenIdsLookup,
          [parentIdWithDefault]: orderedChildrenIds,
        },
        itemChildrenIndexesLookup: {
          ...prevState.items.itemChildrenIndexesLookup,
          [parentIdWithDefault]: buildSiblingIndexes(orderedChildrenIds),
        },
      },
    }));
  };

  const mapFirstCharFromJSX = useEventCallback((itemId: string, firstChar: string) => {
    instance.updateFirstCharMap((firstCharMap) => {
      firstCharMap[itemId] = firstChar;
      return firstCharMap;
    });

    return () => {
      instance.updateFirstCharMap((firstCharMap) => {
        const newMap = { ...firstCharMap };
        delete newMap[itemId];
        return newMap;
      });
    };
  });

  return {
    instance: {
      insertJSXItem,
      setJSXItemsOrderedChildrenIds,
      mapFirstCharFromJSX,
    },
  };
};

const useTreeViewJSXItemsItemPlugin: TreeViewItemPlugin = ({ props, rootRef, contentRef }) => {
  const { instance, store, treeId } = useTreeViewContext<[UseTreeViewJSXItemsSignature]>();
  const { children, disabled = false, label, itemId, id } = props;

  const parentContext = React.useContext(TreeViewChildrenItemContext);
  if (parentContext == null) {
    throw new Error(
      [
        'MUI X: Could not find the Tree View Children Item context.',
        'It looks like you rendered your component outside of a SimpleTreeView parent component.',
        'This can also happen if you are bundling multiple versions of the Tree View.',
      ].join('\n'),
    );
  }
  const { registerChild, unregisterChild, parentId } = parentContext;

  const expandable = isItemExpandable(children);
  const pluginContentRef = React.useRef<HTMLDivElement>(null);
  const handleContentRef = useForkRef(pluginContentRef, contentRef);

  // Prevent any flashing
  useEnhancedEffect(() => {
    const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });
    registerChild(idAttribute, itemId);

    return () => {
      unregisterChild(idAttribute);
      unregisterChild(idAttribute);
    };
  }, [store, instance, registerChild, unregisterChild, itemId, id, treeId]);

  useEnhancedEffect(() => {
    return instance.insertJSXItem({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });
  }, [instance, parentId, itemId, expandable, disabled, id]);

  React.useEffect(() => {
    if (label) {
      return instance.mapFirstCharFromJSX(
        itemId,
        (pluginContentRef.current?.textContent ?? '').substring(0, 1).toLowerCase(),
      );
    }
    return undefined;
  }, [instance, itemId, label]);

  return {
    contentRef: handleContentRef,
    rootRef,
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
