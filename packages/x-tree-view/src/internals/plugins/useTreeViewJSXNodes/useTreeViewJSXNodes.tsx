import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewItemPlugin, TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesSignature } from './useTreeViewJSXNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider/useTreeViewContext';
import {
  DescendantProvider,
  TreeItemDescendant,
  useDescendant,
} from '../../TreeViewProvider/DescendantProvider';
import type { TreeItemProps } from '../../../TreeItem';
import type { TreeItem2Props } from '../../../TreeItem2';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  setState,
}) => {
  instance.preventItemUpdates();

  const insertJSXNode = useEventCallback((node: TreeViewNode) => {
    setState((prevState) => {
      if (prevState.nodes.nodeMap[node.id] != null) {
        throw new Error(
          [
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
            `Tow items were provided with the same id in the \`items\` prop: "${node.id}"`,
          ].join('\n'),
        );
      }

      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          nodeMap: { ...prevState.nodes.nodeMap, [node.id]: node },
          // For `SimpleTreeView`, we don't have a proper `item` object, so we create a very basic one.
          itemMap: { ...prevState.nodes.itemMap, [node.id]: { id: node.id, label: node.label } },
        },
      };
    });
  });

  const removeJSXNode = useEventCallback((itemId: string) => {
    setState((prevState) => {
      const newNodeMap = { ...prevState.nodes.nodeMap };
      const newItemMap = { ...prevState.nodes.itemMap };
      delete newNodeMap[itemId];
      delete newItemMap[itemId];
      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          nodeMap: newNodeMap,
          itemMap: newItemMap,
        },
      };
    });
    publishTreeViewEvent(instance, 'removeNode', { id: itemId });
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

  populateInstance<UseTreeViewJSXNodesSignature>(instance, {
    insertJSXNode,
    removeJSXNode,
    mapFirstCharFromJSX,
  });
};

const useTreeViewJSXNodesItemPlugin: TreeViewItemPlugin<TreeItemProps | TreeItem2Props> = ({
  props,
  rootRef,
  contentRef,
}) => {
  const { children, disabled = false, label, itemId, id } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();

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
    // On the first render a node's index will be -1. We want to wait for the real index.
    if (index !== -1) {
      instance.insertJSXNode({
        id: itemId,
        idAttribute: id,
        index,
        parentId,
        expandable,
        disabled,
      });

      return () => instance.removeJSXNode(itemId);
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

useTreeViewJSXNodes.itemPlugin = useTreeViewJSXNodesItemPlugin;

useTreeViewJSXNodes.wrapItem = ({ children, itemId }) => (
  <DescendantProvider id={itemId}>{children}</DescendantProvider>
);

useTreeViewJSXNodes.params = {};
