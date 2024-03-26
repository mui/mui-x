import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewItemPlugin, TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewJSXNodesSignature } from './useTreeViewJSXNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { useTreeViewContext } from '../../TreeViewProvider/useTreeViewContext';
import {
  TreeViewChildrenItemContext,
  TreeViewChildrenItemProvider,
} from '../../TreeViewProvider/TreeViewChildrenItemProvider';
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewNodes/useTreeViewNodes.utils';
import type { TreeItemProps } from '../../../TreeItem';
import type { TreeItem2Props } from '../../../TreeItem2';

export const useTreeViewJSXNodes: TreeViewPlugin<UseTreeViewJSXNodesSignature> = ({
  instance,
  setState,
  state,
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
          nodeMap: { ...prevState.nodes.nodeMap, [node.id]: { ...node, index: -1 } },
          // For `SimpleTreeView`, we don't have a proper `item` object, so we create a very basic one.
          itemMap: { ...prevState.nodes.itemMap, [node.id]: { id: node.id, label: node.label } },
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
        ...prevState.nodes,
        itemIndexes: {
          ...prevState.nodes.itemIndexes,
          [parentId ?? TREE_VIEW_ROOT_PARENT_ID]: indexes,
        },
      },
    }));
  };

  const getJSXItemsChildrenIndexes = (parentId: string | null) =>
    state.nodes.itemIndexes[parentId ?? TREE_VIEW_ROOT_PARENT_ID] ?? {};

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
  const { children, disabled = false, label, itemId, id } = props;
  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();

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
    instance.insertJSXNode({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled,
    });

    return () => instance.removeJSXNode(itemId);
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

useTreeViewJSXNodes.itemPlugin = useTreeViewJSXNodesItemPlugin;

useTreeViewJSXNodes.wrapItem = ({ children, itemId }) => (
  <TreeViewChildrenItemProvider id={itemId}>{children}</TreeViewChildrenItemProvider>
);

useTreeViewJSXNodes.wrapRoot = ({ children, rootRef }) => (
  <TreeViewChildrenItemProvider rootRef={rootRef}>{children}</TreeViewChildrenItemProvider>
);

useTreeViewJSXNodes.params = {};
