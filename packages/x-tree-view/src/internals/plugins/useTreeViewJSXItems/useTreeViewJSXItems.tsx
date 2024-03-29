import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewItemPlugin, TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXItemsSignature } from './useTreeViewJSXItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider/useTreeViewContext';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewItems/useTreeViewItems.utils';
import type { TreeItemProps } from '../../../TreeItem';
import type { TreeItem2Props } from '../../../TreeItem2';

export const useTreeViewJSXItems: TreeViewPlugin<UseTreeViewJSXItemsSignature> = ({
  instance,
  setState,
  state,
}) => {
  instance.preventItemUpdates();

  const insertJSXItem = useEventCallback((item: TreeViewNode) => {
    setState((prevState) => {
      if (prevState.items.nodeMap[item.id] != null) {
        throw new Error(
          [
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            `Tow items were provided with the same id in the \`items\` prop: "${item.id}"`,
          ].join('\n'),
        );
      }

      return {
        ...prevState,
        items: {
          ...prevState.items,
          nodeMap: { ...prevState.items.nodeMap, [item.id]: { ...item, index: -1 } },
          // For `SimpleTreeView`, we don't have a proper `item` object, so we create a very basic one.
          itemMap: { ...prevState.items.itemMap, [item.id]: { id: item.id, label: item.label } },
        },
      };
    });
  });

  const setJSXItemsChildrenIndexes = (
    parentId: string | null,
    indexes: { [id: string]: number },
  ) => {
    setState((prevState) => ({
      ...prevState,
      nodes: {
        ...prevState.items,
        itemIndexes: {
          ...prevState.items.itemIndexes,
          [parentId ?? TREE_VIEW_ROOT_PARENT_ID]: indexes,
        },
      },
    }));
  };

  const getJSXItemsChildrenIndexes = (parentId: string | null) =>
    state.items.itemIndexes[parentId ?? TREE_VIEW_ROOT_PARENT_ID] ?? {};

  const removeJSXItem = useEventCallback((itemId: string) => {
    setState((prevState) => {
      const newNodeMap = { ...prevState.items.nodeMap };
      const newItemMap = { ...prevState.items.itemMap };
      delete newNodeMap[itemId];
      delete newItemMap[itemId];
      return {
        ...prevState,
        items: {
          ...prevState.items,
          nodeMap: newNodeMap,
          itemMap: newItemMap,
        },
      };
    });
    publishTreeViewEvent(instance, 'removeItem', { id: itemId });
  });

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

  populateInstance<UseTreeViewJSXItemsSignature>(instance, {
    insertJSXItem,
    removeJSXItem,
    setJSXItemsChildrenIndexes,
    getJSXItemsChildrenIndexes,
    mapFirstCharFromJSX,
  });
};

const useTreeViewJSXItemsItemPlugin: TreeViewItemPlugin<TreeItemProps | TreeItem2Props> = ({
  props,
  rootRef,
  contentRef,
}) => {
  const { children, disabled = false, label, itemId, id } = props;
  const { instance } = useTreeViewContext<[UseTreeViewJSXItemsSignature]>();

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

  const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };

  const expandable = isExpandable(children);

  const pluginRootRef = React.useRef<HTMLLIElement>(null);
  const pluginContentRef = React.useRef<HTMLDivElement>(null);

  const handleRootRef = useForkRef(pluginRootRef, rootRef);
  const handleContentRef = useForkRef(pluginContentRef, contentRef);

  // Prevent any flashing
  useEnhancedEffect(() => {
    registerChild(itemId, pluginRootRef.current!);

    return () => {
      unregisterChild(itemId);
    };
  }, [registerChild, unregisterChild, itemId]);

  React.useEffect(() => {
    instance.insertJSXItem({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });

    return () => instance.removeJSXItem(itemId);
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
    rootRef: handleRootRef,
  };
};

useTreeViewJSXItems.itemPlugin = useTreeViewJSXItemsItemPlugin;

useTreeViewJSXItems.wrapItem = ({ children, itemId }) => (
  <TreeViewChildrenItemProvider id={itemId}>{children}</TreeViewChildrenItemProvider>
);

useTreeViewJSXItems.wrapRoot = ({ children, rootRef }) => (
  <TreeViewChildrenItemProvider rootRef={rootRef}>{children}</TreeViewChildrenItemProvider>
);

useTreeViewJSXItems.params = {};
