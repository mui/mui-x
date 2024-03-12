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
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewNodes/useTreeViewNodes.utils';
import type { TreeItemProps } from '../../../TreeItem';
import type { TreeItem2Props } from '../../../TreeItem2';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  setState,
  state,
}) => {
  instance.preventItemUpdate();

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
          nodeMap: { ...prevState.nodes.nodeMap, [node.id]: { ...node, index: -1 } },
          // For `SimpleTreeView`, we don't have a proper `item` object, so we create a very basic one.
          itemMap: { ...prevState.nodes.itemMap, [node.id]: { id: node.id, label: node.label } },
        },
      };
    });
  });

  const setJSXItemsChildrenIndexes = useEventCallback(
    (parentId: string | null, indexes: { [id: string]: number }) => {
      setState((prevState) => ({
        ...prevState,
        nodes: {
          ...prevState.nodes,
          itemIndexes: {
            ...prevState.nodes.itemIndexes,
            [parentId ?? TREE_VIEW_ROOT_PARENT_ID]: indexes,
          },
        },
      }));
    },
  );

  const getJSXItemsChildrenIndexes = (parentId: string | null) =>
    state.nodes.itemIndexes[parentId ?? TREE_VIEW_ROOT_PARENT_ID] ?? {};

  const removeJSXNode = useEventCallback((nodeId: string) => {
    setState((prevState) => {
      const newNodeMap = { ...prevState.nodes.nodeMap };
      const newItemMap = { ...prevState.nodes.itemMap };
      delete newNodeMap[nodeId];
      delete newItemMap[nodeId];
      return {
        ...prevState,
        nodes: {
          ...prevState.nodes,
          nodeMap: newNodeMap,
          itemMap: newItemMap,
        },
      };
    });
    publishTreeViewEvent(instance, 'removeNode', { id: nodeId });
  });

  const mapFirstCharFromJSX = useEventCallback((nodeId: string, firstChar: string) => {
    instance.updateFirstCharMap((firstCharMap) => {
      firstCharMap[nodeId] = firstChar;
      return firstCharMap;
    });

    return () => {
      instance.updateFirstCharMap((firstCharMap) => {
        const newMap = { ...firstCharMap };
        delete newMap[nodeId];
        return newMap;
      });
    };
  });

  populateInstance<UseTreeViewJSXNodesSignature>(instance, {
    insertJSXNode,
    removeJSXNode,
    setJSXItemsChildrenIndexes,
    getJSXItemsChildrenIndexes,
    mapFirstCharFromJSX,
  });
};

const useTreeViewJSXNodesItemPlugin: TreeViewItemPlugin<TreeItemProps | TreeItem2Props> = ({
  props,
  rootRef,
  contentRef,
}) => {
  const { children, disabled = false, label, nodeId, id } = props;

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
      id: nodeId,
    }),
    [nodeId, treeItemElement],
  );

  const parentId = useDescendant(descendant);

  React.useEffect(() => {
    instance.insertJSXNode({
      id: nodeId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });

    return () => instance.removeJSXNode(nodeId);
  }, [instance, parentId, nodeId, expandable, disabled, id]);

  React.useEffect(() => {
    if (label) {
      return instance.mapFirstCharFromJSX(
        nodeId,
        (pluginContentRef.current?.textContent ?? '').substring(0, 1).toLowerCase(),
      );
    }
    return undefined;
  }, [instance, nodeId, label]);

  return {
    contentRef: handleContentRef,
    rootRef: handleRootRef,
  };
};

useTreeViewJSXNodes.itemPlugin = useTreeViewJSXNodesItemPlugin;

useTreeViewJSXNodes.wrapItem = ({ children, nodeId }) => (
  <DescendantProvider id={nodeId}>{children}</DescendantProvider>
);

useTreeViewJSXNodes.wrapRoot = ({ children }) => (
  <DescendantProvider>{children}</DescendantProvider>
);

useTreeViewJSXNodes.params = {};
