import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewItemPlugin, TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXItemsSignature } from './useTreeViewJSXItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider/useTreeViewContext';
import {
  DescendantProvider,
  TreeItemDescendant,
  useDescendant,
} from '../../TreeViewProvider/DescendantProvider';
import type { TreeItemProps } from '../../../TreeItem';
import type { TreeItem2Props } from '../../../TreeItem2';

export const useTreeViewJSXItems: TreeViewPlugin<UseTreeViewJSXItemsSignature> = ({
  instance,
  setState,
}) => {
  instance.preventItemUpdates();

  const insertJSXItem = useEventCallback((item: TreeViewNode) => {
    setState((prevState) => {
      if (prevState.items.nodeMap[item.id] != null) {
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
          nodeMap: { ...prevState.items.nodeMap, [item.id]: item },
          // For `SimpleTreeView`, we don't have a proper `item` object, so we create a very basic one.
          itemMap: { ...prevState.items.itemMap, [item.id]: { id: item.id, label: item.label } },
        },
      };
    });
  });

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

  const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };

  const expandable = isExpandable(children);

  const [treeItemElement, setTreeItemElement] = React.useState<HTMLLIElement | null>(null);
  const pluginContentRef = React.useRef<HTMLDivElement>(null);

  const handleRootRef = useForkRef(setTreeItemElement, rootRef);
  const handleContentRef = useForkRef(pluginContentRef, contentRef);

  const descendant = React.useMemo<TreeItemDescendant>(
    () => ({
      element: treeItemElement!,
      id: itemId,
    }),
    [itemId, treeItemElement],
  );

  const { index, parentId } = useDescendant(descendant);

  React.useEffect(() => {
    // On the first render a item's index will be -1. We want to wait for the real index.
    if (index !== -1) {
      instance.insertJSXItem({
        id: itemId,
        idAttribute: id,
        index,
        parentId,
        expandable,
        disabled,
      });

      return () => instance.removeJSXItem(itemId);
    }

    return undefined;
  }, [instance, parentId, index, itemId, expandable, disabled, id]);

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
  <DescendantProvider id={itemId}>{children}</DescendantProvider>
);

useTreeViewJSXItems.params = {};
